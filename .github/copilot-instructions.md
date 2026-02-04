# Copilot / AI agent instructions — Contract-Editor

## Project context & goals

Contract-Editor is a code editor for lawyers drafting contracts, treating contract drafting like software development. Lawyers write contracts in a structured code-like syntax (with `@begin/@end` blocks, `#` section headers, etc.), which parses into XML and renders as formatted HTML in real-time. The aim is to have the structured code-like syntax produce not just HTML, but also docx, pdfs, etc. The philosophy: both programmers and lawyers use language precisely to create complex abstractions; this tool brings programmer workflows (live preview, version control-friendly syntax, IDE-like editing) to legal drafting.

Key capabilities:
- Editor with live preview (Monaco editor + XSLT-based HTML transform)
- ANTLR-based parser supporting a custom contract grammar

---

Short, actionable notes to help AI coding agents be productive in this repository.

1. Project layout (big picture)
- Monorepo-like layout with two main apps:
  - `contract-editor/` — Next.js web app (app router) serving UI + API routes.
    - API parse: [contract-editor/app/api/parse/route.js](contract-editor/app/api/parse/route.js#L1-L200)
    - API transform: [contract-editor/app/api/transform/route.js](contract-editor/app/api/transform/route.js#L1-L200)
  - `contract-editor-desktop/` — Electron + Vite renderer (desktop app).
    - React + Monaco-based editor components in `src/renderer/src/components/`.

    Important: `contract-editor-desktop` is the primary workspace (effectively "v2").
    - Make code changes, feature work, and fixes in `contract-editor-desktop` by default.
    - Use `contract-editor/` only as a historical/reference copy showing prior web-focused implementations.
    - When updating core pieces (ANTLR grammar, XSLT, parser logic), update the desktop copy first and then
      mirror any necessary changes back into `contract-editor/` only if you need web parity or reference.

2. Key data flows and architecture
- Parsing pipeline: plain text -> ANTLR (`antlr4`) -> `ContractsLexer` / `ContractsParser` -> listener builds XML.
  - Implementations live in both apps: web uses [contract-editor/lib/formal-grammar](contract-editor/lib/formal-grammar/), desktop duplicates under `contract-editor-desktop/src/renderer/src/lib/formal-grammar`.
  - Example server-side parse flow: [contract-editor/app/api/parse/route.js](contract-editor/app/api/parse/route.js#L1-L200)
- Transformation pipeline: XML -> XSLT -> HTML using Saxon-JS. SEF stylesheet is in `lib/xslt/transform.sef.json` and is consumed by the transform API.
  - Example: [contract-editor/app/api/transform/route.js](contract-editor/app/api/transform/route.js#L1-L200)
  - To regenerate the SEF (compile XSL -> SEF): run in `contract-editor/lib/xslt`:
    - `npx xslt3 -xsl:transform.xsl -export:transform.sef.json -t -ns:##html5`

3. Build / dev / debug workflows (practical commands)
- Web app (`contract-editor`):
  - Dev server: run from `contract-editor/` -> `npm install` then `npm run dev` (starts `next dev`).
  - Build: `npm run build`; start prod server: `npm run start`.
- Desktop app (`contract-editor-desktop`):
  - Dev: from `contract-editor-desktop/` -> `npm install` then `npm run dev` (uses `electron-vite dev`).
  - Preview: `npm run start` (electron-vite preview).
  - Package: `npm run build` and platform targets via `npm run build:win|build:mac|build:linux` (uses `electron-builder`).

4. Repository conventions & patterns
- Grammar duplication: if changing ANTLR grammar, update both `contract-editor/lib/formal-grammar` and the desktop copy at `contract-editor-desktop/src/renderer/src/lib/formal-grammar` to keep parity.
- Parsing implementation: both web and desktop build XML via a custom `ContractsParserListener` that appends XML fragments to `XMLOutput`. Prefer editing/adding logic in the shared parser listener patterns.
- XSLT usage: the runtime uses Saxon-JS and expects a serialized SEF JSON file. Don't edit SEF directly — edit the `.xsl` and recompile with `xslt3`.
- Monaco integration:
  - Web: `@monaco-editor/react` is used in the web app.
  - Desktop: the renderer uses `monaco-editor` directly; a small wrapper exists at `contract-editor-desktop/src/renderer/src/components/MonacoEditor.jsx`.

5. Tests, linting, formatting
- No automated tests found in repo. Lint/format for desktop app:
  - `npm run lint` and `npm run format` in `contract-editor-desktop/` (prettier + eslint configured).

6. Important files to reference when making changes
- Parse & transform endpoints: [contract-editor/app/api/parse/route.js](contract-editor/app/api/parse/route.js#L1-L200), [contract-editor/app/api/transform/route.js](contract-editor/app/api/transform/route.js#L1-L200)
- ANTLR grammars: [contract-editor/lib/formal-grammar/ContractsLexer.g4](contract-editor/lib/formal-grammar/ContractsLexer.g4#L1), desktop copy: `contract-editor-desktop/src/renderer/src/lib/formal-grammar/`.
- XSLT: [contract-editor/lib/xslt/transform.xsl](contract-editor/lib/xslt/transform.xsl#L1) and SEF: [contract-editor/lib/xslt/transform.sef.json](contract-editor/lib/xslt/transform.sef.json#L1)
- Electron config: [contract-editor-desktop/electron.vite.config.mjs](contract-editor-desktop/electron.vite.config.mjs#L1-L200)

7. Agent rules & heuristics (concise)
- When editing parsing logic, run both the web `parse` API and the desktop `parseToXml` path to keep behavior aligned.
- Prefer changing the `.g4` grammar first, then regenerate lexer/parser artifacts if required by build tooling.
- When touching XSLT, keep source `transform.xsl` under version control and recompile SEF; note the transform route loads `lib/xslt/transform.sef.json` at runtime.

If anything here is unclear or you'd like more detail (examples for editing the ANTLR listener, or a checklist for preparing release builds), tell me which area to expand.
