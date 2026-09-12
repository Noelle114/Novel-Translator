# Novel Translator

Local-first Electron desktop app for translating EPUB and PDF novels.

## Quick start

```bash
pnpm install
pnpm dev
```

## Features

- Import EPUB / PDF documents
- Translate with OpenAI, Gemini, DeepL, or DeepSeek
- Selectable target language (Chinese / English / Turkish) with automatic source-language detection
- Context-aware translation mode
- Global and per-project glossaries with CSV import
- Start / pause / resume / stop run control, parallel translation with retry and backoff
- Paragraph editor (merge, split, edit translation)
- Export to EPUB / PDF
- Localized UI (Chinese / English / Turkish)

## Architecture

pnpm monorepo:

| Package | Purpose |
| --- | --- |
| `apps/desktop` | Electron main / preload / renderer |
| `packages/shared` | Zod schemas, IPC contracts, constants |
| `packages/domain` | Translation state machine, glossary, error normalization |
| `packages/adapters` | Provider adapters (OpenAI/Gemini/DeepL/DeepSeek) and exporters (EPUB/PDF) |
| `packages/storage` | SQLite persistence |
