import antlr4 from 'antlr4'
import ContractsLexer from './formal-grammar/ContractsLexer.js'
import ContractsParser from './formal-grammar/ContractsParser.js'
import ContractsParserListener from './formal-grammar/ContractsParserListener.js'
import {
  getDefaultStyleProfile,
  resolveStyleProfile,
  styleProfileToCss,
  validateStyleProfile
} from './style-profile.js'

export const DiagnosticCodes = {
  SYNTAX: 'E_SYNTAX',
  BLOCK_NAME_MISMATCH: 'E_BLOCK_NAME_MISMATCH',
  STYLE_PROFILE: 'W_STYLE_PROFILE'
}

function normalizeMessage(message) {
  if (typeof message === 'string') return message
  if (message instanceof Error) return message.message
  return String(message)
}

class SyntaxCollector {
  constructor(diagnostics) {
    this.diagnostics = diagnostics
  }

  syntaxError(_recognizer, _offendingSymbol, line, column, msg) {
    this.diagnostics.push({
      code: DiagnosticCodes.SYNTAX,
      message: normalizeMessage(msg),
      severity: 'error',
      line: Number.isFinite(line) ? line : 0,
      column: Number.isFinite(column) ? column : 0
    })
  }

  reportAmbiguity() {}
  reportAttemptingFullContext() {}
  reportContextSensitivity() {}
}

