# Build Plan

Checked items record functionality present in the adoption survey, not a new
runtime acceptance or evidence of a published release. No historical Blueprint
feature archives exist for this imported baseline.

## Existing functionality

- [x] 1. **Contract language foundation** - ANTLR parsing, syntax diagnostics, block-name validation, and XML/HTML compilation in a shared core.
- [x] 2. **Desktop drafting and preview** - Electron/React workspace with Monaco editing and live contract rendering.
- [x] 3. **Project file workspace** - Folder exploration, file/folder operations, watching, saving, tabs, dirty-state protections, and Quick Open.
- [x] 4. **Workspace controls** - Adjustable panes, keyboard editing controls, status information, and persisted layout preferences.
- [x] 5. **Contract styling** - Validated JSON style profiles, preview CSS, reset, and persisted preferences.
- [x] 6. **Command line tools** - Source validation and XML/HTML compilation using the shared core, with optional output files and HTML styles.

## Indicative roadmap, in priority order

- [ ] 7. **Complete the contract markup language** - Define and implement the next language constructs and their shared core/CLI behavior.
- [ ] 8. **Develop the contract editing experience** - Improve drafting and navigation with Obsidian and VS Code as reference experiences.
  - [x] 8a. **Local-file welcome flow** - Open a project folder from File Explorer, optionally creating an example file before rendering.
- [ ] 9. **Add lawyer-focused word-processing tools** - Implement selected capabilities lawyers expect when editing contracts in Microsoft Word.

> TODO (confirm): Items 7-9 are roadmap milestones, not implementation-ready
> slices. Agree the first milestone's language scope and split it into small
> features before implementation. Do not assign unconfirmed semantics or Word
> compatibility requirements.

The next language priority within item 7 is the define command, covering inline
and elsewhere-defined terms across sections/blocks. Subsequent language work
must support referenceable clauses and automatically updated references;
editor-assisted reference insertion belongs to item 8. Exact syntax and the
remaining internal order require a reviewed feature spec. Preserve block-specific
rules and the distinction between marked clauses and unmarked continuation text.
See project-plan.md's markup language direction and separately labeled suggestions.

Product direction within these milestones (not additional numbered features):

- Item 7: declarative definitions, cross-references, clause numbering, schedules,
  and modular multi-file composition; configurable Australian formatting presets.
- Item 8: contract-aware highlighting, completion and diagnostics, plus advanced
  regex find/replace within the current desktop editor.
- Item 9: selected lawyer-focused word-processing capabilities. The blog does
  not establish full Word parity, DOCX round-tripping, or collaboration features.

> TODO (confirm): Choose the first small language feature and exact semantics;
> inclusion/order rules, cross-file scope, asset handling, preset conventions,
> and editor-assistance behavior need specification before implementation.

> TODO (confirm): Defined Terms and Table of Contents are placeholder panels.
> Confirm their scope and ordering within the language and editor milestones.

Execution priority: the user selected feature 8a next, ahead of language milestone 7.
The no-folder File Explorer offers Open Folder and Open Folder (with example file); ordinary New File creates a blank draft.
