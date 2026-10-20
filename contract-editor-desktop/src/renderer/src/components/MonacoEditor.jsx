// TODO: FIX ISSUE WITH CANCELED: CANCELED

// Explaination: https://chatgpt.com/s/t_69257d9339a48191beb2b18a07f0a73f

import { useLayoutEffect, useRef } from 'react'
import { monaco } from '../monaco'

const EDITOR_THEME_NAME = 'contract-editor-theme'

const DEFAULT_EDITOR_TEXT = `@begin{GeneralConditions}
# No guarantee of work or exclusivity
The Contract Authority is not, by executing this MICTA:
## bound to issue any Order Proposal to the Supplier;
## bound to engage the Supplier to supply any goods, services and/or other activities or to enter into any Contract; or
## restricted in any way from engaging any other person to supply any goods, services and/or other activities:
### of any type, including goods, services and/or other activities that are the same as or similar to any Supplier's Activities or ICT Activities; or
### at any location where, or in respect of any project that, the Supplier may be required to supply goods, services and/or other activities.
@end{GeneralConditions}`

function MonacoEditor({ onChange, value, documentId, openDocumentIds, onReady }) {
  const containerRef = useRef(null)
  const editorRef = useRef(null)
  const modelsRef = useRef(new Map())
  const currentIdRef = useRef(null)
  const onChangeRef = useRef(onChange)
  useLayoutEffect(() => {
    onChangeRef.current = onChange
  }, [onChange])

  useLayoutEffect(() => {
    if (!containerRef.current) return

    monaco.editor.defineTheme(EDITOR_THEME_NAME, {
      base: 'vs',
      inherit: true,
      rules: [],
      colors: {
        'editor.background': '#ffffff',
        'editor.foreground': '#1a1f22',
        'editor.lineHighlightBackground': '#f4f6f7',
        'editorLineNumber.foreground': '#7a868f',
        'editorLineNumber.activeForeground': '#46525a',
        'editor.selectionBackground': '#dbe3e8',
        'editor.inactiveSelectionBackground': '#e8edf0',
        'editorCursor.foreground': '#233136',
        'editorIndentGuide.background1': '#ced5da',
        'editorIndentGuide.activeBackground1': '#aab5bc'
      }
    })

    const editor = monaco.editor.create(containerRef.current, {
      model: null,
      language: 'plaintext',
      theme: EDITOR_THEME_NAME,
      automaticLayout: true,
      fontFamily: 'Consolas, "Courier New", monospace',
      fontSize: 13,
      lineHeight: 19,
      wordWrap: 'on',
      minimap: { enabled: false },
      cursorBlinking: 'solid',
      smoothScrolling: true,
      renderWhitespace: 'selection',
      scrollBeyondLastLine: false,
      bracketPairColorization: { enabled: true },
      guides: { bracketPairs: true, indentation: true },
      stickyScroll: { enabled: true }
    })

    editorRef.current = editor
    const models = modelsRef.current
    const wrapAction = editor.addAction({
      id: 'contract.toggleWordWrap',
      label: 'Toggle Word Wrap',
      keybindings: [monaco.KeyMod.Alt | monaco.KeyCode.KeyZ],
      run: () =>
        editor.updateOptions({
          wordWrap: editor.getOption(monaco.editor.EditorOption.wordWrap) === 'off' ? 'on' : 'off'
        })
    })

    const disposable = editor.onDidChangeModelContent(() => {
      const nextValue = editor.getValue()
      onChangeRef.current?.(nextValue)
    })

    return () => {
      disposable.dispose()
      wrapAction.dispose()
      editor.dispose()
      for (const entry of models.values()) entry.model.dispose()
      models.clear()
      editorRef.current = null
    }
  }, [])

  useLayoutEffect(() => onReady?.(editorRef.current), [onReady])

  useLayoutEffect(() => {
    const editor = editorRef.current
    if (!editor) return
    const models = modelsRef.current
    const previous = models.get(currentIdRef.current)
    if (currentIdRef.current !== documentId || !editor.getModel()) {
      if (previous) previous.viewState = editor.saveViewState()
      let entry = models.get(documentId)
      if (!entry) {
        entry = { model: monaco.editor.createModel(value ?? DEFAULT_EDITOR_TEXT, 'plaintext') }
        models.set(documentId, entry)
      }
      editor.setModel(entry.model)
      if (entry.viewState) editor.restoreViewState(entry.viewState)
      currentIdRef.current = documentId
      editor.focus()
    }
    for (const [id, entry] of models) {
      if (!openDocumentIds.includes(id)) {
        entry.model.dispose()
        models.delete(id)
      }
    }
  }, [documentId, openDocumentIds, value])

  return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
}

export default MonacoEditor
