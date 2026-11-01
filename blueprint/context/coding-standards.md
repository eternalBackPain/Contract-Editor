# Coding Standards

## Stack and structure

- Use the existing JavaScript ES modules and JSX; no TypeScript migration is planned.
- Run npm commands from contract-editor-desktop/ and preserve its workspace/lockfile setup.
- Keep language semantics in packages/core, reused by desktop and packages/cli.
- Keep Electron lifecycle and filesystem IPC in src/main, the context bridge in
  src/preload, and React UI in src/renderer/src.
- Treat formal-grammar .g4 files as grammar sources. Do not casually hand-edit
  generated ANTLR artifacts or replace the current compile pipeline with legacy XSLT assets.
- Generator tooling and regeneration commands must be established before changing the grammar.

## React and naming

- Use functional components and hooks. Follow the existing useState/useEffect,
  callbacks, refs, and focused custom-hook patterns.
- Components use PascalCase .jsx names; utilities/hooks use existing camelCase .js conventions.
- Reuse installed dependencies and existing helpers before adding abstractions.
- Keep filesystem APIs out of the renderer; use the narrow preload bridge.

## Styling and formatting

- Reuse main.css, CSS custom properties, theme.js metrics, and existing Tailwind v4 setup.
- Preserve the existing workspace visual language and keyboard/focus accessibility.
- Existing inline styles serve dynamic layout and generated preview content; no blanket ban applies.
- Follow Prettier: single quotes, no semicolons, width 100, no trailing commas.
- Follow ESLint and avoid unused imports, commented-out code, and unrelated reformatting.

## Data and error handling

- Contract files are local; layout and style preferences use localStorage.
- Preserve dirty buffers, discard confirmations, file-operation errors, and deleted-draft protections.
- Validate IPC input and paths in the main process, including active-project boundaries.
- Keep compile/validate diagnostics structured with codes, severity, and source locations.
- Escape source text when generating XML/HTML. Validate style profiles through the shared core.
- Catch storage/JSON failures with the established fallback or visible error pattern.
- Do not introduce databases, authentication, remote services, or a DOCX backend without a confirmed requirement.

## Testing and verification

- The Test command in AGENTS.md enables the logic-test gate. Existing tests use
  node:test and node:assert, under packages/core/test and packages/cli/test.
- Add focused input/output and edge-case tests for changed parsing, validation,
  compilation, style resolution, and CLI logic in the same reviewable change.
- Test meaningful behavior, not implementation details or reversible documentation edits.
- Keep existing Electron integration evidence in scripts/smoke-electron.mjs.
  The Browser tests command in AGENTS.md builds and runs this Playwright Core harness.
- Use runtime/screenshot evidence for UI claims the smoke harness does not observe.
- Do not silently install another test runner. Preserve the current test layout.
- No combined Verify or typecheck command exists. Use the documented build and
  tests as the fallback gate, and run lint when changing application code.
- Adoption is based on code inspection; configured commands are not claims of passing checks.
- CI setup is optional and belongs to /ci; do not add workflows during adoption.

## Comments

Write code that explains itself; comment only what the code cannot say.
Over-commenting is a common AI tell, so resist it.

- Comment the **why**, not the **what**. Delete any comment that restates the code.
- No banner/header blocks, section dividers, or step-by-step narration of obvious
  code. A file does not need a comment announcing each region.
- A comment earns its place only when it captures something the code can't: a
  non-obvious decision, a gotcha or workaround, why a value is what it is, or a
  link to a spec or issue.
- Prefer self-documenting names and small functions over explanatory comments.
- Keep doc comments minimal: a one-line purpose on an exported type or function is
  plenty; don't write JSDoc that just repeats the signature.
- When in doubt, leave the comment out.

## Writing

- No em dashes (U+2014) in generated content: docs, comments, commit messages,
  READMEs, specs. They read as AI-generated.
- Use a hyphen for `term - description` separators; rephrase prose with commas,
  parentheses, or a colon. Avoid en dashes and the ellipsis character too.

