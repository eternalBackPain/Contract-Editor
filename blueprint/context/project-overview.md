# Contract Editor - Project Overview

<!-- blueprint:source-hash 6325d342191e1d38d5f2a615523e75256d60a513c75db06d799f923df55dd02c -->

> A desktop drafting tool for lawyers combining structured contract markup with a live rendered contract.

## Problem

Give contract drafting the immediate feedback of a code editor while showing
human-readable output alongside the source. Develop the language and editing
experience to support the work practicing lawyers do when editing contracts.
Make formatting, numbering, fields, and structure explicit and inspectable.
Prioritize drafting quality of life rather than formal legal modeling or replacing
Word as the industry standard. Address proprietary-tool limitations through a
transparent approach; a specific open-source license has not been chosen.

## Users

Practicing lawyers drafting and editing contracts, with Obsidian and Visual
Studio Code as editing references and Microsoft Word as a reference for legal
word-processing capabilities. No account tiers are specified.

## Usage model

The current app works with locally selected project folders. Filesystem access
crosses Electron IPC; preserve input/path validation and unsaved-work protections.
No additional hosting, collaboration, tenancy, or compliance requirements are established.
Smart-contract execution, blockchain integration, and formal legal-rule modeling
are not required for the drafting direction. The blog's research and competitor
examples are background, not verified claims or dependencies.

## Features

Items 1-6 are implemented according to the adoption survey, not newly accepted
runtime behavior or published releases. Items 7-9 are the planned direction.

1. **Contract language foundation** - ANTLR parsing, syntax diagnostics, block-name validation, and shared XML/HTML compilation.
2. **Desktop drafting and preview (headline)** - Monaco source editing with adjacent live rendered output in Electron/React.
3. **Project file workspace** - Folder exploration, creation/rename/deletion, watching, saving, tabs, dirty-state protection, and Quick Open.
4. **Workspace controls** - Adjustable panes, keyboard controls, status information, and persisted layout preferences.
5. **Contract styling** - Validated JSON profiles, preview CSS, reset, and preference persistence.
6. **Command line tools** - Validation and XML/HTML compilation through the shared core, optional file output and HTML styles.
7. **Complete the contract markup language** - Define and implement the next language constructs consistently in core and CLI.
8. **Develop the contract editing experience** - Improve drafting/navigation using Obsidian and VS Code as references.
9. **Add lawyer-focused word-processing tools** - Implement selected contract-editing capabilities expected by practicing lawyers.

Planned direction within items 7-9 includes declarative definitions,
cross-references, clause numbering, schedules, modular multi-file composition,
and configurable Australian contract-formatting presets. Item 8 includes
contract-aware highlighting, completion, diagnostics, and regex find/replace.
These are directions, not finalized semantics or newly completed capabilities.
Existing folder browsing does not establish multi-file compilation; Monaco alone
does not establish contract-aware assistance.

Defined Terms and Table of Contents panels are placeholders, not completed capabilities.

## Data model

These are logical shapes derived from the plans, not newly imposed persistence
schemas or a database design. Additional fields and exact serialization contracts
remain unspecified.

| Model | Fields and types | Persistence and relationships |
| --- | --- | --- |
| Project folder | rootPath: string | User-selected filesystem directory containing contract source files. |
| Contract source file | path: string; sourceText: string | UTF-8 drafting content in .contract or .txt files within a project. |
| Open document buffer | sourceText: string; associated file path: string or absent; unsaved changes: boolean (derived) | Renderer memory; associated with a source file when file-backed. Not a promised session-recovery format. |
| Workspace layout preferences | pane sizes: numbers; pane visibility: booleans | localStorage; describes workspace presentation. |
| Style profile | JSON object of style overrides | Used by the compiler and preview; workspace preference persisted in localStorage; CLI can read a profile file. |
| Compiled artifact | target: xml or html; output: string | Derived from source by the shared core; CLI can write it to a file. |

> TODO: The plans do not specify exact style keys, layout storage keys, or new
> language data structures. Establish those contracts in the relevant feature spec.

Planned composition relates a compiled contract to multiple source files and
supporting assets. Entry-file selection, ordering, inclusion rules, asset handling,
and cross-file definition/reference scope are unspecified, not new schema contracts.

## Tech stack

Active app: contract-editor-desktop/, using npm workspaces and package-lock.json.
Versions below reflect manifest major versions, not verified installed versions.

- JavaScript ES modules and JSX; React 19 for the renderer.
- Electron 38 for desktop lifecycle, native menus, filesystem access, and IPC.
- electron-vite 4 and Vite 7 for builds; Monaco for editing.
- ANTLR 4.13 for markup parsing; Tailwind CSS 4 and custom CSS for styling.
- packages/core owns parsing, validation, compilation, and style logic.
- packages/cli reuses the core through contractc.
- src/main owns native integration; src/preload exposes the context bridge;
  src/renderer/src owns components, hooks, and preferences.
- Node's test runner covers core and CLI; Playwright Core drives Electron smoke tests.
- ESLint and Prettier are configured. No database/account service was found.

Use the exact commands in AGENTS.md from contract-editor-desktop/. Build and tests
are the fallback automated gate; no combined Verify command or GitHub Actions
workflow was found during adoption. This overview does not assert checks passed.

## Monetization

> TODO: Monetization is unspecified.

## UI/UX

A desktop workspace with an activity bar, explorer, document tabs, source editor,
rendered preview, and status bar. Preserve keyboard access and unsaved-work
protections while improving the experience. Source and output remain side by side;
no web route model is specified. The earlier blog's web-hosted UI proposal is
superseded by the current Electron desktop direction. Its LaTeX analogy motivates
modularity, not a stack change.

## Deployment

Ship a desktop app for Windows, macOS, and Linux. Electron packaging scripts exist
for all three, but their existence is not evidence of released installers.
Build with npm run build; preview with npm run start. Packaging commands are in
AGENTS.md. No hosting service or DOCX backend is established by the plans.

## Open questions

- **Language scope:** specify the first constructs and semantics; references and
  definitions are intended capabilities, but syntax and resolution rules remain unspecified.
- **Feature size:** items 7-9 are milestones. Split into small approved features
  before implementation, preserving existing IDs when updating the plans.
- **Editor and Word scope:** choose concrete capabilities. Full Word compatibility,
  tracked changes, comments, and DOCX round-tripping are not established requirements.
- **Placeholder panels:** confirm Defined Terms and Table of Contents scope/order.
- **Composition and presets:** define cross-file scope, inclusion/order rules,
  supporting assets, and the Australian formatting conventions to implement.
- **Distribution details:** signing, updates, interchange contracts, and licensing are unspecified.

Resolve decisions in the source plans and rerun $overview; do not hand-edit this file.
