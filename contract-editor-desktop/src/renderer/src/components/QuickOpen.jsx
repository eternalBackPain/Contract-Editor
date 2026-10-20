import { useEffect, useMemo, useRef, useState } from 'react'

function matches(text, query) {
  let index = 0
  for (const character of text.toLowerCase()) {
    if (character === query[index]) index += 1
  }
  return index === query.length
}

export default function QuickOpen({ root, onSelect, onClose }) {
  const dialogRef = useRef(null)
  const [files, setFiles] = useState([])
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(0)
  const [loading, setLoading] = useState(Boolean(root))
  const [error, setError] = useState('')
  const [opening, setOpening] = useState(false)

  useEffect(() => {
    const previousFocus = document.activeElement
    dialogRef.current.showModal()
    return () => previousFocus?.focus()
  }, [])

  useEffect(() => {
    if (!root) return
    let cancelled = false
    async function scan() {
      const pending = [root.path]
      const results = []
      let scanned = 0
      try {
        while (pending.length && !cancelled) {
          const children = await window.api.listChildren(pending.shift())
          for (const child of children) {
            scanned += 1
            if (scanned > 10000)
              throw new Error('Folder is too large. Open a smaller project folder.')
            if (child.type === 'folder' && !['.git', 'node_modules'].includes(child.name)) {
              pending.push(child.path)
            } else if (child.type === 'file' && /\.(contract|txt)$/i.test(child.name)) {
              results.push(child)
            }
          }
        }
        if (!cancelled) setFiles(results)
      } catch (error) {
        if (!cancelled) setError(error.message)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    void scan()
    return () => {
      cancelled = true
    }
  }, [root])

  const results = useMemo(() => {
    const normalized = query.trim().toLowerCase().replace(/\\/g, '/')
    return files
      .filter((file) =>
        matches(file.path.slice(root.path.length + 1).replace(/\\/g, '/'), normalized)
      )
      .sort((a, b) => {
        const aExact = a.name.toLowerCase().startsWith(normalized)
        const bExact = b.name.toLowerCase().startsWith(normalized)
        return (
          Number(bExact) - Number(aExact) ||
          a.name.localeCompare(b.name) ||
          a.path.localeCompare(b.path)
        )
      })
      .slice(0, 100)
  }, [files, query, root])

  useEffect(() => {
    document.getElementById(`quick-open-${selected}`)?.scrollIntoView({ block: 'nearest' })
  }, [selected])

  async function open(file) {
    if (!file || opening) return
    setOpening(true)
    try {
      await onSelect(file)
      onClose()
    } catch (error) {
      setError(`Could not open file: ${error.message}`)
      setOpening(false)
    }
  }

  return (
    <dialog
      ref={dialogRef}
      className="quick-open"
      aria-label="Quick Open"
      onCancel={onClose}
      onKeyDown={(event) => {
        if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
          event.preventDefault()
          setSelected((index) =>
            Math.max(0, Math.min(results.length - 1, index + (event.key === 'ArrowDown' ? 1 : -1)))
          )
        } else if (event.key === 'Enter') {
          event.preventDefault()
          void open(results[selected])
        }
      }}
    >
      <div className="quick-open-input-row">
        <input
          autoFocus
          role="combobox"
          aria-label="Search files by name or path"
          aria-expanded="true"
          aria-controls="quick-open-results"
          aria-activedescendant={results[selected] ? `quick-open-${selected}` : undefined}
          value={query}
          placeholder="Search files by name or path"
          onChange={(event) => {
            setQuery(event.target.value)
            setSelected(0)
          }}
        />
        <button type="button" aria-label="Close Quick Open" onClick={onClose}>
          ×
        </button>
      </div>
      {!root && <p>Open a project folder to search its contract files.</p>}
      {loading && <p role="status">Finding files…</p>}
      {error && <p role="alert">{error}</p>}
      <div
        id="quick-open-results"
        role="listbox"
        aria-label="Matching files"
        className="quick-open-results"
      >
        {results.map((file, index) => (
          <div
            key={file.path}
            id={`quick-open-${index}`}
            role="option"
            aria-selected={index === selected}
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => void open(file)}
          >
            <span>{file.name}</span>
            <small>{file.path.slice(root.path.length + 1)}</small>
          </div>
        ))}
      </div>
      {root && !loading && !error && results.length === 0 && (
        <p role="status">No matching contract or text files.</p>
      )}
      <p className="quick-open-hint">↑ ↓ to select · Enter to open · Esc to dismiss</p>
    </dialog>
  )
}
