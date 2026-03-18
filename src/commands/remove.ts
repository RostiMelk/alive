import { c, fatal } from "../colors.ts";
import { loadUserConfig } from "../config.ts";
import { saveAndRefresh } from "../mutations.ts";

export async function cmdRemove(args: string[]): Promise<void> {
  const name = args[1]?.toLowerCase();
  if (!name) fatal("Usage: alive --remove <name>");

  const userConfig = await loadUserConfig();
  const before = userConfig.services.length;
  userConfig.services = userConfig.services.filter((s) => s.name !== name);
  if (userConfig.services.length === before) {
    console.error(`${c.red}No custom service named "${name}" found.${c.reset}`);
    console.log(`  ${c.dim}(Built-in services cannot be removed.)${c.reset}`);
    process.exit(1);
  }
  await saveAndRefresh(userConfig);
  console.log(`  Removed ${c.bold}${name}${c.reset}`);
}
