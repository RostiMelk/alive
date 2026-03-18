import { c, fatal } from "../colors.ts";
import { loadAllServices } from "../config.ts";
import { resolveService, fetchStatus } from "../services.ts";
import { renderDetail } from "../render.ts";

export async function showCommand(args: string[]): Promise<void> {
  const allServices = await loadAllServices();

  for (const query of args) {
    const match = resolveService(query, allServices);

    if (!match) {
      fatal(
        `No service matching "${query}". Run alive --list to see available services.`,
      );
    }

    if (Array.isArray(match)) {
      console.error(
        `${c.yellow}Ambiguous: "${query}" matches ${match.length} services:${c.reset}`,
      );
      for (const s of match) {
        console.error(`  ${c.dim}-${c.reset} ${s.name}`);
      }
      process.exit(1);
    }

    const data = await fetchStatus(match);
    if (!data) {
      fatal(`Failed to fetch status for ${match.name} (${match.url})`);
    }

    renderDetail(data);
  }
}