function escapeXml(value) {
  if (typeof value !== 'string') return ''
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function plainHeadingText(heading, level) {
  if (typeof heading !== 'string') return ''
  return heading.replace(new RegExp(`^#{${level}}\\s?`), '')
}

function structuralDiagnostics(tree) {
  const diagnostics = []

  class ValidatorListener extends ContractsParserListener {
    enterBlock(ctx) {
      const openName = ctx.block_name(0)?.getText() || ''
      const closeName = ctx.block_name(1)?.getText() || ''
      if (openName !== closeName) {
        diagnostics.push({
          code: DiagnosticCodes.BLOCK_NAME_MISMATCH,
          message: `Block start '{${openName}}' does not match end '{${closeName}}'`,
          severity: 'error',
          line: ctx.start?.line || 0,
          column: ctx.start?.column || 0
        })
      }
    }
  }

  const listener = new ValidatorListener()
  antlr4.tree.ParseTreeWalker.DEFAULT.walk(listener, tree)
  return diagnostics
}

export function parse(source) {
  const diagnostics = []
  const input = typeof source === 'string' ? source : ''

  const chars = new antlr4.InputStream(input)
  const lexer = new ContractsLexer(chars)
  lexer.removeErrorListeners()
  lexer.addErrorListener(new SyntaxCollector(diagnostics))

  const tokens = new antlr4.CommonTokenStream(lexer)
  const parser = new ContractsParser(tokens)
  parser.removeErrorListeners()
  parser.addErrorListener(new SyntaxCollector(diagnostics))

  let tree = null
  try {
    tree = parser.start()
  } catch (error) {
    diagnostics.push({
      code: DiagnosticCodes.SYNTAX,
      message: normalizeMessage(error),
      severity: 'error',
      line: 0,
      column: 0
    })
  }

  return {
    tree,
    diagnostics
  }
}

export function validate(source) {
  const parsed = parse(source)
  const diagnostics = [...parsed.diagnostics]

  if (parsed.tree) {
    diagnostics.push(...structuralDiagnostics(parsed.tree))
  }

  return {
    valid: diagnostics.length === 0,
    diagnostics
  }
}

export function toXml(source) {
  const parsed = parse(source)
  const diagnostics = [...parsed.diagnostics]

  if (parsed.tree) {
    diagnostics.push(...structuralDiagnostics(parsed.tree))
  }

  if (!parsed.tree || diagnostics.length > 0) {
    return {
      xml: '',
      diagnostics
    }
  }

  class XmlListener extends ContractsParserListener {
    constructor() {
      super()
      this.output = []
      this.inHeadingBodyDepth = 0
    }

    enterBlock() {
      this.output.push('<Block>')
    }

    exitBlock() {
      this.output.push('</Block>')
    }

    enterHeading1(ctx) {
      const heading = ctx.getChild(0).getText()
      this.output.push(`<HeadingLevel1>${escapeXml(plainHeadingText(heading, 1))}</HeadingLevel1>`)
    }

    enterHeading2(ctx) {
      const heading = ctx.getChild(0).getText()
      this.output.push(`<HeadingLevel2>${escapeXml(plainHeadingText(heading, 2))}</HeadingLevel2>`)
    }

    enterHeading3(ctx) {
      const heading = ctx.getChild(0).getText()
      this.output.push(`<HeadingLevel3>${escapeXml(plainHeadingText(heading, 3))}</HeadingLevel3>`)
    }

    enterHeading4(ctx) {
      const heading = ctx.getChild(0).getText()
      this.output.push(`<HeadingLevel4>${escapeXml(plainHeadingText(heading, 4))}</HeadingLevel4>`)
    }

    enterHeading_body() {
      this.inHeadingBodyDepth += 1
      this.output.push('<Paragraph>')
    }

    exitHeading_body(ctx) {
      this.output.push(`${escapeXml(ctx.getText())}</Paragraph>`)
      this.inHeadingBodyDepth = Math.max(0, this.inHeadingBodyDepth - 1)
    }

    enterBody(ctx) {
      if (this.inHeadingBodyDepth > 0) return
      this.output.push(`<Paragraph>${escapeXml(ctx.getText())}</Paragraph>`)
    }
  }

  const listener = new XmlListener()
  antlr4.tree.ParseTreeWalker.DEFAULT.walk(listener, parsed.tree)

  return {
    xml: `<?xml version="1.0" encoding="UTF-8"?>\n<document>${listener.output.join('')}</document>`,
    diagnostics
  }
}

export function toHtmlFromXml(xml) {
  if (!xml || typeof xml !== 'string') return ''

  const body = xml
    .replace(/^\s*<\?xml[^>]*>\s*/i, '')
    .replace(/^<document>/i, '')
    .replace(/<\/document>\s*$/i, '')
    .replace(/<Block>/g, '<section>')
    .replace(/<\/Block>/g, '</section>')
    .replace(/<HeadingLevel1>/g, '<h1>')
    .replace(/<\/HeadingLevel1>/g, '</h1>')
    .replace(/<HeadingLevel2>/g, '<h2>')
    .replace(/<\/HeadingLevel2>/g, '</h2>')
    .replace(/<HeadingLevel3>/g, '<h3>')
    .replace(/<\/HeadingLevel3>/g, '</h3>')
    .replace(/<HeadingLevel4>/g, '<h4>')
    .replace(/<\/HeadingLevel4>/g, '</h4>')
    .replace(/<Paragraph>/g, '<p>')
    .replace(/<\/Paragraph>/g, '</p>')

  return [
    '<html>',
    '<head>',
    '<meta charset="utf-8"/>',
    '<title>Preview</title>',
    '</head>',
    '<body>',
    '<main>',
    body,
    '</main>',
    '</body>',
    '</html>'
  ].join('')
}

function normalizeCompileOptions(options) {
  if (!options || typeof options !== 'object') {
    return {
      styleProfile: undefined,
      includeCss: false
    }
  }

  return {
    styleProfile:
      options.styleProfile && typeof options.styleProfile === 'object' ? options.styleProfile : undefined,
    includeCss: options.includeCss === true
  }
}

function injectCssIntoHtml(html, cssText) {
  if (!cssText) return html
  if (!html.includes('</head>')) return html
  return html.replace('</head>', `<style>${cssText}</style></head>`)
}

export function renderHtml(source, options) {
  return compile(source, 'html', options)
}

export {
  getDefaultStyleProfile,
  resolveStyleProfile,
  styleProfileToCss,
  validateStyleProfile
}

export function compile(source, target, options) {
  if (target !== 'xml' && target !== 'html') {
    throw new Error(`Unsupported compile target: ${target}`)
  }

  const normalizedOptions = normalizeCompileOptions(options)
  const styleDiagnostics = validateStyleProfile(normalizedOptions.styleProfile).map((diagnostic) => ({
    ...diagnostic,
    code: DiagnosticCodes.STYLE_PROFILE
  }))
  const resolvedStyleProfile = resolveStyleProfile(normalizedOptions.styleProfile)

  const xmlResult = toXml(source)
  if (xmlResult.diagnostics.length > 0 || !xmlResult.xml) {
    return {
      success: false,
      target,
      output: '',
      diagnostics: [...xmlResult.diagnostics, ...styleDiagnostics]
    }
  }

  if (target === 'xml') {
    return {
      success: true,
      target,
      output: xmlResult.xml,
      diagnostics: styleDiagnostics
    }
  }

  const html = toHtmlFromXml(xmlResult.xml)
  const output = normalizedOptions.includeCss
    ? injectCssIntoHtml(html, styleProfileToCss(resolvedStyleProfile))
    : html

  return {
    success: true,
    target,
    output,
    diagnostics: styleDiagnostics
  }
}
