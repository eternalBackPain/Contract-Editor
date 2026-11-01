import test from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, readFileSync, rmSync, writeFileSync, mkdirSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { createExampleFile } from '../src/main/example-file.mjs'
import { EXAMPLE_DRAFT } from '../src/shared/example-draft.mjs'

test('folder example creates persisted source without overwriting existing entries', () => {
  const root = mkdtempSync(join(tmpdir(), 'contract-example-'))
  try {
    const first = createExampleFile(root)
    assert.equal(first.path, join(root, 'example.contract'))
    assert.equal(first.content, EXAMPLE_DRAFT)
    assert.equal(readFileSync(first.path, 'utf8'), EXAMPLE_DRAFT)
    writeFileSync(first.path, 'keep existing')
    mkdirSync(join(root, 'example-1.contract'))
    const next = createExampleFile(root)
    assert.equal(next.path, join(root, 'example-2.contract'))
    assert.equal(readFileSync(first.path, 'utf8'), 'keep existing')
    assert.equal(readFileSync(next.path, 'utf8'), EXAMPLE_DRAFT)
    assert.throws(() => createExampleFile(join(root, 'missing')), /Could not create example/)
  } finally {
    rmSync(root, { recursive: true, force: true })
  }
})
