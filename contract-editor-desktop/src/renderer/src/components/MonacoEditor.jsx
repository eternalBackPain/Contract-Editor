// TODO: FIX ISSUE WITH CANCELED: CANCELED

// Explaination: https://chatgpt.com/s/t_69257d9339a48191beb2b18a07f0a73f

import { useEffect, useRef } from 'react'
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

function MonacoEditor({ onChange, value }) {
  const containerRef = useRef(null)
  const editorRef = useRef(null)

  useEffect(() => {
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
      value: value ?? DEFAULT_EDITOR_TEXT,
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

    const disposable = editor.onDidChangeModelContent(() => {
      const nextValue = editor.getValue()
      if (onChange) {
        onChange(nextValue)
      }
    })

    if (onChange) {
      onChange(editor.getValue())
    }

    return () => {
      disposable.dispose()
      editor.dispose()
      editorRef.current = null
    }
  }, [])

  useEffect(() => {
    const editor = editorRef.current
    if (!editor || typeof value !== 'string') return
    if (editor.getValue() !== value) {
      editor.setValue(value)
    }
  }, [value])

  return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
}

export default MonacoEditor
