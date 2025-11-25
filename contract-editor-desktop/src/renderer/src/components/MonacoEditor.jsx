// Explaination: https://chatgpt.com/s/t_69257d9339a48191beb2b18a07f0a73f

import React, { useEffect, useRef } from 'react'
import { monaco } from '../monaco'

function MonacoEditor( {onChange} ) {
  // This ref will point to a normal <div> in the DOM
  const containerRef = useRef(null)
  // We'll store the editor instance here so we can clean it up later
  const editorRef = useRef(null)

  useEffect(() => {
    if (!containerRef.current) return

    // Create the Monaco editor inside the <div> referenced by containerRef
    const editor = monaco.editor.create(containerRef.current, {
      value: 'Insert your text here',
      language: 'plaintext',
      automaticLayout: true, // makes it resize when the container size changes
      wordWrap: 'on',
      minimap: { enabled: false }
    })

    editorRef.current = editor

    //Listen for changes
    const disposable = editor.onDidChangeModelContent(() => {
      const value = editor.getValue();
      if (onChange) {
        onChange(value)
      }
    })

    // Cleanup function: React will call this when the component unmounts
    return () => {
      disposable.dispose()
      editor.dispose()
      editorRef.current = null
    }
  }, [onChange]) // empty array = run once when component mounts

  // This <div> is where Monaco will render the editor.
  // Make sure it has a size (width/height) or you'll see nothing.
  return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
}

export default MonacoEditor
