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

export async function fetchStatus(
  service: ServiceEntry,
): Promise<SummaryResponse | null> {
  const url = service.url.replace(/\/+$/, "") + "/api/v2/summary.json";
  try {
    const res = await fetch(url, {
      headers: { accept: "application/json" },
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) return null;
    return (await res.json()) as SummaryResponse;
  } catch {
    return null;
  }
}
