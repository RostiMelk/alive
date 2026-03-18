import { c, fatal } from "./colors.ts";
import { BUILTIN_SERVICES } from "./registry.ts";
import { cmdAdd } from "./commands/add.ts";
import { cmdRemove } from "./commands/remove.ts";
import { cmdList } from "./commands/list.ts";
import { cmdAll } from "./commands/all.ts";
import { showCommand } from "./commands/show.ts";
import { cmdCompletions } from "./commands/completions.ts";
import { cmdSetupCompletions } from "./commands/setup-completions.ts";

function printUsage(): void {
  console.log(`
  ${c.bold}alive${c.reset} - status pages from the terminal

  ${c.bold}Usage${c.reset}
    alive ${c.dim}<service>${c.reset}          Show detailed status for a service
    alive ${c.dim}--all${c.reset}              Quick overview of all services
    alive ${c.dim}--list${c.reset}             List available services
    alive ${c.dim}--add <name> <url>${c.reset} Add a custom Statuspage service
    alive ${c.dim}--remove <name>${c.reset}    Remove a custom service
    alive ${c.dim}--setup-completions${c.reset}  Install shell completions (auto-detects shell)
    alive ${c.dim}--completions <sh>${c.reset}   Print raw completions (bash, zsh, fish)

  ${c.bold}Examples${c.reset}
    alive anthropic        Full status for Anthropic
    alive ant              Prefix match (resolves to anthropic)
    alive git              Prefix match (resolves to github)
    alive --all            One-line status for every service
    alive --add acme https://status.acme.com

  ${c.bold}Services${c.reset}  ${c.dim}(${BUILTIN_SERVICES.length} built-in, add your own with --add)${c.reset}
    ${c.dim}${BUILTIN_SERVICES.map((s) => s.name).join(", ")}${c.reset}
`);
}

const commands: Record<string, (args: string[]) => Promise<void>> = {
  "--setup-completions": cmdSetupCompletions,
  "--completions": cmdCompletions,
  "--list": cmdList,
  "-l": cmdList,
  "--add": cmdAdd,
  "--remove": cmdRemove,
  "--rm": cmdRemove,
  "--all": cmdAll,
  "-a": cmdAll,
};

export async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const first = args[0];

  if (!first || first === "--help" || first === "-h") {
    printUsage();
    return;
  }

  const handler = commands[first];
  if (handler) {
    await handler(args);
    return;
  }

  if (first.startsWith("-")) {
    printUsage();
    fatal(`Unknown flag: ${first}`);
  }

  await showCommand(args);
}
