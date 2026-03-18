import { fatal } from "../colors.ts";
import { loadAllServices } from "../config.ts";
import { generateCompletions } from "../completions.ts";

export async function cmdCompletions(args: string[]): Promise<void> {
  const allServices = await loadAllServices();
  const shell = args[1] ?? "bash";
  const output = generateCompletions(shell, allServices);
  if (!output) fatal(`Unknown shell: ${shell}. Use bash, zsh, or fish.`);
  process.stdout.write(output);
}
