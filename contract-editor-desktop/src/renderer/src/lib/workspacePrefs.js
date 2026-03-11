import { WORKSPACE_LAYOUT_STORAGE_KEY, WORKSPACE_THEME_METRICS } from './theme'

/**
 * @typedef {Object} WorkspaceLayoutPrefs
 * @property {number} explorerWidth
 * @property {number | null} editorWidth
 * @property {boolean} showExplorer
 * @property {boolean} showPreview
 */

/** @returns {WorkspaceLayoutPrefs} */
export function defaultWorkspaceLayoutPrefs() {
  return {
    explorerWidth: WORKSPACE_THEME_METRICS.defaultExplorerWidth,
    editorWidth: null,
    showExplorer: true,
    showPreview: true
  }
}

function toNumberOrNull(value) {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  return null
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}

/** @param {Partial<WorkspaceLayoutPrefs>} incoming */
export function sanitizeWorkspaceLayoutPrefs(incoming = {}) {
  const defaults = defaultWorkspaceLayoutPrefs()
  const explorerWidth =
    typeof incoming.explorerWidth === 'number' && Number.isFinite(incoming.explorerWidth)
      ? clamp(
          incoming.explorerWidth,
          WORKSPACE_THEME_METRICS.minExplorerWidth,
          WORKSPACE_THEME_METRICS.maxExplorerWidth
        )
      : defaults.explorerWidth

  return {
    explorerWidth,
    editorWidth: toNumberOrNull(incoming.editorWidth),
    showExplorer:
      typeof incoming.showExplorer === 'boolean' ? incoming.showExplorer : defaults.showExplorer,
    showPreview:
      typeof incoming.showPreview === 'boolean' ? incoming.showPreview : defaults.showPreview
  }
}

/** @returns {WorkspaceLayoutPrefs} */
export function loadWorkspaceLayoutPrefs() {
  try {
    const raw = window.localStorage.getItem(WORKSPACE_LAYOUT_STORAGE_KEY)
    if (!raw) return defaultWorkspaceLayoutPrefs()
    const parsed = JSON.parse(raw)
    return sanitizeWorkspaceLayoutPrefs(parsed)
  } catch {
    return defaultWorkspaceLayoutPrefs()
  }
}

/** @param {WorkspaceLayoutPrefs} prefs */
export function saveWorkspaceLayoutPrefs(prefs) {
  try {
    const cleanPrefs = sanitizeWorkspaceLayoutPrefs(prefs)
    window.localStorage.setItem(WORKSPACE_LAYOUT_STORAGE_KEY, JSON.stringify(cleanPrefs))
  } catch {
    // Ignore storage errors and continue with in-memory state.
  }
}
