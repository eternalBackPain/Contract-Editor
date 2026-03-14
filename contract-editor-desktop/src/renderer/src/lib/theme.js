/**
 * @typedef {Object} WorkspaceThemeMetrics
 * @property {number} defaultExplorerWidth
 * @property {number} minExplorerWidth
 * @property {number} maxExplorerWidth
 * @property {number} minPaneWidth
 */

/** @type {Readonly<WorkspaceThemeMetrics>} */
export const WORKSPACE_THEME_METRICS = Object.freeze({
  defaultExplorerWidth: 260,
  minExplorerWidth: 190,
  maxExplorerWidth: 460,
  minPaneWidth: 280
})

export const WORKSPACE_LAYOUT_STORAGE_KEY = 'workspace-layout:v1'
export const WORKSPACE_STYLE_STORAGE_KEY = 'workspace-style:v1'
