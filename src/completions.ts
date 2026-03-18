import { homedir } from "node:os";
import { join } from "node:path";
import { mkdirSync, readFileSync, appendFileSync } from "node:fs";
import type { ServiceEntry } from "./types.ts";
import { CONFIG_DIR } from "./config.ts";

const FISH_COMPLETIONS_DIR = join(homedir(), ".config", "fish", "completions");

const SHELLS = {
  zsh: {
    file: join(CONFIG_DIR, "completions.zsh"),
    rc: join(homedir(), ".zshrc"),
    sourceLine: () =>
      `\n# alive completions\n[ -f "${join(CONFIG_DIR, "completions.zsh")}" ] && source "${join(CONFIG_DIR, "completions.zsh")}"\n`,
  },
  bash: {
    file: join(CONFIG_DIR, "completions.bash"),
    rc: join(homedir(), ".bashrc"),
    sourceLine: () =>
      `\n# alive completions\n[ -f "${join(CONFIG_DIR, "completions.bash")}" ] && source "${join(CONFIG_DIR, "completions.bash")}"\n`,
  },
  fish: {
    file: join(FISH_COMPLETIONS_DIR, "alive.fish"),
    rc: null,
    sourceLine: () => "",
  },
} as const;

type Shell = keyof typeof SHELLS;

function isShell(s: string): s is Shell {
  return s in SHELLS;
}

export function detectShell(): Shell {
  const shell = process.env.SHELL ?? "";
  if (shell.endsWith("/zsh")) return "zsh";
  if (shell.endsWith("/bash")) return "bash";
  if (shell.endsWith("/fish")) return "fish";
  return "zsh";
}

export function generateCompletions(
  shell: string,
  all: ServiceEntry[],
): string | null {
  const names = all.map((s) => s.name).join(" ");

  if (shell === "zsh") {
    return `#compdef alive
_alive() {
  local -a services flags
  services=(${all.map((s) => `'${s.name}'`).join(" ")})
  flags=('--list' '--add' '--remove' '--all' '--completions' '--setup-completions' '--help')
  _arguments '1:service:(${names})' '*:flags:($\{flags[@]\})'
}
compdef _alive alive
`;
  }

  if (shell === "bash") {
    return `_alive() {
  local cur=\${COMP_WORDS[COMP_CWORD]}
  local services="${names}"
  local flags="--list --add --remove --all --completions --setup-completions --help"
  COMPREPLY=( $(compgen -W "$services $flags" -- "$cur") )
}
complete -F _alive alive
`;
  }

  if (shell === "fish") {
    return (
      all
        .map((s) => `complete -c alive -f -a '${s.name}'`)
        .concat([
          "complete -c alive -f -l list -d 'List all services'",
          "complete -c alive -f -l add -d 'Add a custom service'",
          "complete -c alive -f -l remove -d 'Remove a custom service'",
          "complete -c alive -f -l all -d 'Overview of all services'",
          "complete -c alive -f -l completions -d 'Print shell completions'",
          "complete -c alive -f -l setup-completions -d 'Install shell completions'",
          "complete -c alive -f -l help -d 'Show help'",
        ])
        .join("\n") + "\n"
    );
  }

  return null;
}

function rcContainsSourceLine(
  rcPath: string,
  completionsPath: string,
): boolean {
  try {
    const content = readFileSync(rcPath, "utf-8");
    return content.includes(completionsPath);
  } catch {
    return false;
  }
}

export async function setupCompletions(
  shell: string,
  all: ServiceEntry[],
): Promise<{ installed: boolean; shell: Shell; file: string } | null> {
  const resolved = isShell(shell) ? shell : null;
  if (!resolved) return null;

  const config = SHELLS[resolved];
  const content = generateCompletions(resolved, all);
  if (!content) return null;

  mkdirSync(resolved === "fish" ? FISH_COMPLETIONS_DIR : CONFIG_DIR, {
    recursive: true,
  });
  await Bun.write(config.file, content);

  if (config.rc && !rcContainsSourceLine(config.rc, config.file)) {
    appendFileSync(config.rc, config.sourceLine());
  }

  return { installed: true, shell: resolved, file: config.file };
}

export async function refreshCompletions(all: ServiceEntry[]): Promise<void> {
  for (const [shell, config] of Object.entries(SHELLS)) {
    const file = Bun.file(config.file);
    if (await file.exists()) {
      const content = generateCompletions(shell, all);
      if (content) await Bun.write(config.file, content);
    }
  }
}
