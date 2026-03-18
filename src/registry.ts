import type { ServiceEntry } from "./types.ts";

export const BUILTIN_SERVICES: ServiceEntry[] = [
  { name: "anthropic", url: "https://status.anthropic.com" },
  { name: "openai", url: "https://status.openai.com" },
  { name: "github", url: "https://www.githubstatus.com" },
  { name: "vercel", url: "https://www.vercel-status.com" },
  { name: "netlify", url: "https://www.netlifystatus.com" },
  { name: "sanity", url: "https://www.sanity-status.com" },
  { name: "cloudflare", url: "https://www.cloudflarestatus.com" },
  { name: "discord", url: "https://discordstatus.com" },
  { name: "notion", url: "https://status.notion.so" },
  { name: "figma", url: "https://status.figma.com" },
  { name: "linear", url: "https://linearstatus.com" },
  { name: "reddit", url: "https://www.redditstatus.com" },
  { name: "twilio", url: "https://status.twilio.com" },
  { name: "datadog", url: "https://status.datadoghq.com" },
  { name: "atlassian", url: "https://status.atlassian.com" },
  { name: "bitbucket", url: "https://bitbucket.status.atlassian.com" },
  { name: "hashicorp", url: "https://status.hashicorp.com" },
  { name: "newrelic", url: "https://status.newrelic.com" },
  { name: "digitalocean", url: "https://status.digitalocean.com" },
  { name: "fly", url: "https://status.flyio.net" },
];
