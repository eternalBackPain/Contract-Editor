import { useCallback, useEffect, useRef, useState } from 'react'
import ActivityPane from './components/ActivityPane'
import EditorPane from './components/EditorPane'
import ExplorerPanel from './components/ExplorerPanel'
import OutputPane from './components/OutputPane'
import {
  compile,
  getDefaultStyleProfile,
  resolveStyleProfile,
  validateStyleProfile
} from '@contract-editor/core'
import { WORKSPACE_THEME_METRICS } from './lib/theme'
import {
  loadWorkspaceLayoutPrefs,
  loadWorkspaceStylePrefs,
  saveWorkspaceLayoutPrefs,
  saveWorkspaceStylePrefs
} from './lib/workspacePrefs'

const INITIAL_EDITOR_TEXT = `@begin{GeneralConditions}
# No guarantee of work or exclusivity
The Contract Authority is not, by executing this MICTA:
## bound to issue any Order Proposal to the Supplier;
## bound to engage the Supplier to supply any goods, services and/or other activities or to enter into any Contract; or
## restricted in any way from engaging any other person to supply any goods, services and/or other activities:
### of any type, including goods, services and/or other activities that are the same as or similar to any Supplier's Activities or ICT Activities; or
### at any location where, or in respect of any project that, the Supplier may be required to supply goods, services and/or other activities.
@end{GeneralConditions}`

function fileNameFromPath(path) {
  if (!path) return 'Untitled draft'
  const normalized = path.replace(/\\/g, '/')
  const parts = normalized.split('/')
  return parts[parts.length - 1] || 'Untitled draft'
}

function countWords(text = '') {
  const trimmed = text.trim()
  if (!trimmed) return 0
  return trimmed.split(/\s+/).length
}

