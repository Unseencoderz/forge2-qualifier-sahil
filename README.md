# Forge 2 · Edition 1 Qualifier — Sahil Gautam

This project is a Forge 2 qualifier submission with a documented two-agent system and a working Kanban app. Hermes acts as the planning/orchestration agent, and OpenClaw acts as the coding/execution agent.

## Live URL
[to be filled after deployment]

## Agent System
- OpenClaw (the hands): coding agent, works in #agent-coder
- Hermes (the brain): orchestrator, plans in #sprint-main

## Models Used and Why
- Both agents: google/gemini-2.5-flash
- Reason: 1 million TPM free tier handles large codebase contexts. Groq was initially used but hit 12,000 TPM ceiling at 53,000 token context. Gemini resolved this.

## Slack Channel Scheme
- #sprint-main: human talks to Hermes, plans land here
- #agent-coder: OpenClaw works and reports here
- #agent-log: autonomous cron runs logged here

## Kanban App Features
- [x] Boards can be created, viewed, and deleted
- [x] Lists can be added to boards and deleted
- [x] Cards can be created, edited, deleted, and moved between lists
- [x] Tags can be created and attached or detached from cards
- [x] Members can be created and assigned to cards, with overdue card styling

## Local Run Instructions

### Backend
```bash
cd backend
php artisan serve --port=8000
```

If starting from a fresh checkout:

```bash
cd backend
composer install
copy .env.example .env
php artisan key:generate
New-Item database/database.sqlite -ItemType File
php artisan migrate
php artisan serve --port=8000
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`.

## Tech Stack
- Backend: Laravel PHP 8.4, SQLite, REST API
- Frontend: React + Vite, Axios
- Agents: OpenClaw + Hermes
- Models: Google Gemini 2.5 Flash
- Comms: Slack Socket Mode

## Rate Limit Note
Groq's 12,000 TPM free limit was hit when OpenClaw's context grew to 53,000 tokens mid-build. The project switched to Gemini 2.5 Flash with a 1M TPM free tier. This is documented in the handbook as an expected challenge and is evidence of real large-context agent usage.
