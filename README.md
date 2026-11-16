# B2B Minecraft Bot

A Mineflayer-based Minecraft AFK / utility bot with an Express dashboard.

## Requirements
- Node.js 20 or newer
- npm
- A Minecraft server that permits automated clients/bots

## Configure
1. Edit `settings.json` and set the Minecraft server address, port, version, and bot username.
2. If the server requires `/login` or `/register`, enable `utils.auto-auth` and set its password locally. Do not commit real passwords.
3. Copy `.env.example` to `.env` and set a long, unique `DASHBOARD_PASSWORD`.

Auto-auth is disabled in the committed sample settings so no default login password is exposed.

## Run locally
```bash
npm ci
npm start
```

Dashboard: `http://localhost:5000`

The dashboard is protected with HTTP Basic Authentication. Use any username and the `DASHBOARD_PASSWORD` value as the password. The dashboard refuses access if the environment variable is missing.

## Notes
- The bot starts when the Node.js process starts.
- The dashboard has status, logs, and bot controls.
- Keep `.env`, real account passwords, and private webhook URLs out of Git.
- Oracle Always Free availability and uptime are not guaranteed; free instances may be reclaimed under Oracle's idle-instance policy.

## Upstream
Bot source copied from [warwolf0077-cyber/B2B-BOT](https://github.com/warwolf0077-cyber/B2B-BOT). The upstream package declares MIT licensing; see [LICENSE](LICENSE).