function escapeHtml(text) {
  if (typeof text !== 'string') return ''
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function diagnosticsToPreviewHtml(diagnostics) {
  if (!Array.isArray(diagnostics) || diagnostics.length === 0) return ''

  const items = diagnostics
    .map((diagnostic) => {
      const code = escapeHtml(diagnostic?.code || 'UNKNOWN')
      const message = escapeHtml(diagnostic?.message || 'Unknown error')
      const severity = escapeHtml(diagnostic?.severity || 'error')
      const line = Number.isFinite(diagnostic?.line) ? diagnostic.line : 0
      const column = Number.isFinite(diagnostic?.column) ? diagnostic.column : 0
      const location = line > 0 ? `Line ${line}, Column ${column + 1}` : 'Unknown location'

      return [
        '<li style="list-style:none; margin:0 0 8px;">',
        `<p style="margin:0 0 6px;"><strong>${code}</strong> ${severity.toUpperCase()}</p>`,
        `<p style="margin:0 0 6px;">${message}</p>`,
        `<p style="margin:0;">${location}</p>`,
        '</li>'
      ].join('')
    })
    .join('')

  return `<ol style="margin:0; padding:0;">${items}</ol>`
}

function isPlainObject(value) {
  return !!value && typeof value === 'object' && !Array.isArray(value)
}

function formatStyleDraft(value) {
  if (!isPlainObject(value) || Object.keys(value).length === 0) {
    return JSON.stringify(getDefaultStyleProfile(), null, 2)
  }
  return JSON.stringify(resolveStyleProfile(value), null, 2)
}

const DEFAULT_STYLE_PROFILE = getDefaultStyleProfile()
const DEFAULT_STYLE_PROFILE_TEXT = JSON.stringify(DEFAULT_STYLE_PROFILE)

function isDefaultProfile(profile) {
  if (!isPlainObject(profile)) return true
  return JSON.stringify(resolveStyleProfile(profile)) === DEFAULT_STYLE_PROFILE_TEXT
}

function App() {
  const [initialLayoutPrefs] = useState(() => loadWorkspaceLayoutPrefs())
  const [initialStyleOverride] = useState(() => loadWorkspaceStylePrefs())
  const [editorText, setEditorText] = useState(INITIAL_EDITOR_TEXT)
  const [lastSavedText, setLastSavedText] = useState(INITIAL_EDITOR_TEXT)
  const [activeFilePath, setActiveFilePath] = useState('')
  const [HTMLText, setHTMLText] = useState('')
  const [styleProfileOverride, setStyleProfileOverride] = useState(initialStyleOverride)
  const [styleDraftText, setStyleDraftText] = useState(() => formatStyleDraft(initialStyleOverride))
  const [styleParseError, setStyleParseError] = useState('')
  const [styleDiagnostics, setStyleDiagnostics] = useState([])
  const [activeExplorer, setActiveExplorer] = useState('files')
  const [explorerWidth, setExplorerWidth] = useState(initialLayoutPrefs.explorerWidth)
  const [editorWidth, setEditorWidth] = useState(initialLayoutPrefs.editorWidth)
  const [showExplorer, setShowExplorer] = useState(initialLayoutPrefs.showExplorer)
  const [showPreview, setShowPreview] = useState(initialLayoutPrefs.showPreview)
  const [saveBadgeVersion, setSaveBadgeVersion] = useState(0)
  const [showSaveBadge, setShowSaveBadge] = useState(false)
  const editorOutputRef = useRef(null)
  const saveBadgeTimerRef = useRef(null)
  const isDirty = editorText !== lastSavedText
  const currentFileLabel = fileNameFromPath(activeFilePath)
  const saveLabel = activeFilePath ? (isDirty ? 'Unsaved changes' : 'Saved') : 'Scratch buffer'
  const wordCount = countWords(editorText)
  const isUsingDefaultStyle = isDefaultProfile(styleProfileOverride)

  function handleOnChange(value) {
    setEditorText(value)
  }

  const compilePreview = useCallback((source, styleOverride) => {
    const result = compile(source, 'html', {
      styleProfile: styleOverride,
      includeCss: true
    })
    setHTMLText(result.success ? result.output : diagnosticsToPreviewHtml(result.diagnostics))
  }, [])

  const handleApplyStyleProfile = useCallback(() => {
    let parsed
    try {
      parsed = JSON.parse(styleDraftText || '{}')
    } catch {
      setStyleParseError('Invalid JSON. Fix the profile before applying.')
      setStyleDiagnostics([])
      return
    }

    if (!isPlainObject(parsed)) {
      setStyleParseError('Style profile override must be a JSON object.')
      setStyleDiagnostics([])
      return
    }

    const diagnostics = validateStyleProfile(parsed)
    const resolvedProfile = resolveStyleProfile(parsed)
    const nextStyleProfile = isDefaultProfile(resolvedProfile) ? null : resolvedProfile
    setStyleDiagnostics(diagnostics)
    setStyleParseError('')
    setStyleProfileOverride(nextStyleProfile)
    setStyleDraftText(JSON.stringify(resolvedProfile, null, 2))
    saveWorkspaceStylePrefs(nextStyleProfile)
  }, [styleDraftText])

  const handleResetStyleProfile = useCallback(() => {
    setStyleProfileOverride(null)
    setStyleDraftText(JSON.stringify(DEFAULT_STYLE_PROFILE, null, 2))
    setStyleParseError('')
    setStyleDiagnostics([])
    saveWorkspaceStylePrefs(null)
  }, [])

  const handleStyleDraftChange = useCallback((value) => {
    setStyleDraftText(value)
    setStyleParseError('')
  }, [])

  const handleSaveCurrentFile = useCallback(async () => {
    if (!activeFilePath || !window.api?.writeFile) return

    try {
      await window.api.writeFile(activeFilePath, editorText)
      setLastSavedText(editorText)
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

  useEffect(() => {
    saveWorkspaceLayoutPrefs({
      explorerWidth,
      editorWidth,
      showExplorer,
      showPreview
    })
  }, [editorWidth, explorerWidth, showExplorer, showPreview])

  useEffect(() => {
    compilePreview(editorText, styleProfileOverride)
  }, [compilePreview, editorText, styleProfileOverride])

  function handleFileSelect(content, node) {
    setEditorText(content)
    setLastSavedText(content)
    setActiveFilePath(node?.path || '')
  }

  function handleProjectOpened() {
    setActiveFilePath('')
    setEditorText('')
    setLastSavedText('')
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
      if (!bounds) return
      const startEditor = editorWidth ?? Math.floor(bounds.width / 2)

      document.body.style.userSelect = 'none'
      document.body.style.cursor = 'col-resize'

      function onMove(ev) {
        const dx = ev.clientX - startX
        if (kind === 'explorer') {
          setExplorerWidth(
            clamp(
              startExplorer + dx,
              WORKSPACE_THEME_METRICS.minExplorerWidth,
              WORKSPACE_THEME_METRICS.maxExplorerWidth
            )
          )
          return
        }
        if (kind === 'editor') {
          const min = WORKSPACE_THEME_METRICS.minPaneWidth
          const max = bounds.width - WORKSPACE_THEME_METRICS.minPaneWidth
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

  function handleActivitySelect(next) {
    setActiveExplorer((prev) => {
      if (prev === next && showExplorer) {
        setShowExplorer(false)
        return prev
      }
      setShowExplorer(true)
      return next
    })
  }

  return (
    <div className="workspace-shell">
      {showSaveBadge && (
        <div key={saveBadgeVersion} className="save-badge" role="status" aria-live="polite">
          <span className="save-badge-icon" aria-hidden="true" />
          Saved
        </div>
      )}
      <div className="workspace-main">
        <div className="activity-bar">
          <ActivityPane active={activeExplorer} onSelect={handleActivitySelect} />
        </div>
        {showExplorer ? (
          <div className="workspace-sidebar" style={{ width: explorerWidth }}>
            <ExplorerPanel
              active={activeExplorer}
              onFileSelect={handleFileSelect}
              selectedFilePath={activeFilePath}
              onProjectOpened={handleProjectOpened}
              formattingState={{
                draftText: styleDraftText,
                parseError: styleParseError,
                diagnostics: styleDiagnostics,
                isUsingDefault: isUsingDefaultStyle,
                onDraftChange: handleStyleDraftChange,
                onApply: handleApplyStyleProfile,
                onReset: handleResetStyleProfile
              }}
            />
          </div>
        ) : null}
        {showExplorer ? (
          <div className="resizer workspace-resizer" onMouseDown={startDrag('explorer')} />
        ) : null}
        <div ref={editorOutputRef} className="workspace-editor-group">
          <div
            className={`workspace-pane workspace-editor-pane ${showPreview && editorWidth ? 'is-fixed' : 'is-flex'}`}
            style={showPreview && editorWidth ? { width: editorWidth } : undefined}
          >
            <header className="pane-header">
              <span className="pane-title">{currentFileLabel}</span>
              <span className={`pane-meta ${isDirty ? 'is-dirty' : ''}`}>{saveLabel}</span>
            </header>
            <div className="pane-body">
              <EditorPane onChange={handleOnChange} value={editorText} />
            </div>
          </div>
          {showPreview ? (
            <div className="resizer workspace-resizer" onMouseDown={startDrag('editor')} />
          ) : null}
          {showPreview ? (
            <div className="workspace-pane workspace-preview-pane">
              <header className="pane-header">
                <span className="pane-title">Rendered Contract</span>
                <button
                  type="button"
                  className="pane-header-button"
                  onClick={() => setShowPreview(false)}
                >
                  Hide Preview
                </button>
              </header>
              <div className="pane-body">
                <OutputPane html={HTMLText} />
              </div>
            </div>
          ) : (
            <div className="preview-collapsed">
              <button
                type="button"
                className="pane-header-button"
                onClick={() => setShowPreview(true)}
              >
                Show Preview
              </button>
            </div>
          )}
        </div>
      </div>
      <footer className="workspace-status-bar">
        <span>{currentFileLabel}</span>
        <span>{wordCount} words</span>
        <span>{saveLabel}</span>
      </footer>
    </div>
  )
}

export default App
