export const c = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  dim: "\x1b[2m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  red: "\x1b[31m",
  cyan: "\x1b[36m",
  white: "\x1b[97m",
  magenta: "\x1b[35m",
} as const;

export function fatal(msg: string): never {
  console.error(`${c.red}${msg}${c.reset}`);
  process.exit(1);
}
