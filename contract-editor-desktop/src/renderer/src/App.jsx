import { useCallback, useEffect, useRef, useState } from 'react'
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
  const [HTMLText, setHTMLText] = useState('')
  const [activeExplorer, setActiveExplorer] = useState('files')
  const [explorerWidth, setExplorerWidth] = useState(240)
  const [editorWidth, setEditorWidth] = useState(null)
  const [saveBadgeVersion, setSaveBadgeVersion] = useState(0)
  const [showSaveBadge, setShowSaveBadge] = useState(false)
  const editorOutputRef = useRef(null)
  const saveBadgeTimerRef = useRef(null)

  async function handleOnChange(value) {
    setEditorText(value)
    const xml = await parseToXML(value)
    const html = await XMLtoHTML(xml)
    setHTMLText(html)
  }

  const handleSaveCurrentFile = useCallback(async () => {
    if (!activeFilePath || !window.api?.writeFile) return

    try {
      await window.api.writeFile(activeFilePath, editorText)
      setShowSaveBadge(true)
      setSaveBadgeVersion((version) => version + 1)
      if (saveBadgeTimerRef.current) {
        window.clearTimeout(saveBadgeTimerRef.current)
      }
      saveBadgeTimerRef.current = window.setTimeout(() => {
        setShowSaveBadge(false)
      }, 1200)
    } catch (error) {
      console.error('Failed to save file:', error)
    }
  }, [activeFilePath, editorText])

  useEffect(() => {
    if (!window.api?.onMenuSave) return undefined
    const unsubscribe = window.api.onMenuSave(() => {
      void handleSaveCurrentFile()
    })
    return unsubscribe
  }, [handleSaveCurrentFile])

  useEffect(() => {
    return () => {
      if (saveBadgeTimerRef.current) {
        window.clearTimeout(saveBadgeTimerRef.current)
      }
    }
  }, [])

  function handleFileSelect(content, node) {
    setEditorText(content)
    setActiveFilePath(node?.path || '')
  }

  function handleProjectOpened() {
    setActiveFilePath('')
    setEditorText('')
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
        {showSaveBadge && (
          <div key={saveBadgeVersion} className="save-badge" role="status" aria-live="polite">
            <span className="save-badge-icon" aria-hidden="true" />
            Saved
          </div>
        )}
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
            selectedFilePath={activeFilePath}
            onProjectOpened={handleProjectOpened}
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
