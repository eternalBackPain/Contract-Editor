import React, { useEffect, useRef, useState } from 'react'
import ActivityPane from './components/ActivityPane'
import EditorPane from './components/EditorPane'
import ExplorerPanel from './components/ExplorerPanel'
import OutputPane from './components/OutputPane'
import { parseToXML } from './lib/parseToXml'
import { XMLtoHTML } from './lib/XMLToHTML'

const INITIAL_EDITOR_TEXT = `@begin{GeneralConditions}
# No guarantee of work or exclusivity
The Contract Authority is not, by executing this MICTA:
## bound to issue any Order Proposal to the Supplier;
## bound to engage the Supplier to supply any goods, services and/or other activities or to enter into any Contract; or
## restricted in any way from engaging any other person to supply any goods, services and/or other activities:
### of any type, including goods, services and/or other activities that are the same as or similar to any Supplier's Activities or ICT Activities; or
### at any location where, or in respect of any project that, the Supplier may be required to supply goods, services and/or other activities.
@end{GeneralConditions}`

function App() {
  const [editorText, setEditorText] = useState(INITIAL_EDITOR_TEXT)
  const [activeFilePath, setActiveFilePath] = useState('')
  const [projectTree, setProjectTree] = useState(null)
  const [XMLText, setXMLText] = useState('')
  const [HTMLText, setHTMLText] = useState('')
  const [activeExplorer, setActiveExplorer] = useState('files')
  const [explorerWidth, setExplorerWidth] = useState(240)
  const [editorWidth, setEditorWidth] = useState(null)
  const editorOutputRef = useRef(null)

  async function handleOnChange(value) {
    setEditorText(value)

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

  async function handleSaveCurrentFile() {
    if (!activeFilePath || !window.api?.writeTxtFile) return
    try {
      await window.api.writeTxtFile(activeFilePath, editorText)
    } catch (error) {
      console.error('Failed to save file:', error)
    }
  }

  useEffect(() => {
    if (!window.api?.onMenuSave) return undefined
    const unsubscribe = window.api.onMenuSave(() => {
      void handleSaveCurrentFile()
    })
    return unsubscribe
  }, [activeFilePath, editorText])

  useEffect(() => {
    if (!window.api?.onProjectSelected) return undefined
    const unsubscribe = window.api.onProjectSelected((tree) => {
      setProjectTree(tree)
      setActiveFilePath('')
    })
    return unsubscribe
  }, [])

  function handleFileSelect(content, node) {
    setEditorText(content)
    setActiveFilePath(node?.path || '')
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
          <ExplorerPanel
            active={activeExplorer}
            onFileSelect={handleFileSelect}
            projectTree={projectTree}
            selectedFilePath={activeFilePath}
          />
        </div>
        <div className="resizer" onMouseDown={startDrag('explorer')} />
        <div ref={editorOutputRef} className="flex flex-1 min-w-0 min-h-0">
          <div
            className={`bg-stone-200 min-w-0 min-h-0 overflow-hidden ${editorWidth ? 'shrink-0' : 'flex-1'}`}
            style={editorWidth ? { width: editorWidth } : undefined}
          >
            <EditorPane onChange={handleOnChange} value={editorText} />
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