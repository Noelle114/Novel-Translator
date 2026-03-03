# Manga Translator New

Production-grade Electron + React + TypeScript foundation for local-first EPUB/text-PDF EN->TR translation workflows.

## Quick start

```bash
pnpm install
pnpm dev
```

## Current scope

- Foundation architecture (main/preload/renderer split)
- Typed and validated IPC contracts
- SQLite storage bootstrap
- Keychain credential service
- Job orchestrator skeleton with deterministic state transitions
- Provider adapter abstraction and first concrete adapter stubs
- Basic editor/project/settings/export screens
