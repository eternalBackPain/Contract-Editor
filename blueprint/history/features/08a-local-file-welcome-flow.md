# Feature: Local-file welcome flow

**From build-plan:** feature 8a
**Build attempt:** 1
**Branch:** feature/local-file-welcome-flow
**Archive:** blueprint/history/features/08a-local-file-welcome-flow.md
**Status:** verified

## Goal

Make local ownership clear through a folder-first workspace. Every drafting file
belongs to a selected local folder and is navigated through File Explorer.
This user-requested revision supersedes the standalone open/create design.

## In scope

- Start with no document, source editor, or rendered contract.
- With no folder open, File Explorer offers exactly Open Folder and
  Open Folder (with example file). Remove the top open/create buttons and checkbox.
- Plain opening selects a folder, populates its explorer, and waits for file selection.
- Example opening selects a folder, writes the unchanged example drafting into
  example.contract using exclusive creation, then automatically opens that file.
  If occupied by a file or directory, use the first free example-N.contract (N >= 1).
- Normal New File in the existing explorer continues to create empty files.
- Retain selected folder when closing the last tab; show the empty welcome workspace.
- Preserve tabs, Quick Open, editing controls, dirty-buffer prompts, file operations,
  style/layout preferences, safe text rendering, and visible active-file location.
- Show File Explorer on launch so the entry actions are reachable.

## Out of scope

Standalone file opening or saving, new file-access grants, a new project format,
language changes, session restore/autosave, accounts/uploads, dependency installs,
CI setup, and wholesale workspace redesign.

## Build loop

Feature-level review; checkpoint commits disabled. /complete owns the final commit.
The former verified state is invalidated by this requested revision. Reverify
before review. No prior checkpoint commit or review receipt exists.

## Build steps

- [x] 1. Replace standalone file operations with optional folder example creation.
  Main process owns the native folder dialog, validates the boolean example flag,
  and creates the source before changing the active root or starting its watcher.
  Keep all existing read/write and explorer operations within the active root;
  remove standalone file grants and bridge methods. Reuse the shared example.
  **Done when:** Node tests prove sample bytes, collision-safe naming with existing
  files/directories, preserved existing content, and error reporting; build passes.
- [x] 2. Move entry actions into the no-folder File Explorer state.
  Disable both buttons while opening and prevent duplicate requests using a ref.
  Cancellation leaves state intact; failures show an associated role=alert error
  and allow retry; pending state is announced. Native menu folder opening uses
  the same UI operation. Reset errors on retry. On example success load the folder,
  reset previous documents only after success, select the saved example, and focus
  its editor. Plain opening waits for a file selection and does not render output.
  **Done when:** smoke covers cancellation of both variants, plain folder empty
  state, failure/retry, example file on disk/in explorer/in editor and preview.
- [x] 3. Preserve workspace lifecycle with no implicit scratch document.
  Close-last returns to the empty view without losing the selected folder. Existing
  file selection opens its content; an empty file stays empty without an injected
  example. Keep unsaved-work prompts and deleted-draft behavior, source escaping,
  saved-state semantics and visible file path. Preserve layout controls and styles.
  **Done when:** existing smoke regressions pass for saving, tabs, file operations,
  editing, Quick Open, and layout alongside close-last and folder selection.
- [x] 4. Reverify and review the revised UI.
  Run npm run lint, npm run test, npm run build (also included in test:smoke),
  and npm run test:smoke from contract-editor-desktop/. Capture and inspect welcome
  and narrow workspace screenshots. Update plans and source fingerprint to match.
  **Done when:** checks pass and screenshots show the two folder actions in File
  Explorer, no top file actions, and a working opened-document workspace.

## Files / areas

- src/main/index.js and src/main/example-file.mjs: folder selection/sample creation.
- src/preload/index.js: openProjectFolder(withExample = false).
- src/shared/example-draft.mjs: unchanged example text, single source.
- src/renderer/src/App.jsx: empty startup, documents, example selection, preview.
- src/renderer/src/hooks/useExplorerState.js and components/FileExplorerPane.jsx:
  folder initialization, entry actions and error/pending state.
- src/renderer/src/components/MonacoEditor.jsx: no fallback example.
- src/renderer/src/assets/main.css: existing tokens, empty-state actions.
- scripts/smoke-electron.mjs and test/example-file.test.mjs: regression coverage.
- package.json: app-local tests join core/CLI tests in npm run test.

