# DanClaw

**Open-source AI agent for service businesses. Runs on Raspberry Pi 5. Connects to any LLM. No cloud dependency.**

**Site:** [danclaw.com](https://danclaw.com) | Built by [Dan Downey](https://dandowneyseo.com) | MIT License | v1.0.0

---

## What It Does

DanClaw is a local-first AI agent that runs on a Raspberry Pi 5 and connects directly to any LLM (OpenAI, Ollama, Claude, etc.). Designed for service businesses — towing operators, roadside assistance, EV charging, HVAC, plumbing — that need AI automation without paying for cloud infrastructure forever.

It handles inbound inquiries, qualifies leads, schedules jobs, and sends confirmations. All running on hardware you own.

---

## Why Raspberry Pi

No monthly SaaS fees. No vendor lock-in. No data leaving your local network unless you choose it. A $80 Raspberry Pi 5 runs this 24/7. You own the stack.

---

## Core Features

**Inbound lead handling** — Responds to web forms, SMS, and Telegram/Discord messages automatically.

**LLM-agnostic** — Swap between OpenAI, Anthropic Claude, or local Ollama models with a single config change.

**Job qualification** — Collects service location, vehicle type, issue description, and availability before routing to the operator.

**Notification routing** — Sends confirmed job details to operator via Telegram, SMS, or email.

**Local-first** — All data stays on your Pi unless explicitly configured otherwise.

---

## Tech Stack

Node.js | TypeScript | Raspberry Pi 5 | Telegram Bot API | OpenAI / Anthropic / Ollama | SQLite

---

## Quickstart

```bash
git clone https://github.com/dandowneyseo/danclaw.git
cd danclaw
cp .env.example .env
# Edit .env with your LLM API key and Telegram bot token
npm install
npm start
```

---

## Target Operators

DanClaw v1.0 is built for:

- Towing and roadside assistance companies
- Mobile EV charging operators
- HVAC, plumbing, and emergency home services
- Any local service business handling 10+ inbound inquiries per day

---

## Status

v1.0.0 — Active development. Core agent loop, LLM integration, and Telegram notifications are functional. SMS and web form integrations in progress.

---

## Related Projects

**[Sacramento Mobile EV Charging](https://github.com/dandowneyseo/sacramento-mobile-ev-charging)** — Live deployment use case for DanClaw.

**[Dan Downey Marketing](https://dandowneyseo.com)** — SEO and local authority systems built alongside DanClaw.

---

## License

MIT — Use it, fork it, build on it.
