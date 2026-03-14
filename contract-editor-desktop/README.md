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
