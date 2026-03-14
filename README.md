# Contract-Editor

## TODO

* add {{references}} and @define to formal grammar
* build a .NET Web API microservice that I can call to generate / render docx
* learn Visual Studio, C# and Open XML SDK (see https://learn.microsoft.com/en-us/office/open-xml/open-xml-sdk and https://www.ericwhite.com/blog/introduction-to-open-xml-series/)
* look into incorporating libraries which Obsidian uses (pdf.js, Electronjs (for desktop app), CodeMirror

## Overview

A code editor for lawyers drafting contracts. This editor will have the lawyer draft contracts in the same manner a software developer would code. It is simply a tool to draft contracts. The code will contain the drafting of a contract along with all the code necessary to format the contract. The human-readable contract will appear adjacent to your code and will live-update with every amendment to your drafting.

>"there is a crucial similarity between lawyers and programmers: the way they use words. Computer science and law are both linguistic professions. Programmers and lawyers use language to create, manipulate, and interpret complex abstractions. A programmer who uses the right words in the right way makes a computer do something. A lawyer who uses the right words in the right way changes people's rights and obligations. There is a nearly exact analogy between the text of a program and the text of a law.": [[grimmelmannProgrammingLanguagesLaw2022]]

## Philosophy and architecture rationale

The project is built around one core idea: contract drafting should feel like software development, with immediate feedback and predictable outcomes from structured text.

The repo structure favors clear boundaries and reuse:

* `packages/core` contains the parser/validator/compiler as the single source of truth for the Contract Editor language.
* `packages/cli` exists so the same language engine can run in automation, CI, and scripted workflows without the desktop UI.
* the Electron app (`src/main`, `src/preload`, `src/renderer`) focuses on UX and integration, while delegating language semantics to `packages/core`.

I introduced `packages/core` to avoid duplicating parse/transform logic in multiple places. This keeps language behavior consistent between desktop preview and CLI output, makes parser changes easier to test and ship, and allows future tools to reuse the same contract language engine.

## Directory

`contract-editor-desktop` is the active codebase and now uses a small monorepo layout.

```
contract-editor-desktop/
|- packages/
|  |- core/                   # Shared parser/validator/compiler package
|  \- cli/                    # contractc command line tool
|- src/
|  |- main/                   # Electron main process entry
|  |- preload/                # Context-bridge preload
|  \- renderer/               # Vite + React renderer app
|     |- index.html
|     \- src/
|        |- assets/
|        |- components/       # Editor UI pieces
|        |- contexts/         # App state providers
|        |- hooks/
|        \- lib/
|- resources/                 # Packaged app assets
|- scripts/                   # Smoke and utility scripts
|- electron.vite.config.mjs   # Electron + Vite config
|- electron-builder.yml       # Packaging config
\- package.json
```

### Desktop app (Electron + React)

Main process bootstraps the window and app lifecycle in `src/main/index.js`.
Preload exposes safe APIs to the renderer in `src/preload/index.js`.
Renderer UI lives in `src/renderer/src` with `App.jsx` and Monaco editor wiring.

### Core parsing + transforms

The parser/validator/compiler logic now lives in `packages/core` and is reused by both the Electron UI and the CLI in `packages/cli`.
The renderer consumes this shared core package rather than owning a separate parser pipeline.

### Legacy web app

`contract-editor/` remains in the repository as a legacy/experimental Next.js app and is not the primary target for current desktop development.

## Mock-up

![Project Mock-up](<Contract Editor project wireframe.pdf>)

## Example parse tree 

This sample shows the Contract Editor markup style used to generate the parse structure shown in the image below.

```
@begin{GeneralConditions}
# No guarantee of work or exclusivity
The Contract Authority is not, by executing this MICTA:
## bound to issue any Order Proposal to the Supplier;
## bound to engage the Supplier to supply any goods, services and/or other activities or to enter into any Contract; or
## restricted in any way from engaging any other person to supply any goods, services and/or other activities:
### of any type, including goods, services and/or other activities that are the same as or similar to any Supplier's Activities or ICT Activities; or
### at any location where, or in respect of any project that, the Supplier may be required to supply goods, services and/or other activities.
@end{GeneralConditions}
```

![parse tree](<parse tree.png>)
