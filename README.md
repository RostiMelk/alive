# alive

Status pages from the terminal. Works with any [Atlassian Statuspage](https://www.atlassian.com/software/statuspage) service.

## Getting started

```sh
bunx alive-sh anthropic
```

Or install globally:

```sh
bun install -g alive-sh
alive --setup-completions
```

## Usage

```sh
alive anthropic          # detailed status
alive ant                # prefix matching
alive --all              # overview of all services
alive --list             # list available services
alive --add sentry https://status.sentry.io
alive --remove sentry
```

20 services built-in: anthropic, atlassian, bitbucket, cloudflare, datadog, digitalocean, discord, figma, fly, github, hashicorp, linear, netlify, newrelic, notion, openai, reddit, sanity, twilio, vercel.

Add any Statuspage-powered service with `alive --add <name> <url>`. Custom services are stored in `~/.config/alive/services.json`.
