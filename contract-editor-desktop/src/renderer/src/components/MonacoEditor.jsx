//TODO: FIX ISSUE WITH CANCELED: CANCELED

// Explaination: https://chatgpt.com/s/t_69257d9339a48191beb2b18a07f0a73f

import React, { useEffect, useRef } from 'react'
import { monaco } from '../monaco'

function MonacoEditor({ onChange }) {
  const containerRef = useRef(null)
  const editorRef = useRef(null)

  useEffect(() => {
    if (!containerRef.current) return

    // Create the Monaco editor inside the <div> referenced by containerRef
    const editor = monaco.editor.create(containerRef.current, {
      value: `@begin{GeneralConditions}
# No guarantee of work or exclusivity
The Contract Authority is not, by executing this MICTA:
## bound to issue any Order Proposal to the Supplier;
## bound to engage the Supplier to supply any goods, services and/or other activities or to enter into any Contract; or
## restricted in any way from engaging any other person to supply any goods, services and/or other activities:
### of any type, including goods, services and/or other activities that are the same as or similar to any Supplier's Activities or ICT Activities; or
### at any location where, or in respect of any project that, the Supplier may be required to supply goods, services and/or other activities.
@end{GeneralConditions}`,
      language: 'plaintext',
      automaticLayout: true, // makes it resize when the container size changes
      wordWrap: 'on',
      minimap: { enabled: false }
    })

    editorRef.current = editor

    //Listen for changes
    const disposable = editor.onDidChangeModelContent(() => {
      const value = editor.getValue()
      if (onChange) {
        onChange(value)
      }
    })

    if (onChange) {
      onChange(editor.getValue())
    }

    // Cleanup function: React will call this when the component unmounts
    return () => {
      disposable.dispose()
      editor.dispose()
      editorRef.current = null
    }
  }, []) // empty array = run once when component mounts

  // This <div> is where Monaco will render the editor.
  // Make sure it has a size (width/height) or you'll see nothing.
  return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
}

export default MonacoEditor
