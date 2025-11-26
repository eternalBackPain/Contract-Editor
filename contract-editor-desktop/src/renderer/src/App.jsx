//TODO: configure APIs

import React, { useState } from 'react'
import ActivityPane from './components/ActivityPane'
import EditorPane from './components/EditorPane'
import ExplorerPane from './components/ExplorerPane'
import OutputPane from './components/OutputPane'
import { parseToXML } from './lib/parseToXml'

function App() {
  const [XMLText, setXMLText] = useState('')
  const [HTMLText, setHTMLText] = useState('')

  async function handleOnChange(value) {
    // 1. Parse to XML
    const xml = await parseToXML(value)
    setXMLText(xml)
    console.log(XMLText)
    // 2. Transform XML to HTML

    // setHTMLText(html)
    // console.log(HTMLText)
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
