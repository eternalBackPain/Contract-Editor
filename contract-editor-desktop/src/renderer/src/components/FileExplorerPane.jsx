import { useEffect, useState } from 'react'

function FileExplorerPane({ onFileSelect }) {
  const [project, setProject] = useState(null)
  const [selectedFilePath, setSelectedFilePath] = useState('')

  useEffect(() => {
    if (!window.api?.onProjectSelected) return undefined
    const unsubscribe = window.api.onProjectSelected((projectTree) => {
      setProject(projectTree)
      setSelectedFilePath('')
    })
    return unsubscribe
  }, [])

  async function handleFileClick(node) {
    if (node.type !== 'file' || !window.api?.readTxtFile) return
    try {
      const content = await window.api.readTxtFile(node.path)
      setSelectedFilePath(node.path)
      if (onFileSelect) {
        onFileSelect(content, node)
      }
    } catch (error) {
      console.error('Failed to load file into editor:', error)
    }
  }

  function renderNode(node, depth) {
    const isFolder = node.type === 'folder'
    const isSelected = !isFolder && selectedFilePath === node.path

    return (
      <div key={node.path} className="min-w-0">
        <div
          className={`mx-1 flex min-w-0 items-center gap-2 rounded px-2 py-1 transition-colors ${
            isFolder
              ? 'text-stone-900 font-semibold'
              : isSelected
                ? 'cursor-pointer bg-stone-100 text-stone-900'
                : 'cursor-pointer text-stone-800 hover:bg-stone-300/70'
          }`}
          style={{ paddingLeft: 8 + depth * 14 }}
          onClick={isFolder ? undefined : () => handleFileClick(node)}
          title={node.name}
        >
          <span className="w-4 shrink-0 text-center text-xs text-stone-600">
            {isFolder ? '>' : '-'}
          </span>
          <span className="min-w-0 flex-1 truncate">{node.name}</span>
        </div>
        {isFolder && node.children?.length > 0
          ? node.children.map((child) => renderNode(child, depth + 1))
          : null}
      </div>
    )
  }

  if (!project) {
    return <p className="px-3 py-2 text-sm text-stone-700">Create a new project to get started!</p>
  }

  if (!project.children || project.children.length === 0) {
    return (
      <div className="px-3 py-2 text-sm text-stone-700">
        <p className="font-semibold text-stone-800">{project.name}</p>
        <p>No .txt files were found in this folder.</p>
      </div>
    )
  }

  return <div className="py-1 text-sm min-w-0">{renderNode(project, 0)}</div>
}

export default FileExplorerPane
