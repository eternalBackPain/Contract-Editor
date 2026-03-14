import test from 'node:test'
import assert from 'node:assert/strict'
import {
  compile,
  DiagnosticCodes,
  renderHtml,
  styleProfileToCss,
  toXml,
  validate,
  validateStyleProfile
} from '../src/index.js'

const VALID_SOURCE = `@begin{GeneralConditions}
# No guarantee of work or exclusivity
The Contract Authority is not bound.
## bound to issue any Order Proposal;
@end{GeneralConditions}`

test('valid source compiles to xml', () => {
  const result = compile(VALID_SOURCE, 'xml')
  assert.equal(result.success, true)
  assert.equal(result.diagnostics.length, 0)
  assert.match(result.output, /<document>/)
  assert.match(result.output, /<HeadingLevel1>No guarantee of work or exclusivity<\/HeadingLevel1>/)
})

test('valid source compiles to html', () => {
  const result = compile(VALID_SOURCE, 'html')
  assert.equal(result.success, true)
  assert.equal(result.diagnostics.length, 0)
  assert.match(result.output, /<html/i)
  assert.match(result.output, /<h1>No guarantee of work or exclusivity<\/h1>/)
})

test('compile html embeds default css when includeCss is enabled', () => {
  const result = compile(VALID_SOURCE, 'html', { includeCss: true })
  assert.equal(result.success, true)
  assert.match(result.output, /<style>/)
  assert.match(result.output, /\.output-pane h1\{/)
})

test('custom style profile override updates generated css', () => {
  const result = compile(VALID_SOURCE, 'html', {
    includeCss: true,
    styleProfile: {
      tokens: {
        'font.body': 'Times New Roman'
      }
    }
  })
  assert.equal(result.success, true)
  assert.match(result.output, /Times New Roman/)
})

test('invalid style profile emits warning diagnostics and falls back', () => {
  const result = compile(VALID_SOURCE, 'html', {
    includeCss: true,
    styleProfile: {
      tokens: 'invalid'
    }
  })
  assert.equal(result.success, true)
  assert.ok(result.diagnostics.some((d) => d.code === DiagnosticCodes.STYLE_PROFILE))
  assert.match(result.output, /font-family:Arial/)
})

test('renderHtml helper proxies compile with options', () => {
  const result = renderHtml(VALID_SOURCE, { includeCss: true })
  assert.equal(result.success, true)
  assert.match(result.output, /<html/i)
  assert.match(result.output, /<style>/)
})

test('validateStyleProfile reports unsupported keys', () => {
  const diagnostics = validateStyleProfile({
    tokens: {
      unknownToken: 'value'
    }
  })
  assert.ok(diagnostics.length > 0)
})

test('styleProfileToCss renders supported selectors', () => {
  const css = styleProfileToCss({})
  assert.match(css, /\.output-pane h2\{/)
  assert.match(css, /\.output-pane p\{/)
})

test('invalid syntax returns syntax diagnostics', () => {
  const invalid = `@begin{One}\n# heading\n@end{Two`
  const result = validate(invalid)
  assert.equal(result.valid, false)
  assert.ok(result.diagnostics.some((d) => d.code === DiagnosticCodes.SYNTAX))
})

test('mismatched block names return structural diagnostic', () => {
  const invalid = `@begin{One}\n# heading\n@end{Two}`
  const result = validate(invalid)
  assert.equal(result.valid, false)
  assert.ok(result.diagnostics.some((d) => d.code === DiagnosticCodes.BLOCK_NAME_MISMATCH))
})

test('xml escaping is applied', () => {
  const source = `@begin{Escaping}\n# Title\nA < B & C > D\n@end{Escaping}`
  const result = toXml(source)
  assert.equal(result.diagnostics.length, 0)
  assert.match(result.xml, /A &lt; B &amp; C &gt; D/)
})