All paths above are relative to contract-editor-desktop/.

## Data / contracts

- openProjectFolder(withExample) accepts only a boolean, default false.
  Main uses the owning window's native folder dialog. Cancel returns null.
  Success returns existing folder node fields plus exampleFile: null or
  { path: string, content: string }. I/O failure rejects for visible UI feedback.
- Renderer never supplies an arbitrary initial-content payload or destination;
  main selects the folder and writes UTF-8 using exclusive-create semantics.
  On collision retry an unused numbered name, never overwrite or delete.
  Non-collision errors mention possible partial files and do not silently remove them.
- Set active root and watcher only after example creation succeeds. Retain previous
  buffers/project when canceled or when example writing fails. Explorer listing
  failure must not claim a successfully loaded workspace without visible feedback.
- No new persisted metadata or file authorization model. Existing active-root
  validation applies to reads, writes, and explorer actions. No sibling grants.
- Source comes from a disk read or completed disk write before rendering. Saved
  buffers match initial disk bytes; later editing marks dirty until saved.

## Testing

Configured commands: npm run lint; npm run test (17 tests); npm run build;
npm run test:smoke. Use existing Node test runner and Electron Playwright harness.
Use fixture folders and mock native dialog results inside the existing harness.
No new runner or dependencies. Test example collision, error/retry, cancel,
plain folder, sample folder, close-last, and existing workspace behavior.
Record actual outcomes below. Native macOS/Linux behavior is not verified on Windows.

## Notes for the AI

User explicitly requested two folder actions in File Explorer, replacing the prior
standalone workflow. Preserve this choice in the plans and generated overview.
Build attempt and branch remain unchanged. Independent review remains selected
for filesystem side effects. Do not commit without explicit checkpoint approval.

## Verification evidence

- Windows: npm run lint passed; npm run test passed (17 tests); npm run
  test:smoke passed, including the production build. git diff --check passed.
- Smoke verifies both entry-button cancellations, example creation failure/retry,
  plain folder with no rendered output, non-overwritten existing example file,
  newly written numbered example visible in tree/tab/preview, final-tab welcome,
  and existing tabs/save/Quick Open/file lifecycle/editing/layout behavior.
- Earlier smoke setup assumptions about selected folder and tab ordering were
  corrected; the final full configured command passed after those corrections.
- Welcome and narrow workspace screenshots were captured in the OS temporary
  directory and visually inspected. Native dialog selections were mocked in the
  harness; real macOS/Linux native dialogs remain untested. The inherited
  ELECTRON_RUN_AS_NODE flag was cleared in the test shell for GUI launch.
- Independent review is selected for filesystem side effects; awaiting explicit
  checkpoint commit approval. No commit, merge, or review receipt was created.
- Check and ordinary Audit remain manual; no findings are recorded. Try-guide
  supplies a direct user observation path, not additional acceptance evidence.


<!-- blueprint:completion {"schemaVersion":2,"specBytes":8481,"specSha256":"fbd3452d7d93bdcd55993055b677c980cd3d95aa2fd1baaf4e5768569aa1e840","branch":"refs/heads/feature/local-file-welcome-flow","head":"12ab3dce85f5aa258a8c25ae03282bf41474a3bd","baseRef":"refs/heads/main","baseCommit":"c3bdef1a5064b239f9450adc1388f38241b65ab9","sourceTree":"bd5bd9d43e47ea6ef6e92e565f05d46fd4c350c5","landing":"local-merge","absentOptional":[]} -->

## Completion verification

Final npm run build and npm run test passed on Windows (17 tests). The current
work item's Check also passed the configured Electron smoke command, screenshots,
and startup console/request checks. Native dialogs were simulated in the harness;
macOS/Linux native behavior remains untested.

## Review disposition

The user explicitly requested removal of the pending independent review, then
requested completion. Proceeded under that work-item instruction; no passing
independent review is claimed. Project review policy remains unchanged.
The original spec above is preserved verbatim, including historical review notes.

## Try it now

Run npm run dev from contract-editor-desktop/. In File Explorer, choose
Open Folder (with example file) and select a local folder.

Expected: a new example.contract (or unused numbered variant) appears on disk
and in File Explorer, with its source and rendered contract displayed.

This proves: example drafting opens through a persisted file in the selected folder.
