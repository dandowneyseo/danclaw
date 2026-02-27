# DanClaw

**Open-source AI agent for service businesses. Runs on Raspberry Pi 5. Connects to any LLM. No cloud dependency.**

**Site:** [danclaw.ai](https://danclaw.ai) | **Built by** [Dan Downey](https://dandowneyseo.com) | MIT License | v1.0.0

---

## What Is DanClaw?

DanClaw is a local-first AI agent that runs on a Raspberry Pi 5 and connects to any LLM (OpenAI, Anthropic, Google Gemini, or local Ollama). It is designed for any service business — towing, roadside assistance, EV charging, HVAC, plumbing, landscaping, cleaning, pest control — that wants AI automation without paying for cloud infrastructure forever.

DanClaw handles inbound inquiries, qualifies leads, schedules jobs, and sends real-time job notifications to your phone via Telegram. Everything runs on hardware you own.

---

## Hardware Requirements

- **Raspberry Pi 5** (4GB or 8GB RAM recommended)
- **MicroSD card** — 64GB or larger (Class 10 / A2 rated)
- **Power supply** — official Raspberry Pi 27W USB-C adapter
- **Internet connection** — wired Ethernet preferred, WiFi works
- Raspberry Pi OS (64-bit Lite) flashed to the SD card

---

## Quick Install

### Step 1 — Flash your SD card

Download [Raspberry Pi Imager](https://www.raspberrypi.com/software/) and flash **Raspberry Pi OS Lite (64-bit)** to your SD card. Enable SSH and set your WiFi credentials in the imager settings.

### Step 2 — SSH into your Pi

```
ssh pi@raspberrypi.local
```

### Step 3 — Run the DanClaw installer

```bash
curl -fsSL https://raw.githubusercontent.com/dandowneyseo/danclaw/main/scripts/danclaw-install.sh | bash
```

The installer is idempotent — safe to run again if anything fails.

### Step 4 — Open the setup wizard

Open a browser on any device on your local network and go to:

```
http://danclaw.local
```

Complete the 4-step wizard in under 2 minutes. No technical knowledge required.

---

## What the Installer Does

1. Updates your Pi and installs Node.js 20
2. Installs all DanClaw dependencies
3. Sets your Pi hostname to `danclaw`
4. Clones or updates the DanClaw repo
5. Builds the TypeScript source
6. Installs DanClaw as a systemd service (auto-starts on boot)
7. Enables Avahi for `danclaw.local` DNS resolution

---

## Setup Wizard Screens

**Screen 1 — Welcome:** Introduction and overview. Click Get Started.

**Screen 2 — Connect Your AI:** Choose your LLM provider (OpenAI, Anthropic, Google Gemini, or local Ollama) and enter your API key. DanClaw tests the connection before proceeding. Your key never leaves your device.

**Screen 3 — Your Business:** Enter your business name, city, phone number, website, business type, and Telegram bot credentials.

**Screen 4 — Done:** Your agent is live. Open Telegram to receive job notifications.

---

## Telegram Setup

DanClaw uses Telegram for all notifications. You need two things:

1. **Bot token** — Message [@BotFather](https://t.me/BotFather) on Telegram, create a new bot, copy the token
2. **Your Chat ID** — Message [@userinfobot](https://t.me/userinfobot) on Telegram, it replies with your Chat ID

Enter both in the wizard on Screen 3.

---

## Supported LLM Providers

- **OpenAI** — GPT-4o (get key at platform.openai.com/api-keys)
- **Anthropic** — Claude (get key at console.anthropic.com)
- **Google** — Gemini (get key at aistudio.google.com)
- **Ollama** — Free, runs locally on the Pi (install at ollama.ai)

Users bring their own API key. DanClaw never stores keys on any remote server.

---

## Factory Reset

To reset DanClaw to factory defaults and run the wizard again:

```bash
rm -rf ~/.danclaw/config.json
sudo systemctl restart danclaw
```

Then open `http://danclaw.local` in your browser.

---

## Project Structure

```
danclaw/
├── assets/
│   └── crab.svg
├── scripts/
│   └── danclaw-install.sh
├── src/
│   ├── config/
│   │   ├── config.template.json
│   │   └── system-prompt.template.txt
│   ├── splash/
│   │   ├── splash.html
│   │   └── splash-cli.ts
│   ├── wizard/
│   │   └── wizard.html
│   ├── index.ts
│   └── wizard-server.ts
├── package.json
├── tsconfig.json
└── README.md
```

---

## Support

**Text Dan:** (916) 826-9410
**Website:** [danclaw.ai](https://danclaw.ai)
**GitHub:** [github.com/dandowneyseo/danclaw](https://github.com/dandowneyseo/danclaw)

---

## License

MIT License — free to use, modify, and distribute. Attribution appreciated.

Built by [Dan Downey](https://dandowneyseo.com) — Sacramento, CA.
