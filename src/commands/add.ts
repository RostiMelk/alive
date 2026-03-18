import { c, fatal } from "../colors.ts";
import { loadUserConfig } from "../config.ts";
import { saveAndRefresh } from "../mutations.ts";
import { fetchStatus } from "../services.ts";

export async function cmdAdd(args: string[]): Promise<void> {
  const name = args[1]?.toLowerCase();
  const url = args[2];
  if (!name || !url) fatal("Usage: alive --add <name> <url>");
  if (!/^https?:\/\//.test(url))
    fatal("URL must start with http:// or https://");

  process.stdout.write(`  ${c.dim}Verifying ${url}...${c.reset}`);
  const testData = await fetchStatus({ name, url });
  if (!testData) {
    console.log(
      `\r  ${c.red}✗ Could not reach a Statuspage API at ${url}${c.reset}  `,
    );
    fatal("Make sure the URL is the base (e.g. https://status.example.com)");
  }
  console.log(
    `\r  ${c.green}✓ ${testData.page.name}${c.reset}                    `,
  );

  const userConfig = await loadUserConfig();
  userConfig.services = userConfig.services.filter((s) => s.name !== name);
  userConfig.services.push({ name, url: url.replace(/\/+$/, "") });
  userConfig.services.sort((a, b) => a.name.localeCompare(b.name));
  await saveAndRefresh(userConfig);
  console.log(`  Added ${c.bold}${name}${c.reset} ${c.dim}(${url})${c.reset}`);
  console.log();
}
