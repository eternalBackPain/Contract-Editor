# Copilot / AI agent instructions - Contract-Editor

## Project context

Contract-Editor is a desktop code editor for lawyers drafting contracts. Lawyers write contracts in a structured code-like syntax with `@begin/@end` blocks, section headers, and plain drafting text. The app parses that source into XML and renders a formatted live preview.

The repository has one application codebase:

- `contract-editor-desktop/` - Electron + Vite + React desktop app.
- `contract-editor-desktop/packages/core/` - shared parser, validator, and compiler for Contract Editor markup.
- `contract-editor-desktop/packages/cli/` - `contractc` command line tool for validate and compile workflows.

## Architecture

- Main process: `contract-editor-desktop/src/main` owns Electron lifecycle, native APIs, filesystem access, and IPC handlers.
- Preload: `contract-editor-desktop/src/preload` exposes a narrow context-bridge API to the renderer.
- Renderer: `contract-editor-desktop/src/renderer` owns the React UI, Monaco editor integration, editor state, and preview orchestration.
- Core package: `contract-editor-desktop/packages/core` owns the ANTLR grammar, generated parser artifacts, XML generation, validation, and compile entrypoints.
- CLI package: `contract-editor-desktop/packages/cli` consumes `@contract-editor/core` and exposes `contractc`.

Keep privileged filesystem and OS operations in the main process. Do not expose raw Electron or Node primitives to the renderer.

## Parser and transform workflow

- Grammar files live in `contract-editor-desktop/packages/core/src/formal-grammar`.
- Generated ANTLR files live next to the grammar files.
- XSLT source and SEF files live in `contract-editor-desktop/packages/core/src/xslt` and are mirrored into app resources when required by the desktop package.
- Prefer editing source grammar or XSLT files first, then regenerate generated artifacts when needed.
- The renderer imports language behavior from `@contract-editor/core`; avoid duplicating parser or compiler logic in renderer code.

## Commands

Run commands from `contract-editor-desktop/`.

```bash
npm install
npm run dev
npm run lint
npm run build
npm run test
npm run test:smoke
```

Packaging commands:

```bash
npm run build:win
npm run build:mac
npm run build:linux
npm run build:unpack
```

## Repository conventions

- Keep changes small and scoped to the active desktop app unless the user asks for repository-level documentation or configuration changes.
- Follow the app's existing formatting and lint rules: 2 spaces, single quotes, no semicolons, print width 100.
- Keep public bridge APIs narrow and explicit.
- Validate and sanitize IPC inputs in `src/main`.
- Treat user-provided file content and paths as untrusted.
- For parser or transform changes, run the relevant core/CLI tests plus `npm run lint` and `npm run build`.

## Useful entrypoints

- Electron main process: `contract-editor-desktop/src/main/index.js`
- Preload bridge: `contract-editor-desktop/src/preload/index.js`
- React app: `contract-editor-desktop/src/renderer/src/App.jsx`
- Monaco wrapper: `contract-editor-desktop/src/renderer/src/components/MonacoEditor.jsx`
- Core package entrypoint: `contract-editor-desktop/packages/core/src/index.js`
- CLI entrypoint: `contract-editor-desktop/packages/cli/bin/contractc.js`
