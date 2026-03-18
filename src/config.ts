import { homedir } from "node:os";
import { join } from "node:path";
import { mkdirSync } from "node:fs";
import type { ServiceEntry, UserConfig } from "./types.ts";
import { BUILTIN_SERVICES } from "./registry.ts";

export const CONFIG_DIR = join(homedir(), ".config", "alive");
const CONFIG_PATH = join(CONFIG_DIR, "services.json");

export async function loadUserConfig(): Promise<UserConfig> {
  try {
    const file = Bun.file(CONFIG_PATH);
    if (await file.exists()) {
      return (await file.json()) as UserConfig;
    }
  } catch {
    // corrupt config, start fresh
  }
  return { services: [] };
}

export async function saveUserConfig(config: UserConfig): Promise<void> {
  mkdirSync(CONFIG_DIR, { recursive: true });
  await Bun.write(CONFIG_PATH, JSON.stringify(config, null, 2) + "\n");
}

export function getAllServices(userConfig: UserConfig): ServiceEntry[] {
  const map = new Map<string, ServiceEntry>();
  for (const s of BUILTIN_SERVICES) map.set(s.name, s);
  for (const s of userConfig.services) map.set(s.name, s);
  return [...map.values()].sort((a, b) => a.name.localeCompare(b.name));
}

export async function loadAllServices(): Promise<ServiceEntry[]> {
  const userConfig = await loadUserConfig();
  return getAllServices(userConfig);
}
