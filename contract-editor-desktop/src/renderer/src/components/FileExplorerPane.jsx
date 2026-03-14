import { useEffect, useMemo, useRef, useState } from 'react'
import TreeNode from './TreeNode'
import { useExplorerState } from '../hooks/useExplorerState'

function parentOrSelfFolder(node, rootPath) {
  if (!node) return rootPath
  if (node.type === 'folder') return node.path
  return node.parentPath || rootPath
}

function fileNameFromPath(path) {
  const normalized = path.replace(/\\/g, '/')
  const idx = normalized.lastIndexOf('/')
  return idx === -1 ? normalized : normalized.slice(idx + 1)
}

function FileExplorerPane({ onFileSelect, selectedFilePath = '', onProjectOpened }) {
  const {
    projectRoot,
    nodeMap,
    visibleRows,
    expandedPaths,
    focusedPath,
    focusedIndex,
    filterQuery,
    scrollTop,
    setFilterQuery,
    setFocusedPath,
    setScrollTop,
    openProject,
    openFile,
    toggleFolder,
    refreshFolder,
    collapseAll,
    createAt,
    renamePath,
    deletePath
  } = useExplorerState({ openFilePath: selectedFilePath, onOpenFile: onFileSelect })

  const [inlineEdit, setInlineEdit] = useState(null)
  const [inlineValue, setInlineValue] = useState('')
  const [contextMenu, setContextMenu] = useState(null)

  const containerRef = useRef(null)
  const contextMenuRef = useRef(null)

  useEffect(() => {
    if (!window.api?.onMenuOpenProject) return undefined
    const unsubscribe = window.api.onMenuOpenProject(async () => {
      await openProject()
      setInlineEdit(null)
      setContextMenu(null)
      if (onProjectOpened) onProjectOpened()
    })
    return unsubscribe
  }, [onProjectOpened, openProject])

  useEffect(() => {
    if (!projectRoot?.path || !containerRef.current) return
    containerRef.current.scrollTop = scrollTop
  }, [projectRoot, scrollTop])

  useEffect(() => {
    if (!focusedPath || !containerRef.current) return
    const escapedPath =
      typeof CSS !== 'undefined' && CSS.escape ? CSS.escape(focusedPath) : focusedPath
    const el = containerRef.current.querySelector(`[data-path="${escapedPath}"]`)
    if (el) {
      el.scrollIntoView({ block: 'nearest' })
    }
  }, [focusedPath, visibleRows])

  useEffect(() => {
    function handleGlobalClick(event) {
      if (!contextMenuRef.current?.contains(event.target)) {
        setContextMenu(null)
      }
    }

    window.addEventListener('mousedown', handleGlobalClick)
    return () => window.removeEventListener('mousedown', handleGlobalClick)
  }, [])

  const rowsWithInline = useMemo(() => {
    if (!inlineEdit || inlineEdit.mode === 'rename') return visibleRows
    const parentIndex = visibleRows.findIndex((row) => row.path === inlineEdit.parentPath)
    if (parentIndex < 0) return visibleRows

    const parentRow = visibleRows[parentIndex]
    const nextRows = [...visibleRows]
    nextRows.splice(parentIndex + 1, 0, {
      path: inlineEdit.tempPath,
      depth: parentRow.depth + 1,
      isInlineCreate: true
    })
    return nextRows
  }, [inlineEdit, visibleRows])

  async function handleOpenProjectClick() {
    await openProject()
    setInlineEdit(null)
    setContextMenu(null)
    if (onProjectOpened) onProjectOpened()
  }

  function beginCreate(mode, folderPath) {
    const defaultName = mode === 'folder' ? 'new-folder' : 'untitled.contract'
    setInlineEdit({ mode, parentPath: folderPath, tempPath: `__inline__:${mode}:${folderPath}` })
    setInlineValue(defaultName)
    setFocusedPath(folderPath)
  }

  function beginRename(path) {
    const node = nodeMap[path]
    if (!node) return
    setInlineEdit({ mode: 'rename', targetPath: path })
    setInlineValue(node.name)
  }

  async function commitInlineEdit() {
    if (!inlineEdit) return
    const value = inlineValue.trim()
    if (!value) {
      setInlineEdit(null)
      return
    }

    if (inlineEdit.mode === 'rename') {
      await renamePath(inlineEdit.targetPath, value)
      setInlineEdit(null)
      return
    }

    const mode = inlineEdit.mode === 'folder' ? 'folder' : 'file'
    await createAt(mode, inlineEdit.parentPath, value)
    setInlineEdit(null)
  }

  function cancelInlineEdit() {
    setInlineEdit(null)
  }

  async function runDelete(targetPath) {
    const node = nodeMap[targetPath]
    if (!node) return
    const confirmed = window.confirm(`Delete ${node.name}?`)
    if (!confirmed) return
    await deletePath(targetPath)
  }

  async function handleKeyDown(event) {
    if (!projectRoot?.path) return
    if (inlineEdit && event.key !== 'Escape') return

    const currentRow = visibleRows[focusedIndex]
    const currentNode = currentRow ? nodeMap[currentRow.path] : null

    if (event.key === 'ArrowDown') {
      event.preventDefault()
      const nextIndex = Math.min(visibleRows.length - 1, Math.max(0, focusedIndex + 1))
      if (visibleRows[nextIndex]) setFocusedPath(visibleRows[nextIndex].path)
      return
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault()
      const nextIndex = Math.max(0, focusedIndex - 1)
      if (visibleRows[nextIndex]) setFocusedPath(visibleRows[nextIndex].path)
      return
    }

    if (event.key === 'ArrowLeft') {
      event.preventDefault()
      if (!currentNode) return
      if (currentNode.type === 'folder' && expandedPaths.has(currentNode.path)) {
        await toggleFolder(currentNode.path)
        return
      }
      if (currentNode.parentPath) {
        setFocusedPath(currentNode.parentPath)
      }
      return
    }

    if (event.key === 'ArrowRight') {
      event.preventDefault()
      if (!currentNode) return
      if (currentNode.type === 'folder') {
        if (!expandedPaths.has(currentNode.path)) {
          await toggleFolder(currentNode.path)
        } else {
          const child = currentNode.childPaths?.[0]
          if (child) setFocusedPath(child)
        }
      }
      return
    }

    if (event.key === 'Enter') {
      event.preventDefault()
      if (!currentNode) return
      if (currentNode.type === 'folder') {
        await toggleFolder(currentNode.path)
      } else {
        await openFile(currentNode.path)
      }
      return
    }

    if (event.key === 'F2') {
      event.preventDefault()
      if (!currentNode || currentNode.path === projectRoot.path) return
      beginRename(currentNode.path)
      return
    }

    if (event.key === 'Delete') {
      event.preventDefault()
      if (!currentNode || currentNode.path === projectRoot.path) return
      await runDelete(currentNode.path)
      return
    }

    if (event.key === 'Escape') {
      event.preventDefault()
      setInlineEdit(null)
      setContextMenu(null)
    }
  }

  function openContextMenu(event, node) {
    setContextMenu({ x: event.clientX, y: event.clientY, path: node.path })
  }

  function handleNodeFocus(path) {
    setFocusedPath(path)
  }

  async function handleRefresh() {
    if (!projectRoot?.path) return
    const node = nodeMap[focusedPath] || nodeMap[projectRoot.path]
    const folderPath = parentOrSelfFolder(node, projectRoot.path)
    await refreshFolder(folderPath)
  }

  function handleNewFile() {
    if (!projectRoot?.path) return
    const node = nodeMap[focusedPath] || nodeMap[projectRoot.path]
    beginCreate('file', parentOrSelfFolder(node, projectRoot.path))
  }

  function handleNewFolder() {
    if (!projectRoot?.path) return
    const node = nodeMap[focusedPath] || nodeMap[projectRoot.path]
    beginCreate('folder', parentOrSelfFolder(node, projectRoot.path))
  }

  if (!projectRoot) {
    return (
      <div className="explorer-empty-state">
        <p className="explorer-empty-title">No project open</p>
        <button type="button" className="explorer-action-button" onClick={handleOpenProjectClick}>
          Open Folder
        </button>
      </div>
    )
  }

  const menuNode = contextMenu?.path ? nodeMap[contextMenu.path] : null

  return (
    <div
      className="explorer-shell"
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="tree"
      aria-label="File Explorer"
    >
      <div className="explorer-header">
        <div className="explorer-title-row">
          <p className="explorer-title">Explorer</p>
          <span className="explorer-root-name" title={projectRoot.path}>
            {projectRoot.name}
          </span>
        </div>
        <div className="explorer-actions-row">
          <button type="button" className="explorer-action-button" onClick={handleNewFile}>
            New File
          </button>
          <button type="button" className="explorer-action-button" onClick={handleNewFolder}>
            New Folder
          </button>
          <button type="button" className="explorer-action-button" onClick={handleRefresh}>
            Refresh
          </button>
          <button type="button" className="explorer-action-button" onClick={collapseAll}>
            Collapse All
          </button>
        </div>
        <input
          className="explorer-filter"
          placeholder="Filter files"
          value={filterQuery}
          onChange={(event) => setFilterQuery(event.target.value)}
        />
      </div>

      <div
        ref={containerRef}
        className="explorer-tree"
        onScroll={(event) => setScrollTop(event.currentTarget.scrollTop)}
      >
        {rowsWithInline.length === 0 ? (
          <p className="explorer-empty-filter">No files match the current filter.</p>
        ) : (
          rowsWithInline.map((row) => {
            if (row.isInlineCreate) {
              const isFolder = inlineEdit?.mode === 'folder'
              const placeholderNode = {
                type: isFolder ? 'folder' : 'file',
                name: inlineValue,
                path: row.path,
                parentPath: inlineEdit.parentPath
              }

              return (
                <TreeNode
                  key={row.path}
                  node={placeholderNode}
                  depth={row.depth}
                  isExpanded={false}
                  isFocused
                  isOpen={false}
                  isEditing
                  editValue={inlineValue}
                  onEditChange={setInlineValue}
                  onEditCommit={commitInlineEdit}
                  onEditCancel={cancelInlineEdit}
                  onToggle={() => {}}
                  onOpen={() => {}}
                  onFocus={handleNodeFocus}
                  onContextMenu={() => {}}
                />
              )
            }

            const node = nodeMap[row.path]
            if (!node) return null
            const isEditing = inlineEdit?.mode === 'rename' && inlineEdit.targetPath === row.path

            return (
              <TreeNode
                key={row.path}
                node={node}
                depth={row.depth}
                isExpanded={expandedPaths.has(row.path)}
                isFocused={focusedPath === row.path}
                isOpen={selectedFilePath === row.path}
                isEditing={isEditing}
                editValue={isEditing ? inlineValue : node.name}
                onEditChange={setInlineValue}
                onEditCommit={commitInlineEdit}
                onEditCancel={cancelInlineEdit}
                onToggle={toggleFolder}
                onOpen={openFile}
                onFocus={handleNodeFocus}
                onContextMenu={openContextMenu}
              />
            )
          })
        )}
      </div>

      {contextMenu && menuNode ? (
        <div
          ref={contextMenuRef}
          className="explorer-context-menu"
          style={{ top: contextMenu.y, left: contextMenu.x }}
        >
          <button
            type="button"
            className="explorer-context-item"
            onClick={() => {
              const folderPath = parentOrSelfFolder(menuNode, projectRoot.path)
              beginCreate('file', folderPath)
              setContextMenu(null)
            }}
          >
            New File
          </button>
          <button
            type="button"
            className="explorer-context-item"
            onClick={() => {
              const folderPath = parentOrSelfFolder(menuNode, projectRoot.path)
              beginCreate('folder', folderPath)
              setContextMenu(null)
            }}
          >
            New Folder
          </button>
          {menuNode.path !== projectRoot.path ? (
            <button
              type="button"
              className="explorer-context-item"
              onClick={() => {
                beginRename(menuNode.path)
                setContextMenu(null)
              }}
            >
              Rename
            </button>
          ) : null}
          {menuNode.path !== projectRoot.path ? (
            <button
              type="button"
              className="explorer-context-item danger"
              onClick={async () => {
                await runDelete(menuNode.path)
                setContextMenu(null)
              }}
            >
              Delete
            </button>
          ) : null}
          <button
            type="button"
            className="explorer-context-item"
            onClick={async () => {
              const folderPath = parentOrSelfFolder(menuNode, projectRoot.path)
              await refreshFolder(folderPath)
              setContextMenu(null)
            }}
          >
            Refresh
          </button>
          <div className="explorer-context-foot">{fileNameFromPath(menuNode.path)}</div>
        </div>
      ) : null}
    </div>
  )
}

export default FileExplorerPane
