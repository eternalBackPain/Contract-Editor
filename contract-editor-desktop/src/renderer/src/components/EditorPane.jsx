import React from 'react'
import MonacoEditor from './MonacoEditor'

function EditorPane({ onChange, value }) {
  return (
    <div className="flex h-screen">
      <MonacoEditor onChange={onChange} value={value} />
    </div>
  )
}

export default EditorPane
