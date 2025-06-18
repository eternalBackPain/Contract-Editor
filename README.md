# Contract-Editor

## TODO

* fix async issue with HTMLText in LivePreview component
* amend HTML styling to suit contracts
* add {{references}} and @define to formal grammar
* convert XML to .docx

## Overview

A code editor for lawyers drafting contracts. This editor will have the lawyer draft contracts in the same manner a software developer would code. It is simply a tool to draft contracts. The code will contain the drafting of a contract along with all the code necessary to format the contract. The human-readable contract will appear adjacent to your code and will live-update with every amendment to your drafting.

>"there is a crucial similarity between lawyers and programmers: the way they use words. Computer science and law are both linguistic professions. Programmers and lawyers use language to create, manipulate, and interpret complex abstractions. A programmer who uses the right words in the right way makes a computer do something. A lawyer who uses the right words in the right way changes people’s rights and obligations. There is a nearly exact analogy between the text of a program and the text of a law.": [[grimmelmannProgrammingLanguagesLaw2022]]
 
## Directory

contract-editor has the source code of the project.

```
contract-editor/
├── app/
│   ├── api/
│   │   ├── parse/route.js      # ANTLR parsing endpoint
│   │   └── transform/route.js  # XSLT transformation endpoint
│   ├── components/             # React UI components
│   ├── page.js                 # Main page
│   └── layout.js               # App layout
├── lib/
│   ├── formal-grammar/         # ANTLR grammar, parser, listener
│   └── xslt/                   # XSLT and SEF files
├── package.json
├── jsconfig.json
└── ... (Next.js config, etc.)
```

### Frontend (React/Next.js)

Uses the Next.js App Router (app/ directory).
Components for editing (TextEditor), live preview (LivePreview), navigation (NavBar), table of contents, and defined terms.
The main page (page.js) manages state and communicates with backend API routes for parsing and transforming contract text.
Contract Parsing (ANTLR)

### Custom formal grammar defined for contracts using ANTLR.

Generated parser and listener classes (ContractsParser.js, ContractsParserListener.js) in lib/formal-grammar/.
/api/parse endpoint parses contract text into XML using the ANTLR parser and a custom listener.
XSLT Transformation (SaxonJS)

### XSLT stylesheets (compiled to SEF JSON) in lib/xslt/.

/api/transform endpoint uses SaxonJS to transform XML (from the parser) into HTML or another format.
XSLT is precompiled using the SaxonJS CLI (xslt3) and loaded at runtime.

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
