import { c, fatal } from "../colors.ts";
import { loadAllServices } from "../config.ts";
import { setupCompletions, detectShell } from "../completions.ts";

export async function cmdSetupCompletions(args: string[]): Promise<void> {
  const shell = args[1] ?? detectShell();
  const allServices = await loadAllServices();
  const result = await setupCompletions(shell, allServices);
  if (!result) fatal(`Unknown shell: ${shell}. Use bash, zsh, or fish.`);
  console.log(
    `  ${c.green}✓${c.reset} Installed ${c.bold}${result.shell}${c.reset} completions to ${c.dim}${result.file}${c.reset}`,
  );
  console.log(
    `  ${c.dim}Restart your shell or run: source ${result.file}${c.reset}`,
  );
}
