import React, { useRef, useState } from 'react'
import ActivityPane from './components/ActivityPane'
import EditorPane from './components/EditorPane'
import ExplorerPanel from './components/ExplorerPanel'
import OutputPane from './components/OutputPane'
import { parseToXML } from './lib/parseToXml'
import { XMLtoHTML } from './lib/XMLToHTML'
import { html } from 'monaco-editor'

function App() {
  const [XMLText, setXMLText] = useState('')
  const [HTMLText, setHTMLText] = useState('')
  const [activeExplorer, setActiveExplorer] = useState('files')
  const [explorerWidth, setExplorerWidth] = useState(240)
  const [editorWidth, setEditorWidth] = useState(null)
  const editorOutputRef = useRef(null)

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

  function clamp(val, min, max) {
    return Math.min(Math.max(val, min), max)
  }

  function startDrag(kind) {
    return (e) => {
      e.preventDefault()
      const startX = e.clientX
      const startExplorer = explorerWidth
      const bounds = editorOutputRef.current?.getBoundingClientRect()
      const startEditor = editorWidth ?? Math.floor(bounds.width / 2)

      document.body.style.userSelect = 'none'
      document.body.style.cursor = 'col-resize'

      function onMove(ev) {
        const dx = ev.clientX - startX
        if (kind === 'explorer') {
          setExplorerWidth(clamp(startExplorer + dx, 160, 480))
          return
        }
        if (kind === 'editor') {
          const min = 240
          const max = bounds.width - 240
          setEditorWidth(clamp(startEditor + dx, min, max))
        }
      }

      function onUp() {
        document.body.style.userSelect = ''
        document.body.style.cursor = ''
        window.removeEventListener('mousemove', onMove)
        window.removeEventListener('mouseup', onUp)
      }

      window.addEventListener('mousemove', onMove)
      window.addEventListener('mouseup', onUp)
    }
  }

  return (
    <>
        <div className="flex h-screen min-h-0 w-screen overflow-hidden">
        <div className="bg-[#4A5659] w-12 shrink-0">
          <ActivityPane active={activeExplorer} onSelect={setActiveExplorer} />
        </div>
        <div
          className="bg-[#859599] hidden md:flex shrink-0 min-w-0"
          style={{ width: explorerWidth }}
        >
          <ExplorerPanel active={activeExplorer} />
        </div>
        <div className="resizer" onMouseDown={startDrag('explorer')} />
        <div ref={editorOutputRef} className="flex flex-1 min-w-0 min-h-0">
          <div
            className={`bg-stone-200 min-w-0 min-h-0 overflow-hidden ${editorWidth ? 'shrink-0' : 'flex-1'}`}
            style={editorWidth ? { width: editorWidth } : undefined}
          >
            <EditorPane onChange={handleOnChange} />
          </div>
          <div className="resizer" onMouseDown={startDrag('editor')} />
          <div className="bg-white flex-1 min-w-0 min-h-0 border-l border-stone-300">
            <OutputPane html={HTMLText} />
          </div>
        </div>
      </div>
    </>
  )
}

export default App
