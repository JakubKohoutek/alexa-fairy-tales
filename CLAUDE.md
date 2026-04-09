# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- **Build:** `npm run build` (compiles TypeScript to `lib/`)
- **Start:** `npm start` (compiles and runs `lib/index.js`)
- **Dev run:** `npm run try` (runs directly via ts-node)
- **Test:** `npm test` (Jest, tests in `src/` matching `*.test.ts`)
- **Lint:** `npm run lint` (ESLint with `@typescript-eslint`)
- **Deploy:** `npm run deploy` (kills existing process on PORT, starts new one)

## Architecture

This is an Alexa skill handler for a "Fairy Tales" audio playback skill, built with the ASK SDK (Alexa Skills Kit) and served via Express with `ask-sdk-express-adapter` for request signature verification.

**Entry point:** `src/index.ts` loads audio files from `public_media/` then starts the Express server with graceful shutdown on SIGTERM/SIGINT.

**Request flow:** Express receives POST requests at `/`, which are verified and dispatched by `ExpressAdapter` to the ASK SDK skill (`src/skill_builder.ts`), which routes to handlers based on request type. Request interceptors load persistent attributes before handling; response interceptors save them after.

**Key layers:**
- `src/server.ts` - Express server with `ExpressAdapter` for Alexa request verification, also serves static files from `public_media/`
- `src/skill_builder.ts` - Registers all handlers, interceptors, and the persistence adapter
- `src/handlers/` - Intent/event handlers (launch, audio playback controls, help, cancel/stop, error, session ended)
- `src/interceptors/persistent_attributes.ts` - Loads/saves per-user playback state (current track index, offset, playlist) via the persistence adapter
- `src/utils/persistence_adapter.ts` - In-memory persistence adapter (keyed by Alexa userId, not durable across restarts)
- `src/utils/audio_files.ts` - Reads MP3 filenames from `public_media/` at startup, constructs URLs using `MEDIA_URL_BASE` env var
- `src/utils/audio_player.ts` - Builds AudioPlayer directives for playback
- `src/utils/playback_info.ts` - Playlist navigation (next/prev with wrapping)

**Environment variables:** `MEDIA_URL_BASE` (base URL for audio files), `PORT` (default 3000).

**Prerequisite:** A `public_media/` directory with `.mp3` files must exist at project root before running.

## Lint Rules

Uses ESLint with `@typescript-eslint`. Key rules: single quotes, no trailing commas, 120 char line length, no spaces inside braces, blank line before return. Config in `eslint.config.js` (flat config format).

## TypeScript

Target: ES2022. Strict mode enabled with `noFallthroughCasesInSwitch`, `noUnusedLocals`, `noUnusedParameters`, `noImplicitReturns`.

## CI/CD

GitHub Actions on master: runs tests, then deploys via SSH to a remote server (pulls latest, builds, restarts systemd service `alexa-fairy-tales`).

## Node Version

Node 22 (specified in `.nvmrc`).
