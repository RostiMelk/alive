import { c } from "./colors.ts";
import { elapsed, shortTime, sep, pad, rpad, wordWrap } from "./format.ts";
import {
  componentColor,
  componentIcon,
  componentLabel,
  overallColor,
  overallIcon,
  incidentStatusColor,
  impactColor,
} from "./status.ts";
import type { SummaryResponse } from "./types.ts";

export function renderDetail(data: SummaryResponse): void {
  const { page, status, components, incidents = [] } = data;

  const showcased = components.filter((comp) => !comp.group && !comp.group_id);
  if (showcased.length === 0) {
    showcased.push(...components.filter((comp) => !comp.group));
  }

  const nameWidth = Math.max(...showcased.map((comp) => comp.name.length), 10);
  const labelWidth = Math.max(
    ...showcased.map((comp) => componentLabel(comp.status).length),
    8,
  );
  const ageWidth = Math.max(
    ...showcased.map((comp) => elapsed(comp.updated_at).length),
    5,
  );
  const totalWidth = 2 + 1 + 1 + nameWidth + 2 + labelWidth + 2 + ageWidth;
  const lineWidth = Math.max(totalWidth, 52);

  const oc = overallColor(status.indicator);
  const oi = overallIcon(status.indicator);

  console.log();
  console.log(
    `  ${c.bold}${c.white}${page.name}${c.reset}  ${c.dim}${page.url}${c.reset}`,
  );
  console.log(`  ${oc}${c.bold}${oi} ${status.description}${c.reset}`);
  console.log();
  console.log("  " + sep(lineWidth));

  if (showcased.length > 0) {
    console.log(`  ${c.bold}Components${c.reset}`);
    console.log();
    for (const comp of showcased) {
      const col = componentColor(comp.status);
      const icon = componentIcon(comp.status);
      const label = componentLabel(comp.status);
      const age = elapsed(comp.updated_at);
      console.log(
        `  ${col}${icon}${c.reset} ${pad(comp.name, nameWidth)}  ${col}${pad(label, labelWidth)}${c.reset}  ${c.dim}${rpad(age, ageWidth)}${c.reset}`,
      );
    }
    console.log();
    console.log("  " + sep(lineWidth));
  }

  if (incidents.length === 0) {
    console.log(`  ${c.dim}No active incidents.${c.reset}`);
    console.log();
    return;
  }

  console.log(
    `  ${c.bold}Active Incidents${c.reset}  ${c.dim}(${incidents.length})${c.reset}`,
  );

  const updateStatuses = incidents.flatMap((i) =>
    i.incident_updates.map((u) => u.status),
  );
  const statusColWidth = Math.max(...updateStatuses.map((s) => s.length), 12);
  const timeColWidth = 8;
  const bodyIndent = 2 + timeColWidth + 2 + statusColWidth + 2;
  const bodyWidth = Math.max(lineWidth - bodyIndent, 30);

  for (const incident of incidents) {
    const ic = impactColor(incident.impact);
    const duration = elapsed(incident.started_at);
    const sc = incidentStatusColor(incident.status);

    console.log();
    console.log(`  ${ic}${c.bold}${incident.name}${c.reset}`);
    console.log(
      `  ${sc}${pad(incident.status, statusColWidth)}${c.reset}  ` +
        `${c.dim}impact: ${incident.impact}${c.reset}  ` +
        `${c.dim}started ${duration}${c.reset}`,
    );

    if (incident.incident_updates.length > 0) {
      console.log();
      for (const update of incident.incident_updates) {
        const time = shortTime(update.created_at);
        const usc = incidentStatusColor(update.status);
        const bodyLines = wordWrap(update.body, bodyWidth);
        const prefix = `  ${c.dim}${rpad(time, timeColWidth)}${c.reset}  ${usc}${pad(update.status, statusColWidth)}${c.reset}  `;
        const blankPrefix = " ".repeat(bodyIndent);
        console.log(`${prefix}${c.dim}${bodyLines[0] ?? ""}${c.reset}`);
        for (const l of bodyLines.slice(1)) {
          console.log(`${blankPrefix}${c.dim}${l}${c.reset}`);
        }
      }
    }
  }
  console.log();
  console.log("  " + sep(lineWidth));
  console.log(
    `  ${c.dim}Updated ${new Date(page.updated_at).toLocaleString()}${c.reset}`,
  );
  console.log();
}

export function renderOverviewRow(
  name: string,
  data: SummaryResponse | null,
  nameWidth: number,
): void {
  if (!data) {
    console.log(
      `  ${c.dim}?${c.reset} ${pad(name, nameWidth)}  ${c.dim}unreachable${c.reset}`,
    );
    return;
  }

  const oc = overallColor(data.status.indicator);
  const oi = overallIcon(data.status.indicator);
  const desc = data.status.description;
  const incidentCount = data.incidents?.length ?? 0;
  const incidentSuffix =
    incidentCount > 0
      ? `  ${c.yellow}${incidentCount} incident${incidentCount > 1 ? "s" : ""}${c.reset}`
      : "";

  console.log(
    `  ${oc}${oi}${c.reset} ${pad(name, nameWidth)}  ${oc}${desc}${c.reset}${incidentSuffix}`,
  );
}
