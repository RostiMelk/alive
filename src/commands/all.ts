import { c } from "../colors.ts";
import { loadAllServices } from "../config.ts";
import { fetchStatus } from "../services.ts";
import { renderOverviewRow } from "../render.ts";

export async function cmdAll(): Promise<void> {
  const allServices = await loadAllServices();
  const nameWidth = Math.max(...allServices.map((s) => s.name.length));
  const batchSize = 6;

  console.log();
  console.log(`  ${c.bold}Service Status Overview${c.reset}`);
  console.log();

  for (let i = 0; i < allServices.length; i += batchSize) {
    const batch = allServices.slice(i, i + batchSize);
    const results = await Promise.all(
      batch.map(async (s) => ({
        service: s,
        data: await fetchStatus(s),
      })),
    );
    for (const { service, data } of results) {
      renderOverviewRow(service.name, data, nameWidth);
    }
  }

  console.log();
}
