import { c } from "./colors.ts";

export function elapsed(isoDate: string): string {
  const ms = Date.now() - new Date(isoDate).getTime();
  const mins = Math.floor(ms / 60_000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  const rem = mins % 60;
  if (hrs < 24) return rem > 0 ? `${hrs}h ${rem}m ago` : `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export function shortTime(isoDate: string): string {
  return new Date(isoDate).toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function sep(width: number, char = "\u2500"): string {
  return c.dim + char.repeat(width) + c.reset;
}

export function pad(str: string, width: number): string {
  return str + " ".repeat(Math.max(0, width - str.length));
}

export function rpad(str: string, width: number): string {
  return " ".repeat(Math.max(0, width - str.length)) + str;
}

export function wordWrap(text: string, width: number): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    if (line && (line + word).length > width) {
      lines.push(line.trimEnd());
      line = "";
    }
    line += word + " ";
  }
  if (line.trim()) lines.push(line.trimEnd());
  return lines;
}
