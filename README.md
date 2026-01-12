# Contract-Editor

## TODO

* add {{references}} and @define to formal grammar
* build a .NET Web API microservice that I can call to generate / render docx
* learn Visual Studio, C# and Open XML SDK (see https://learn.microsoft.com/en-us/office/open-xml/open-xml-sdk and https://www.ericwhite.com/blog/introduction-to-open-xml-series/)
* look into incorporating libraries which Obsidian uses (pdf.js, Electronjs (for desktop app), CodeMirror

## Overview

A code editor for lawyers drafting contracts. This editor will have the lawyer draft contracts in the same manner a software developer would code. It is simply a tool to draft contracts. The code will contain the drafting of a contract along with all the code necessary to format the contract. The human-readable contract will appear adjacent to your code and will live-update with every amendment to your drafting.

>"there is a crucial similarity between lawyers and programmers: the way they use words. Computer science and law are both linguistic professions. Programmers and lawyers use language to create, manipulate, and interpret complex abstractions. A programmer who uses the right words in the right way makes a computer do something. A lawyer who uses the right words in the right way changes people’s rights and obligations. There is a nearly exact analogy between the text of a program and the text of a law.": [[grimmelmannProgrammingLanguagesLaw2022]]
 
## Directory

contract-editor-desktop contains the Electron app.

```
contract-editor-desktop/
├─ src/
│  ├─ main/                 # Electron main process entry
│  ├─ preload/              # Context-bridge preload
│  └─ renderer/             # Vite + React renderer
│     ├─ index.html
│     └─ src/
│        ├─ assets/
│        ├─ components/     # Editor UI pieces
│        ├─ contexts/       # App state providers
│        ├─ lib/
│        │  ├─ formal-grammar/ # ANTLR grammar + generated parser
│        │  └─ xslt/           # XSLT sources + SEF artifacts
│        ├─ App.jsx
│        ├─ main.jsx
│        └─ monaco.jsx
├─ resources/               # App icons and packaged assets
├─ electron.vite.config.mjs # Electron + Vite config
├─ electron-builder.yml     # Packaging config
├─ package.json
└─ ...                      # ESLint / Prettier config, etc.
```

### Desktop app (Electron + React)

Main process bootstraps the window and app lifecycle in src/main/index.js.
Preload exposes safe APIs to the renderer in src/preload/index.js.
Renderer UI lives in src/renderer/src with App.jsx and Monaco editor wiring.

### Parsing + transform (renderer-side)

ANTLR grammar and generated parser live under src/renderer/src/lib/formal-grammar/.
parseToXml.js converts editor text to XML in the renderer process.
XSLT sources and SEF artifacts live in src/renderer/src/lib/xslt/, with a packaged copy under resources/xslt/.
XMLToHTML.js calls the preload IPC bridge to transform XML to HTML.

## Mock-up

![Project Mock-up](<Contract Editor project wireframe.pdf>)

## Example parse tree 

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
