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

`ash
npm run test:smoke
`

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
