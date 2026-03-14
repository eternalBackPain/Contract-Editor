const XML_TAG_TO_HTML_SELECTOR = Object.freeze({
  Block: 'section',
  HeadingLevel1: 'h1',
  HeadingLevel2: 'h2',
  HeadingLevel3: 'h3',
  HeadingLevel4: 'h4',
  Paragraph: 'p'
})

export const DEFAULT_STYLE_PROFILE = Object.freeze({
  meta: {
    id: 'default',
    name: 'Default Contract Style',
    version: '1.0.0'
  },
  tokens: {
    'font.body': 'Arial',
    'font.heading': 'Arial',
    'color.text': '#1f2937',
    'size.body': '13px',
    'size.h1': '14px',
    'line.body': '1.35',
    'indent.base': '2.5rem'
  },
  document: {
    css: {
      'counter-reset': 'h1',
      'font-family': '{font.body}',
      'font-size': '{size.body}',
      'line-height': '{line.body}',
      color: '{color.text}'
    }
  },
  blocks: {
    section: {
      css: {
        margin: '0'
      }
    },
    heading1: {
      css: {
        'font-family': '{font.heading}',
        'font-size': '{size.h1}',
        'line-height': '{line.body}',
        'font-weight': 700,
        margin: '0 0 4px',
        'counter-increment': 'h1',
        'counter-reset': 'h2'
      },
      before: {
        content: 'counter(h1) ". "',
        display: 'inline-block',
        width: '{indent.base}'
      }
    },
    heading2: {
      css: {
        'font-family': '{font.heading}',
        'font-size': '{size.body}',
        'line-height': '{line.body}',
        margin: '0 0 4px',
        'margin-left': '5rem',
        'counter-increment': 'h2',
        'counter-reset': 'h3'
      },
      before: {
        content: '"(" counter(h2, lower-alpha) ") "',
        display: 'inline-block',
        width: '{indent.base}',
        'margin-left': 'calc(-1 * {indent.base})'
      }
    },
    heading3: {
      css: {
        'font-family': '{font.heading}',
        'font-size': '{size.body}',
        'line-height': '{line.body}',
        margin: '0 0 4px',
        'margin-left': '7.5rem',
        'counter-increment': 'h3',
        'counter-reset': 'h4'
      },
      before: {
        content: '"(" counter(h3, lower-roman) ") "',
        display: 'inline-block',
        width: '{indent.base}',
        'margin-left': 'calc(-1 * {indent.base})'
      }
    },
    heading4: {
      css: {
        'font-family': '{font.heading}',
        'font-size': '{size.body}',
        'line-height': '{line.body}',
        margin: '0 0 4px',
        'margin-left': '10rem',
        'counter-increment': 'h4'
      },
      before: {
        content: '"(" counter(h4, lower-roman) ") "',
        display: 'inline-block',
        width: '{indent.base}',
        'margin-left': 'calc(-1 * {indent.base})'
      }
    },
    paragraph: {
      css: {
        'font-family': '{font.body}',
        'font-size': '{size.body}',
        'line-height': '{line.body}',
        margin: '0 0 4px',
        color: '{color.text}',
        'margin-left': '{indent.base}'
      }
    }
  },
  mappings: {
    Block: 'section',
    HeadingLevel1: 'heading1',
    HeadingLevel2: 'heading2',
    HeadingLevel3: 'heading3',
    HeadingLevel4: 'heading4',
    Paragraph: 'paragraph'
  }
})

const STYLE_DIAGNOSTIC_CODE = 'W_STYLE_PROFILE'

function isPlainObject(value) {
  return !!value && typeof value === 'object' && !Array.isArray(value)
}

function typeLabel(value) {
  if (Array.isArray(value)) return 'array'
  return typeof value
}

function clone(value) {
  if (Array.isArray(value)) {
    return value.map((item) => clone(item))
  }
  if (isPlainObject(value)) {
    const out = {}
    for (const [key, entry] of Object.entries(value)) {
      out[key] = clone(entry)
    }
    return out
  }
  return value
}

