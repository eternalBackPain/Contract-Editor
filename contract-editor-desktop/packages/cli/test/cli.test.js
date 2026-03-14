import test from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const CLI_PATH = fileURLToPath(new URL('../bin/contractc.js', import.meta.url))

function runCli(args) {
  return spawnSync(process.execPath, [CLI_PATH, ...args], {
    encoding: 'utf-8'
  })
}

function writeFixture(dir, name, content) {
  const path = join(dir, name)
  writeFileSync(path, content, 'utf-8')
  return path
}

const VALID_SOURCE = `@begin{GeneralConditions}
# Heading
Body text.
@end{GeneralConditions}`

test('validate exits 0 on valid input', () => {
  const dir = mkdtempSync(join(tmpdir(), 'contractc-'))
  try {
    const input = writeFixture(dir, 'valid.contract', VALID_SOURCE)
    const run = runCli(['validate', input])
    assert.equal(run.status, 0)
    assert.match(run.stdout, /Valid\./)
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
})

test('validate exits 1 on invalid input', () => {
  const dir = mkdtempSync(join(tmpdir(), 'contractc-'))
  try {
    const input = writeFixture(dir, 'invalid.contract', '@begin{A}\n# bad\n@end{B}')
    const run = runCli(['validate', input])
    assert.equal(run.status, 1)
    assert.match(run.stderr, /E_BLOCK_NAME_MISMATCH/)
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
})

test('compile supports .txt and writes output file', () => {
  const dir = mkdtempSync(join(tmpdir(), 'contractc-'))
  try {
    const input = writeFixture(dir, 'input.txt', VALID_SOURCE)
    const out = join(dir, 'output.html')
    const run = runCli(['compile', input, '--to', 'html', '--out', out])
    assert.equal(run.status, 0)
    const html = readFileSync(out, 'utf-8')
    assert.match(html, /<html/i)
    assert.match(html, /<h1>Heading<\/h1>/)
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
})
