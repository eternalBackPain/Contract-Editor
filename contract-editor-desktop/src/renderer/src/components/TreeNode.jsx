import { memo } from 'react'

function Chevron({ expanded, visible }) {
  return (
    <span className="explorer-chevron" aria-hidden="true">
      {visible ? (expanded ? 'v' : '>') : ''}
    </span>
  )
}

function FolderIcon({ expanded }) {
  return (
    <svg viewBox="0 0 16 16" className="explorer-icon" aria-hidden="true">
      <path
        d={expanded ? 'M1.5 4.5h13v8h-13z M1.5 3h5l1 1h7v1.5h-13z' : 'M1.5 3h5l1 1h7v8.5h-13z'}
        fill="currentColor"
      />
    </svg>
  )
}

function FileIcon() {
  return (
    <svg viewBox="0 0 16 16" className="explorer-icon" aria-hidden="true">
      <path d="M3 1.5h6l4 4v9H3z M8.8 1.5V5.5H13" fill="none" stroke="currentColor" />
    </svg>
  )
}

function TreeNode({
  node,
  depth,
  isExpanded,
  isFocused,
  isOpen,
  isEditing,
  editValue,
  onEditChange,
  onEditCommit,
  onEditCancel,
  onToggle,
  onOpen,
  onFocus,
  onContextMenu
}) {
  const isFolder = node.type === 'folder'

  function handleClick(event) {
    if (isEditing) return
    onFocus(node.path)
    if (isFolder) {
      onToggle(node.path)
    } else {
      onOpen(node.path)
    }

    event.stopPropagation()
  }

  function handleDoubleClick(event) {
    if (isEditing) return
    if (isFolder && !isExpanded) {
      onToggle(node.path)
    }
    if (!isFolder) {
      onOpen(node.path)
    }
    event.stopPropagation()
  }

  function handleContextMenu(event) {
    event.preventDefault()
    onFocus(node.path)
    onContextMenu(event, node)
  }

  return (
    <div
      className={`explorer-row ${isFocused ? 'is-focused' : ''} ${isOpen ? 'is-open' : ''}`}
      style={{ paddingLeft: 8 + depth * 14 }}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onContextMenu={handleContextMenu}
      title={node.name}
      role="treeitem"
      aria-selected={isFocused}
      aria-expanded={isFolder ? isExpanded : undefined}
      data-path={node.path}
      tabIndex={-1}
    >
      <Chevron expanded={isExpanded} visible={isFolder} />
      {isFolder ? <FolderIcon expanded={isExpanded} /> : <FileIcon />}
      {isEditing ? (
        <input
          autoFocus
          value={editValue}
          onChange={(event) => onEditChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault()
              onEditCommit()
            }
            if (event.key === 'Escape') {
              event.preventDefault()
              onEditCancel()
            }
          }}
          onBlur={onEditCommit}
          className="explorer-inline-input"
        />
      ) : (
        <span className="explorer-label">{node.name}</span>
      )}
    </div>
  )
}

export default memo(TreeNode)
