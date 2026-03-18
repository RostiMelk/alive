import type { UserConfig } from "./types.ts";
import { saveUserConfig, getAllServices } from "./config.ts";
import { refreshCompletions } from "./completions.ts";

export async function saveAndRefresh(config: UserConfig): Promise<void> {
  await saveUserConfig(config);
  const all = getAllServices(config);
  await refreshCompletions(all);
}
