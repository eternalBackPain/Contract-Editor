import React, { useState } from 'react'
import ActivityPane from './components/ActivityPane'
import EditorPane from './components/EditorPane'
import ExplorerPane from './components/ExplorerPane'
import OutputPane from './components/OutputPane'
import { parseToXML } from './lib/parseToXml'
import { XMLtoHTML } from './lib/XMLToHTML'
import { html } from 'monaco-editor'

function App() {
  const [XMLText, setXMLText] = useState('')
  const [HTMLText, setHTMLText] = useState('')

  async function handleOnChange(value) {
    // 1. Parse to XML
    const xml = await parseToXML(value)
    setXMLText(xml)
    console.log(XMLText) //why does this not update
    console.log(xml)
    // 2. Transform XML to HTML
    const html = await XMLtoHTML(xml)
    setHTMLText(html)
    console.log(HTMLText)
    console.log(html)
  }

  return (
    <>
      <div className="flex h-screen min-h-0 w-screen overflow-hidden">
        <div className="bg-stone-400 w-12 shrink-0">
          <ActivityPane />
        </div>
        <div className="bg-stone-300 hidden md:flex w-56 lg:w-64 shrink-0 min-w-0">
          <ExplorerPane />
        </div>
        <div className="flex flex-1 min-w-0 min-h-0">
          <div className="bg-stone-200 flex-1 min-w-0 min-h-0 overflow-hidden">
            <EditorPane onChange={handleOnChange} />
          </div>
          <div className="bg-stone-100 flex-1 min-w-0 min-h-0 border-l border-stone-300">
            <OutputPane html={HTMLText} />
          </div>
        </div>

      </div>
    </>
  )
}

export default App
