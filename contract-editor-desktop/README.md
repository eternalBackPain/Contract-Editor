# contract-editor-desktop

Electron desktop app for writing Contract Editor markup, now structured as a small monorepo.

## Packages

- `@contract-editor/core`: parser/validator/compiler for Contract Editor markup.
- `@contract-editor/cli`: command line tool (`contractc`) for validate/compile workflows.
- `contract-editor-desktop` (root package): Electron app consuming `@contract-editor/core`.

## Source File Compatibility

- Preferred extension: `.contract`
- Supported for compatibility: `.txt`

## Install

```bash
npm install
```

## Desktop App

```bash
npm run dev
npm run lint
npm run build
```

## Core + CLI Tests

```bash
npm run test:core
npm run test:cli
npm run test
```

## CLI Usage

```bash
# validate
npx contractc validate ./examples/sample.contract

# compile to XML
npx contractc compile ./examples/sample.contract --to xml

# compile to HTML file
npx contractc compile ./examples/sample.contract --to html --out ./dist/sample.html
```

`contractc` accepts `.contract` and `.txt` input files.

## Electron Smoke Test

```bash
npm run test:smoke
```

This builds the app, launches Electron, verifies preview renders, and verifies editor updates propagate to preview.

## Open drafts

Opening files creates tabs. Switching tabs preserves unsaved text, undo history,
selection and scroll position. Save the active file with Ctrl+S (Cmd+S on macOS)
or the Save button. Closing a dirty tab, changing folders, or closing the window
asks before discarding changes. Drafts are kept in memory for the current session.

## Quick Open

Press Ctrl+P (Cmd+P on macOS) or click Quick Open to find `.contract` and `.txt`
files anywhere in the active folder, including collapsed directories. Type a
name or relative path; matching allows skipped letters. Use Up/Down and Enter
to open a result, or Escape to return to your draft. The search refreshes each
time it opens, skips `.git` and `node_modules`, and asks for a smaller project
when more than 10,000 entries would need scanning.

## Text editing

The editor toolbar opens Find, Replace, Go to Line and Monaco's editor command
picker. Find/Replace support case, whole-word and regular-expression searches.
Standard Monaco shortcuts remain available, including Ctrl+F, Ctrl+H, Ctrl+G,
F1, Alt+Z for word wrap, and Ctrl+D for selecting the next matching occurrence
(with platform equivalents on macOS). The status bar shows line, column and
selected character count; clicking the position opens Go to Line.

## Workspace layout

- Ctrl+B / Cmd+B toggles the Explorer without losing the open folder or tree state.
- Ctrl+Shift+V / Cmd+Shift+V toggles the rendered contract preview.
- Ctrl+1 / Cmd+1 focuses the editor; Ctrl+2 / Cmd+2 shows and focuses the preview.
- Ctrl+K then Z / Cmd+K then Z enters or leaves Zen Mode. Press Escape twice to leave.
  Zen Mode temporarily hides the sidebar, activity bar and preview while preserving
  the previous layout. The layout toolbar also exposes these controls.
- Focus a pane divider and use Left/Right to resize, Home/End for its limits, or
  double-click it to restore its default size. Pane sizes adapt when the window resizes.

Sidebar/preview visibility and pane widths persist between sessions. Zen Mode is temporary.

## Keyboard and compact layouts

Use Left/Right, Home, and End on a draft tab to switch drafts. Tab moves to the
active draft tab; Quick Open restores focus when dismissed. Explorer shortcuts
apply to the tree, leaving typing and text navigation in its filter unaffected.
Formatting reports invalid JSON accessibly and scrolls to keep its actions reachable
in short windows. Long draft names are truncated; hover a tab for the full path.

File creation and rename reject existing destination names to preserve their contents.
Explorer operation failures appear inline. New names must be a single file or folder
name without path separators.

## Lint configuration

The renderer uses React 19, which no longer runs function-component PropTypes
checks. Its lint configuration disables the legacy `react/prop-types` rule while
retaining the remaining React, Hooks, and formatting checks. Formatting follows
`.editorconfig` and `.prettierrc.yaml`. The application-level `.gitattributes`
keeps text files on LF line endings after Git checkout.
