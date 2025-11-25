//TODO: configure APIs

import React, { useState } from 'react'
import ActivityPane from './components/ActivityPane'
import EditorPane from './components/EditorPane'
import ExplorerPane from './components/ExplorerPane'
import OutputPane from './components/OutputPane'

function App() {
  const [XMLText, setXMLText] = useState('')
  const [HTMLText, setHTMLText] = useState('')

  const handleOnChange = async (value) => {
    console.log('Sending to api =>', value)
    try {
      // 1. Parse to XML
      const parseRes = await fetch('/api/parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: value })
      })
      const { success: ok1, data: xml } = await parseRes.json()
      console.log('Parse response =>', { ok1, xml })
      setXMLText(xml)

      // 2. Transform XML to HTML
      const transformRes = await fetch('/api/transform', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: xml })
      })
      const { success: ok2, data: html } = await transformRes.json()
      console.log('Transform response =>', { ok2, html })
      setHTMLText(html)
    } catch (err) {
      console.error('Error in parse/transform flow:', err)
    }
  }

  return (
    <>
      <div className="flex h-screen">
        <div className="bg-slate-400 w-14">
          <ActivityPane />
        </div>
        <div className="bg-slate-300 w-1/5">
          <ExplorerPane />
        </div>
        <div className="bg-slate-200 flex-1">
          <EditorPane onChange={handleOnChange} />
        </div>
        <div className="bg-slate-100 flex-1">
          <OutputPane />
        </div>
      </div>
    </>
  )
}

export default App
