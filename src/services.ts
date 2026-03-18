import type { ServiceEntry, SummaryResponse } from "./types.ts";

export function resolveService(
  query: string,
  all: ServiceEntry[],
): ServiceEntry | ServiceEntry[] | null {
  const q = query.toLowerCase();
  const exact = all.find((s) => s.name === q);
  if (exact) return exact;
  const prefixed = all.filter((s) => s.name.startsWith(q));
  if (prefixed.length === 1) return prefixed[0]!;
  if (prefixed.length > 1) return prefixed;
  return null;
}

function baseUrl(service: ServiceEntry): string {
  return service.url.replace(/\/+$/, "");
}

const UPTIME_RE =
  /id="uptime-percent-([^"]+)"[^>]*>\s*<var[^>]*>([\d.]+)<\/var>/g;

async function fetchUptime(
  service: ServiceEntry,
): Promise<Map<string, number>> {
  const map = new Map<string, number>();
  try {
    const res = await fetch(baseUrl(service), {
      headers: { accept: "text/html" },
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) return map;
    const html = await res.text();
    for (const match of html.matchAll(UPTIME_RE)) {
      const pct = parseFloat(match[2]!);
      if (!Number.isNaN(pct)) map.set(match[1]!, pct);
    }
  } catch {
    // uptime is best-effort
  }
  return map;
}

async function fetchSummaryJson(
  service: ServiceEntry,
): Promise<SummaryResponse | null> {
  try {
    const res = await fetch(baseUrl(service) + "/api/v2/summary.json", {
      headers: { accept: "application/json" },
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) return null;
    return (await res.json()) as SummaryResponse;
  } catch {
    return null;
  }
}

export async function fetchStatus(
  service: ServiceEntry,
): Promise<SummaryResponse | null> {
  const [summary, uptime] = await Promise.all([
    fetchSummaryJson(service),
    fetchUptime(service),
  ]);
  if (!summary) return null;
  if (uptime.size > 0) summary.uptime = uptime;
  return summary;
}
