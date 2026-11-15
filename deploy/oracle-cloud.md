# Oracle Cloud Always Free deployment (Ubuntu)

These steps assume the repository has been cloned to `/opt/b2b-bot`.

## 1. Install Node.js
Install Node.js 20+ and npm from the official NodeSource packages or Ubuntu packages.
Then run:
```bash
node --version
npm --version
```

## 2. Install the bot
```bash
sudo mkdir -p /opt/b2b-bot
sudo chown -R "$USER":"$USER" /opt/b2b-bot
git clone https://github.com/mdzihadss509-del/DRAGON.git /opt/b2b-bot
cd /opt/b2b-bot
npm ci
```

## 3. Create a dedicated service user and environment file
```bash
sudo useradd --system --home /opt/b2b-bot --shell /usr/sbin/nologin b2bbot
sudo mkdir -p /etc/b2b-bot
sudo nano /etc/b2b-bot/bot.env
```
Add:
```dotenv
PORT=5000
DASHBOARD_PASSWORD=use-a-long-unique-password
```
Protect it:
```bash
sudo chmod 600 /etc/b2b-bot/bot.env
```

## 4. Set ownership and Minecraft settings
Set `settings.json` to the desired server address, port, version and bot username. If auto-auth is needed, set the password on the VPS only and do not commit it.
```bash
sudo chown -R b2bbot:b2bbot /opt/b2b-bot
```

## 5. Install systemd service
Copy `deploy/b2b-bot.service` to `/etc/systemd/system/b2b-bot.service`, then:
```bash
sudo systemctl daemon-reload
sudo systemctl enable --now b2b-bot
sudo systemctl status b2b-bot
sudo journalctl -u b2b-bot -f
```

## 6. Open dashboard port
Allow TCP port 5000 in the Oracle Cloud VCN security list / network security group and Ubuntu firewall only if you need direct access. Prefer restricting access to your own IP address. The dashboard requires HTTP Basic Authentication.
