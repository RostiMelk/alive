import { c } from "../colors.ts";
import { pad } from "../format.ts";
import { BUILTIN_SERVICES } from "../registry.ts";
import { loadAllServices } from "../config.ts";

export async function cmdList(): Promise<void> {
  const allServices = await loadAllServices();
  const builtinNames = new Set(BUILTIN_SERVICES.map((s) => s.name));
  const nameW = Math.max(...allServices.map((s) => s.name.length));

  console.log();
  console.log(`  ${c.bold}Available Services${c.reset}`);
  console.log();
  for (const s of allServices) {
    const tag = builtinNames.has(s.name)
      ? ""
      : `  ${c.magenta}(custom)${c.reset}`;
    console.log(`  ${pad(s.name, nameW)}  ${c.dim}${s.url}${c.reset}${tag}`);
  }
  console.log();
}
