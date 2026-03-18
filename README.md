# alive

Status pages from the terminal.

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
