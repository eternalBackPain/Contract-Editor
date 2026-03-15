import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

const STORAGE_PREFIX = 'explorer-state:v1:'

function normalizePath(inputPath = '') {
  const slashPath = inputPath.replace(/\\/g, '/').replace(/\/+/g, '/')
  return slashPath.toLowerCase()
}

function fuzzyMatch(label, query) {
  if (!query) return true
  const a = label.toLowerCase()
  const b = query.toLowerCase()
  let i = 0
  let j = 0
  while (i < a.length && j < b.length) {
    if (a[i] === b[j]) j += 1
    i += 1
  }
  return j === b.length
}

function removeSubtree(nextMap, rootPath) {
  const node = nextMap[rootPath]
  if (!node) return
  if (node.type === 'folder' && Array.isArray(node.childPaths)) {
    for (const childPath of node.childPaths) {
      removeSubtree(nextMap, childPath)
    }
  }
  delete nextMap[rootPath]
}

function toStorageKey(rootPath) {
  return `${STORAGE_PREFIX}${normalizePath(rootPath)}`
}

function joinPath(parentPath, childName) {
  const separator = parentPath.includes('\\') ? '\\' : '/'
  return `${parentPath}${separator}${childName}`
}

function parentPathOf(path) {
  const normalized = path.replace(/\\/g, '/')
  const idx = normalized.lastIndexOf('/')
  if (idx <= 0) return ''
  const parent = normalized.slice(0, idx)
  return path.includes('\\') ? parent.replace(/\//g, '\\') : parent
}

function isSameOrChildPath(path, rootPath) {
  if (!path || !rootPath) return false
  return path === rootPath || path.startsWith(`${rootPath}\\`) || path.startsWith(`${rootPath}/`)
}

export function useExplorerState({ openFilePath = '', onOpenFile }) {
  const [projectRoot, setProjectRoot] = useState(null)
  const [nodeMap, setNodeMap] = useState({})
  const [expandedPaths, setExpandedPaths] = useState(() => new Set())
  const [focusedPath, setFocusedPath] = useState('')
  const [filterQuery, setFilterQuery] = useState('')
  const [scrollTop, setScrollTop] = useState(0)

  const nodeMapRef = useRef(nodeMap)
  const expandedPathsRef = useRef(expandedPaths)
  const focusedPathRef = useRef(focusedPath)

  useEffect(() => {
    nodeMapRef.current = nodeMap
  }, [nodeMap])

  useEffect(() => {
    expandedPathsRef.current = expandedPaths
  }, [expandedPaths])

  useEffect(() => {
    focusedPathRef.current = focusedPath
  }, [focusedPath])

  const loadChildren = useCallback(async (folderPath, { force = false } = {}) => {
    if (!window.api?.listChildren || !folderPath) return

    const folder = nodeMapRef.current[folderPath]
    if (!force && folder?.loaded) return

    const children = await window.api.listChildren(folderPath)

    setNodeMap((prev) => {
      const next = { ...prev }
      const parent = next[folderPath]
      if (!parent || parent.type !== 'folder') return prev

      const priorChildPaths = parent.childPaths || []
      const nextChildPaths = []

      for (const child of children) {
        const existing = next[child.path]
        next[child.path] = {
          ...existing,
          ...child,
          parentPath: folderPath,
          loaded: child.type === 'folder' ? Boolean(existing?.loaded) : false,
          childPaths: child.type === 'folder' ? existing?.childPaths || [] : []
        }
        nextChildPaths.push(child.path)
      }

      for (const oldChildPath of priorChildPaths) {
        if (!nextChildPaths.includes(oldChildPath)) {
          removeSubtree(next, oldChildPath)
        }
      }

      next[folderPath] = {
        ...parent,
        loaded: true,
        childPaths: nextChildPaths
      }

      return next
    })
  }, [])

  const openProject = useCallback(async () => {
    if (!window.api?.openProjectFolder) return

    const root = await window.api.openProjectFolder()
    if (!root) return

    setProjectRoot(root)
    setNodeMap({
      [root.path]: {
        ...root,
        parentPath: '',
        loaded: false,
        childPaths: []
      }
    })

    const persistedRaw = localStorage.getItem(toStorageKey(root.path))
    if (persistedRaw) {
      try {
        const persisted = JSON.parse(persistedRaw)
        setExpandedPaths(new Set(persisted.expandedPaths || [root.path]))
        setFocusedPath(persisted.focusedPath || root.path)
        setScrollTop(Number.isFinite(persisted.scrollTop) ? persisted.scrollTop : 0)
      } catch {
        setExpandedPaths(new Set([root.path]))
        setFocusedPath(root.path)
        setScrollTop(0)
      }
    } else {
      setExpandedPaths(new Set([root.path]))
      setFocusedPath(root.path)
      setScrollTop(0)
    }

    await loadChildren(root.path, { force: true })
  }, [loadChildren])

  const toggleFolder = useCallback(
    async (folderPath) => {
      const folder = nodeMapRef.current[folderPath]
      if (!folder || folder.type !== 'folder') return

      const wasExpanded = expandedPathsRef.current.has(folderPath)
      setExpandedPaths((prev) => {
        const next = new Set(prev)
        if (next.has(folderPath)) next.delete(folderPath)
        else next.add(folderPath)
        return next
      })

      if (!wasExpanded) {
        await loadChildren(folderPath)
      }
    },
    [loadChildren]
  )

  const collapseAll = useCallback(() => {
    if (!projectRoot?.path) return
    setExpandedPaths(new Set([projectRoot.path]))
    setFocusedPath(projectRoot.path)
  }, [projectRoot])

  const expandAll = useCallback(async () => {
    if (!projectRoot?.path) return

    const nextExpanded = new Set([projectRoot.path])
    const queue = [projectRoot.path]
    const visited = new Set()

    while (queue.length > 0) {
      const folderPath = queue.shift()
      if (!folderPath || visited.has(folderPath)) continue
      visited.add(folderPath)

      const folder = nodeMapRef.current[folderPath]
      if (!folder || folder.type !== 'folder') continue

      await loadChildren(folderPath)

      const refreshed = nodeMapRef.current[folderPath]
      for (const childPath of refreshed?.childPaths || []) {
        const childNode = nodeMapRef.current[childPath]
        if (childNode?.type === 'folder') {
          nextExpanded.add(childPath)
          queue.push(childPath)
        }
      }
    }

    setExpandedPaths(nextExpanded)
    setFocusedPath(projectRoot.path)
  }, [loadChildren, projectRoot])

  const refreshFolder = useCallback(
    async (folderPath) => {
      if (!folderPath) return
      await loadChildren(folderPath, { force: true })
    },
    [loadChildren]
  )

  const openFile = useCallback(
    async (filePath) => {
      if (!window.api?.readFile || !filePath) return
      const node = nodeMapRef.current[filePath]
      if (!node || node.type !== 'file') return
      const content = await window.api.readFile(filePath)
      if (onOpenFile) {
        onOpenFile(content, node)
      }
      setFocusedPath(filePath)
    },
    [onOpenFile]
  )

  const performOptimisticMutation = useCallback(async (applyMutation, invokeAction) => {
    const snapshotMap = nodeMapRef.current
    const snapshotExpanded = expandedPathsRef.current
    const snapshotFocused = focusedPathRef.current

    applyMutation()

    try {
      await invokeAction()
      return true
    } catch (error) {
      console.error('Explorer mutation failed:', error)
      setNodeMap(snapshotMap)
      setExpandedPaths(snapshotExpanded)
      setFocusedPath(snapshotFocused)
      return false
    }
  }, [])

  const createAt = useCallback(
    async (mode, parentPath, name) => {
      if (!parentPath || !name) return false
      const nextPath = joinPath(parentPath, name)
      const childType = mode === 'folder' ? 'folder' : 'file'

      const ok = await performOptimisticMutation(
        () => {
          setNodeMap((prev) => {
            const parent = prev[parentPath]
            if (!parent || parent.type !== 'folder') return prev
            const next = { ...prev }
            next[nextPath] = {
              type: childType,
              name,
              path: nextPath,
              parentPath,
              loaded: false,
              childPaths: []
            }
            const childPaths = [...(parent.childPaths || []), nextPath]
            childPaths.sort((a, b) => {
              const left = next[a]
              const right = next[b]
              if (left.type !== right.type) return left.type === 'folder' ? -1 : 1
              return left.name.localeCompare(right.name)
            })
            next[parentPath] = { ...parent, loaded: true, childPaths }
            return next
          })
          setExpandedPaths((prev) => new Set(prev).add(parentPath))
          setFocusedPath(nextPath)
        },
        async () => {
          if (mode === 'folder') {
            await window.api.createFolder(parentPath, name)
          } else {
            await window.api.createFile(parentPath, name)
          }
          await refreshFolder(parentPath)
        }
      )

      return ok
    },
    [performOptimisticMutation, refreshFolder]
  )

  const renamePath = useCallback(
    async (targetPath, nextName) => {
      if (!targetPath || !nextName) return false
      const parentPath = parentPathOf(targetPath)
      const nextPath = joinPath(parentPath, nextName)

      const ok = await performOptimisticMutation(
        () => {
          setNodeMap((prev) => {
            const node = prev[targetPath]
            if (!node) return prev

            const next = { ...prev }
            const pathMap = {}

            function rebase(path) {
              const oldNode = next[path]
              if (!oldNode) return

              const rebasedPath = path === targetPath ? nextPath : path.replace(targetPath, nextPath)
              pathMap[path] = rebasedPath

              const rebasedNode = {
                ...oldNode,
                path: rebasedPath,
                name: path === targetPath ? nextName : oldNode.name,
                parentPath:
                  oldNode.parentPath && oldNode.parentPath.startsWith(targetPath)
                    ? oldNode.parentPath.replace(targetPath, nextPath)
                    : oldNode.parentPath
              }

              next[rebasedPath] = rebasedNode

              if (oldNode.type === 'folder') {
                for (const childPath of oldNode.childPaths || []) {
                  rebase(childPath)
                }
                next[rebasedPath].childPaths = (oldNode.childPaths || []).map((child) =>
                  child.startsWith(targetPath) ? child.replace(targetPath, nextPath) : child
                )
              }
            }

            rebase(targetPath)

            for (const oldPath of Object.keys(pathMap)) {
              if (oldPath !== pathMap[oldPath]) {
                delete next[oldPath]
              }
            }

            const parent = next[parentPath]
            if (parent?.type === 'folder') {
              parent.childPaths = (parent.childPaths || []).map((path) =>
                path === targetPath ? nextPath : path
              )
              parent.childPaths.sort((a, b) => {
                const left = next[a]
                const right = next[b]
                if (left.type !== right.type) return left.type === 'folder' ? -1 : 1
                return left.name.localeCompare(right.name)
              })
            }

            return next
          })

          setExpandedPaths((prev) => {
            const next = new Set()
            for (const path of prev) {
              if (isSameOrChildPath(path, targetPath)) {
                next.add(path.replace(targetPath, nextPath))
              } else {
                next.add(path)
              }
            }
            return next
          })

          setFocusedPath((current) =>
            isSameOrChildPath(current, targetPath) ? current.replace(targetPath, nextPath) : current
          )
        },
        async () => {
          await window.api.renamePath(targetPath, nextName)
          await refreshFolder(parentPath)
        }
      )

      return ok
    },
    [performOptimisticMutation, refreshFolder]
  )

  const deletePath = useCallback(
    async (targetPath) => {
      if (!targetPath) return false
      const parentPath = parentPathOf(targetPath)

      const ok = await performOptimisticMutation(
        () => {
          setNodeMap((prev) => {
            const next = { ...prev }
            removeSubtree(next, targetPath)
            const parent = next[parentPath]
            if (parent?.type === 'folder') {
              parent.childPaths = (parent.childPaths || []).filter((childPath) => childPath !== targetPath)
            }
            return next
          })

          setExpandedPaths((prev) => {
            const next = new Set()
            for (const path of prev) {
              if (isSameOrChildPath(path, targetPath)) {
                continue
              }
              next.add(path)
            }
            return next
          })

          setFocusedPath((current) => {
            if (isSameOrChildPath(current, targetPath)) {
              return parentPath
            }
            return current
          })
        },
        async () => {
          await window.api.deletePath(targetPath)
          await refreshFolder(parentPath)
        }
      )

      return ok
    },
    [performOptimisticMutation, refreshFolder]
  )

  const revealPath = useCallback(
    async (targetPath) => {
      if (!projectRoot?.path || !targetPath) return
      const normalizedRoot = normalizePath(projectRoot.path)
      const normalizedTarget = normalizePath(targetPath)
      if (!normalizedTarget.startsWith(normalizedRoot)) return

      const rootParts = normalizePath(projectRoot.path).split('/')
      const targetParts = normalizePath(targetPath).split('/')
      const baseLen = rootParts.length

      let cursorPath = projectRoot.path
      setExpandedPaths((prev) => new Set(prev).add(cursorPath))
      await loadChildren(cursorPath)

      for (let i = baseLen; i < targetParts.length - 1; i += 1) {
        const segment = targetParts[i]
        const nextChild = (nodeMapRef.current[cursorPath]?.childPaths || []).find(
          (childPath) => normalizePath(nodeMapRef.current[childPath]?.name || '') === segment
        )
        if (!nextChild) break

        const node = nodeMapRef.current[nextChild]
        if (!node || node.type !== 'folder') break

        cursorPath = node.path
        setExpandedPaths((prev) => new Set(prev).add(cursorPath))
        await loadChildren(cursorPath)
      }

      setFocusedPath(targetPath)
    },
    [loadChildren, projectRoot]
  )

  useEffect(() => {
    if (!projectRoot?.path) return
    const key = toStorageKey(projectRoot.path)
    const payload = {
      expandedPaths: [...expandedPaths],
      focusedPath,
      scrollTop
    }
    localStorage.setItem(key, JSON.stringify(payload))
  }, [projectRoot, expandedPaths, focusedPath, scrollTop])

  useEffect(() => {
    if (!openFilePath) return
    void revealPath(openFilePath)
  }, [openFilePath, revealPath])

  useEffect(() => {
    if (!window.api?.watchProject) return undefined
    const unsubscribe = window.api.watchProject((event) => {
      if (!event?.path || !projectRoot?.path) return
      const parentPath = parentPathOf(event.path)
      if (!parentPath) return
      void refreshFolder(parentPath)
      if (event.type === 'deleted' && focusedPathRef.current === event.path) {
        setFocusedPath(parentPath)
      }
    })
    return unsubscribe
  }, [projectRoot, refreshFolder])

  const visibleRows = useMemo(() => {
    if (!projectRoot?.path || !nodeMap[projectRoot.path]) return []
    const query = filterQuery.trim().toLowerCase()
    const hasQuery = query.length > 0

    function walk(path, depth) {
      const node = nodeMap[path]
      if (!node) return { rows: [], matched: false }

      if (node.type === 'file') {
        const matched = !hasQuery || fuzzyMatch(node.name, query)
        return {
          rows: matched ? [{ path, depth }] : [],
          matched
        }
      }

      const childRows = []
      let anyChildMatched = false
      const shouldTraverse = hasQuery || expandedPaths.has(path)

      if (shouldTraverse) {
        for (const childPath of node.childPaths || []) {
          const result = walk(childPath, depth + 1)
          if (result.matched) anyChildMatched = true
          childRows.push(...result.rows)
        }
      }

      const selfMatched = !hasQuery || fuzzyMatch(node.name, query)
      const includeSelf = selfMatched || anyChildMatched

      return {
        rows: includeSelf ? [{ path, depth }, ...childRows] : [],
        matched: includeSelf
      }
    }

    return walk(projectRoot.path, 0).rows
  }, [expandedPaths, filterQuery, nodeMap, projectRoot])

  const focusedIndex = useMemo(
    () => visibleRows.findIndex((row) => row.path === focusedPath),
    [focusedPath, visibleRows]
  )

  return {
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
    expandAll,
    createAt,
    renamePath,
    deletePath,
    revealPath
  }
}
