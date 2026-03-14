# AGENTS.md

## Scope and Repository Boundaries
- Primary codebase: `contract-editor-desktop`.
- Treat `contract-editor` as out of scope unless the user explicitly asks to work there.

## Project Overview
- `contract-editor-desktop` is an Electron desktop app for drafting contracts with a split editor/preview workflow.
- Stack: Electron + Vite + React, with parser/transform logic in the renderer and IPC bridge through preload.
- Process boundaries:
  - `src/main`: Electron main process, native APIs, filesystem access, IPC handlers.
  - `src/preload`: safe API surface exposed to the renderer via `contextBridge`.
  - `src/renderer`: React UI, editor experience, parsing and rendering orchestration.

## Implementation Philosophy
- Implement the most minimal version of a feature first unless the user explicitly asks for additional capability.
- Prefer small, composable changes over broad rewrites.
- Avoid speculative abstractions and optional behaviors unless they are required by the request.
- Keep public API changes small and explicit.
- Keep stylistic changes consistent with the overall 'look and feel' of the application

## Build and Test Commands
Run commands from `contract-editor-desktop`.

- Install dependencies: `npm install`
- Start dev app: `npm run dev`
- Preview built app: `npm run start`
- Lint: `npm run lint`
- Format: `npm run format`
- Build (bundle only): `npm run build`
- Package by platform:
  - Windows: `npm run build:win`
  - macOS: `npm run build:mac`
  - Linux: `npm run build:linux`
  - Unpacked artifact: `npm run build:unpack`

## Code Style Guidelines
- Follow existing configs in `contract-editor-desktop`:
  - `.editorconfig`: UTF-8, LF, 2 spaces, trim trailing whitespace.
  - `.prettierrc.yaml`: single quotes, no semicolons, print width 100, no trailing commas.
  - `eslint.config.mjs`: Electron toolkit + React + React Hooks + React Refresh rules.
- Keep functions focused and side effects explicit.
- For Electron code:
  - Keep OS/file/IPC logic in `main`.
  - Expose only narrowly scoped capabilities from `preload`.
  - Keep renderer code free of direct Node/Electron privileged access.
- Match existing naming and file organization before introducing new patterns.

## Testing Instructions
- There is currently no dedicated automated unit/integration test runner configured.
- Minimum validation for every change:
  - `npm run lint`
  - `npm run build`
  - Manual smoke test in `npm run dev` for the changed flow.
- For filesystem or IPC changes, manually verify:
  - open project folder
  - list/read/write behavior
  - create/rename/delete behavior
  - error handling for invalid/out-of-scope paths
- If adding substantial logic, prefer introducing targeted tests and corresponding scripts in a follow-up (or within the same change if requested).

## Security Considerations (Electron)
- Maintain strict process separation:
  - keep privileged operations in `main`
  - keep `preload` as a narrow, explicit bridge
  - renderer should consume only vetted bridge APIs
- Do not expose raw `ipcRenderer`, filesystem primitives, or broad command execution surfaces to the renderer.
- Validate and sanitize all IPC inputs in `main` before use.
- Enforce path boundaries for filesystem actions (for example, only within the active/opened project root).
- Avoid loading remote content in BrowserWindow; prefer local bundled assets.
- Treat any user-provided file content/path as untrusted input.
- Prefer default-deny behavior for unsupported file types/actions and return explicit errors.

## Agent Workflow Expectations
- Before coding, confirm target area is in `contract-editor-desktop`.
- Keep diffs tight and directly tied to the request.
- Update docs when commands, architecture boundaries, or behavior change.
- If assumptions are required, choose the most conservative/minimal option and state it.