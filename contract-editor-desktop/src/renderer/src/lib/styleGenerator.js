export function compileStyles(styleJson) {
  const tokens = styleJson?.tokens || {}
  const elements = styleJson?.elements || {}
  const root = styleJson?.root || {}

  const cssRules = []

  const resolve = (value) => {
    if (typeof value !== 'string') return value
    return value.replace(/\{tokens\.([^\}]+)\}/g, (_, key) => tokens[key] ?? '')
  }

  const pushRule = (selector, cssObj) => {
    const cssBody = Object.entries(cssObj || {})
      .map(([k, v]) => `${k}:${resolve(v)};`)
      .join('')
    if (cssBody) cssRules.push(`${selector}{${cssBody}}`)
  }

  pushRule('.output-pane', root.css)
  pushRule('.output-pane::before', root.before)
  pushRule('.output-pane::after', root.after)

  for (const [xmlTag, def] of Object.entries(elements)) {
    const tag = mapTag(xmlTag)
    pushRule(`.output-pane ${tag}`, def?.css)
    pushRule(`.output-pane ${tag}::before`, def?.before)
    pushRule(`.output-pane ${tag}::after`, def?.after)
  }

  return {
    cssText: cssRules.join('\n'),
  }
}

function mapTag(xmlTag) {
  if (xmlTag === 'HeadingLevel1') return 'h1'
  if (xmlTag === 'HeadingLevel2') return 'h2'
  if (xmlTag === 'HeadingLevel3') return 'h3'
  if (xmlTag === 'HeadingLevel4') return 'h4'
  if (xmlTag === 'Paragraph') return 'p'
  return `[data-xml-tag="${xmlTag}"]`
}
