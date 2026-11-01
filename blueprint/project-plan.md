# Project Plan

## 1. Problem - What problem are we solving?

Let lawyers draft contracts as structured text with the immediate feedback of a
code editor and an adjacent, live human-readable contract preview.

Make formatting, numbering, fields, and contract structure explicit and
inspectable rather than dependent on hidden word-processor behavior. Prioritize
lawyers' drafting quality of life over formal modeling of legal obligations.
The aim is to demonstrate a transparent, purpose-built approach to drafting;
replacing Microsoft Word as the industry standard is not a project goal.

The author's earlier blog also expresses a desire to address proprietary-tool
limitations. Licensing and distribution terms remain undecided; this statement
does not establish a particular open-source license.

## 2. Users - Who is this for?

Practicing lawyers drafting and editing contracts. The editing experience should
feel familiar to users of Obsidian or Visual Studio Code, while supporting the
contract-editing work lawyers currently do in Microsoft Word.

## 3. Features - What already exists and what comes next?

Implemented in the current codebase (surveyed, not release-certified):

- Contract markup parsing with ANTLR, syntax diagnostics, and block-name validation.
- Shared core compilation to XML and HTML with escaped text and style profiles.
- Electron desktop workspace with Monaco editing and a live rendered preview.
- Project explorer with file/folder creation, rename, deletion, and filesystem watching.
- Multiple document tabs, saving, dirty-state prompts, and Quick Open.
- Resizable/hideable panes, keyboard controls, and persisted layout/style preferences.
- JSON style-profile editing, validation feedback, reset, and preview styling.
- CLI validation and XML/HTML compilation with output files and optional styles.

Indicative roadmap, in priority order:

1. Fully flesh out the existing contract markup language.
2. Develop the contract editing experience, taking inspiration from Obsidian and VS Code.
3. Add word-processing capabilities practicing lawyers expect when editing contracts in Word.

Product direction from the author's earlier blog, carried forward where
compatible with the current desktop architecture:

- Declarative markup for formatting, styling, defined terms, cross-references,
  clause numbering, and schedules, with visible source and live output.
- Configurable standard formatting presets reflecting common Australian
  contract conventions. Specific conventions still need to be selected.
- Modular composition: assemble a contract from separate source files in a
  project folder, with schedules, images, and supporting content as needed.
  Existing folder browsing does not yet establish multi-file compilation.
- IDE-style assistance, including syntax highlighting, context-aware completion
  (IntelliSense-style), error feedback, and advanced regex find/replace.
  Existing Monaco integration is a foundation, not proof of contract-aware support.

Defined Terms and Table of Contents panels currently contain placeholders.

> TODO (confirm): Specify the language constructs and semantics for the first
> language milestone, including definition scope, reference resolution, numbering,
> schedules, and multi-file composition. These are product directions, not yet
> approved syntax, resolution rules, or a committed internal build order.

> TODO (confirm): Choose the first editing improvements and the specific Word
> capabilities required. Do not assume full Word compatibility, tracked changes,
> comments, or DOCX round-tripping are approved requirements.

## 4. Data - What are we storing?

Contract source files on the local filesystem (.contract and .txt); open document
buffers in renderer memory; workspace layout and style preferences in localStorage.
The CLI reads source/style files and can write compiled output. No database or
account service was found in the surveyed app.

Planned modular composition will relate a compiled contract to multiple source
files and supporting assets. Entry-file selection, file ordering, inclusion rules,
asset handling, and cross-file definition/reference scope remain to be designed;
no new persisted format is established here.

## 5. Tech - What stack are we using?

The active application is contract-editor-desktop/, an npm workspace project with
package-lock.json. It uses JavaScript/JSX, React 19, Electron 38, electron-vite 4,
Vite 7, Monaco, ANTLR 4.13, Tailwind CSS 4, and custom CSS. These are manifest major
versions, not a claim about exact installed versions.

- packages/core: shared parser, validator, compiler, and style-profile logic.
- packages/cli: contractc command line interface using the shared core.
- src/main: Electron lifecycle, native menus, filesystem operations, and IPC.
- src/preload: context bridge for renderer access to desktop operations.
- src/renderer/src: React workspace, components, hooks, and preferences.
- Node's built-in test runner covers core and CLI; Playwright Core drives an Electron smoke script.
- ESLint and Prettier are configured. No combined Verify command or GitHub Actions workflow was found.

The earlier blog proposed a web-based editing UI. The current plan supersedes
that delivery proposal: retain the Electron desktop app, shared core, and CLI.
Apply its editing ideas within this architecture; no browser-hosted product or
new backend is implied.

## 6. Monetize - How will this make money?

> TODO (confirm): Monetization has not been specified.

## 7. UI/UX - How should this look and feel?

A contract-focused editing workspace inspired by Obsidian and Visual Studio Code,
with source and rendered output side by side. The existing UI uses an activity
bar, explorer, document tabs, status bar, and adjustable panes. Preserve keyboard
access and unsaved-work protections as the experience develops. Keep source
formatting and contract structure understandable and predictable. Use explicit
markup and configurable presets as the primary drafting model; the blog's
LaTeX comparison motivates modularity, not adoption of LaTeX as the stack.

## 8. Deployment - Where and how will this ship?

The app will ship as a desktop application for Windows, macOS and Linux.
The existing app has Electron packaging scripts for Windows, macOS, and Linux.
These scripts are configured capabilities, not evidence of published releases.


## 9. Usage model and constraints

Current implementation operates on locally selected project folders. Filesystem
access crosses the Electron IPC boundary and must retain input/path validation
and data-loss protections. No new hosting, collaboration, tenancy, or compliance
requirements were supplied.

The core goal is human-readable contract drafting. Smart-contract execution,
blockchain integration, and formal legal-rule or obligation modeling are not
required for this direction. Research examples and third-party product claims in
the older blog are background inspiration, not verified facts or dependencies.
