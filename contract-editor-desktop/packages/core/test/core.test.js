import test from 'node:test'
import assert from 'node:assert/strict'
import { compile, toXml, validate, DiagnosticCodes } from '../src/index.js'

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