function mergeWithDefault(defaultValue, overrideValue) {
  if (Array.isArray(defaultValue)) {
    return Array.isArray(overrideValue) ? clone(overrideValue) : clone(defaultValue)
  }

  if (isPlainObject(defaultValue)) {
    const out = {}
    const source = isPlainObject(overrideValue) ? overrideValue : {}
    for (const [key, entry] of Object.entries(defaultValue)) {
      out[key] = mergeWithDefault(entry, source[key])
    }
    return out
  }

  if (overrideValue === undefined) return defaultValue
  if (typeof overrideValue === typeof defaultValue) return overrideValue
  return defaultValue
}

function makeDiagnostic(message) {
  return {
    code: STYLE_DIAGNOSTIC_CODE,
    message,
    severity: 'warning',
    line: 0,
    column: 0
  }
}

function collectValidationDiagnostics(defaultNode, candidateNode, path, diagnostics) {
  if (candidateNode === undefined) return

  const currentPath = path || 'root'
  if (!isPlainObject(defaultNode)) {
    if (typeof candidateNode !== typeof defaultNode) {
      diagnostics.push(
        makeDiagnostic(
          `${currentPath} expected ${typeLabel(defaultNode)} but received ${typeLabel(candidateNode)}`
        )
      )
    }
    return
  }

  if (!isPlainObject(candidateNode)) {
    diagnostics.push(
      makeDiagnostic(`${currentPath} expected object but received ${typeLabel(candidateNode)}`)
    )
    return
  }

  for (const key of Object.keys(candidateNode)) {
    if (!(key in defaultNode)) {
      diagnostics.push(makeDiagnostic(`${currentPath}.${key} is not supported and will be ignored`))
    }
  }

  for (const [key, defaultEntry] of Object.entries(defaultNode)) {
    collectValidationDiagnostics(
      defaultEntry,
      candidateNode[key],
      currentPath === 'root' ? key : `${currentPath}.${key}`,
      diagnostics
    )
  }
}

function resolveTokenValue(value, tokens) {
  if (typeof value !== 'string') return value
  return value.replace(/\{([^}]+)\}/g, (_, tokenKey) => tokens[tokenKey] ?? '')
}

function cssObjectToText(cssObj, tokens) {
  const body = Object.entries(cssObj || {})
    .map(([property, value]) => `${property}:${resolveTokenValue(value, tokens)};`)
    .join('')

  return body
}

function pushCssRule(rules, selector, cssObj, tokens) {
  const cssBody = cssObjectToText(cssObj, tokens)
  if (cssBody) {
    rules.push(`${selector}{${cssBody}}`)
  }
}

function xmlTagToHtmlSelector(xmlTag) {
  return XML_TAG_TO_HTML_SELECTOR[xmlTag] || `[data-xml-tag="${xmlTag}"]`
}

export function getDefaultStyleProfile() {
  return clone(DEFAULT_STYLE_PROFILE)
}

export function validateStyleProfile(profile) {
  if (profile === null || profile === undefined) return []
  const diagnostics = []
  collectValidationDiagnostics(DEFAULT_STYLE_PROFILE, profile, 'root', diagnostics)
  return diagnostics
}

export function resolveStyleProfile(profileOverride) {
  return mergeWithDefault(DEFAULT_STYLE_PROFILE, profileOverride)
}

export function styleProfileToCss(profileLike) {
  const profile = resolveStyleProfile(profileLike)
  const tokens = profile.tokens || {}
  const blocks = profile.blocks || {}
  const mappings = profile.mappings || {}
  const rules = []

  pushCssRule(rules, '.output-pane', profile.document?.css, tokens)
  pushCssRule(rules, '.output-pane::before', profile.document?.before, tokens)
  pushCssRule(rules, '.output-pane::after', profile.document?.after, tokens)

  for (const [xmlTag, blockName] of Object.entries(mappings)) {
    const selector = xmlTagToHtmlSelector(xmlTag)
    const block = blocks[blockName] || {}
    pushCssRule(rules, `.output-pane ${selector}`, block.css, tokens)
    pushCssRule(rules, `.output-pane ${selector}::before`, block.before, tokens)
    pushCssRule(rules, `.output-pane ${selector}::after`, block.after, tokens)
  }

  return rules.join('\n')
}
