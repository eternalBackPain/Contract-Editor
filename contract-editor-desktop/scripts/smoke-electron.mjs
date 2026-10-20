#!/usr/bin/env node
import assert from 'node:assert/strict'
import { mkdtemp, mkdir, writeFile, readFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { _electron as playwrightElectron } from 'playwright-core'
import electronPath from 'electron'

const SMOKE_SOURCE = `@begin{Smoke}
# Smoke Title
Smoke body paragraph.
@end{Smoke}`

function modifierKey() {
  return process.platform === 'darwin' ? 'Meta' : 'Control'
}

async function run() {
  const fixture = await mkdtemp(join(tmpdir(), 'contract-editor-smoke-'))
  await writeFile(join(fixture, 'first.contract'), SMOKE_SOURCE)
  await writeFile(join(fixture, 'second.txt'), '@begin{Second}\n# Second draft\n@end{Second}')
  await mkdir(join(fixture, 'nested'))
  await writeFile(join(fixture, 'nested', 'hidden.contract'), SMOKE_SOURCE)
  const app = await playwrightElectron.launch({
    executablePath: electronPath,
    args: ['.']
  })

  try {
    const window = await app.firstWindow()
    await window.waitForSelector('.workspace-shell', { timeout: 15000 })

    const initialPreviewHeading = window.locator('.output-document h1').first()
    await initialPreviewHeading.waitFor({ timeout: 15000 })

    const initialText = (await initialPreviewHeading.textContent())?.trim()
    assert.ok(initialText && initialText.length > 0, 'Initial preview heading should render')

    const editorSurface = window.locator('.monaco-editor .view-lines').first()
    await editorSurface.click({ timeout: 15000, position: { x: 10, y: 10 } })
    await window.keyboard.press(`${modifierKey()}+A`)
    await window.keyboard.insertText(SMOKE_SOURCE)

    await window.waitForFunction(
      () => document.querySelector('.output-document h1')?.textContent?.trim() === 'Smoke Title',
      undefined,
      { timeout: 15000 }
    )

    const renderedBody = await window.locator('.output-document p').first().textContent()
    assert.match(renderedBody || '', /Smoke body paragraph\./)

    await app.evaluate(({ dialog }, fixture) => {
      dialog.showOpenDialog = async () => ({ canceled: false, filePaths: [fixture] })
    }, fixture)
    await window.evaluate(() => {
      window.confirm = () => true
    })
    await window.getByRole('button', { name: 'Open Folder', exact: true }).click()
    await window.locator('[data-path]').filter({ hasText: 'first.contract' }).last().click()
    await window.getByRole('tab', { name: 'first.contract', exact: true }).waitFor()
    await editorSurface.click({ position: { x: 10, y: 10 } })
    await window.keyboard.press(`${modifierKey()}+End`)
    await window.keyboard.insertText(' changed')
    await window.getByRole('tab', { name: 'first.contract •', exact: true }).waitFor()
    await window.locator('[data-path]').filter({ hasText: 'second.txt' }).last().click()
    await window.getByRole('tab', { name: 'second.txt', exact: true }).waitFor()
    await window.getByRole('tab', { name: 'first.contract •', exact: true }).click()
    await window.keyboard.press(`${modifierKey()}+Z`)
    await window.getByRole('tab', { name: 'first.contract', exact: true }).waitFor()
    await window.keyboard.insertText(' saved edit')
    await window.getByRole('button', { name: 'Save', exact: true }).click()
    await window.getByRole('tab', { name: 'first.contract', exact: true }).waitFor()
    assert.match(await readFile(join(fixture, 'first.contract'), 'utf8'), /saved edit/)
    await editorSurface.click({ position: { x: 10, y: 10 } })
    await window.keyboard.insertText(' unsaved edit')
    await window.evaluate(() => {
      window.confirm = () => false
    })
    await window.getByRole('button', { name: 'Close first.contract', exact: true }).click()
    assert.equal(
      await window.getByRole('tab', { name: 'first.contract •', exact: true }).count(),
      1
    )
    await window.evaluate(() => {
      window.confirm = () => true
    })
    await window.getByRole('button', { name: 'Close first.contract', exact: true }).click()
    assert.equal(await window.getByRole('tab', { name: /first.contract/ }).count(), 0)
    await window.keyboard.press(`${modifierKey()}+P`)
    const quickSearch = window.getByRole('combobox', { name: 'Search files by name or path' })
    await quickSearch.fill('nested/hidden')
    await window.getByRole('option', { name: /hidden.contract/ }).waitFor()
    await window.keyboard.press('Enter')
    await window.getByRole('tab', { name: 'hidden.contract', exact: true }).waitFor()
    await window.keyboard.press(`${modifierKey()}+P`)
    await quickSearch.fill('no-such-file')
    await window.getByText('No matching contract or text files.').waitFor()
    await window.keyboard.press('Escape')
    assert.equal(await window.getByRole('dialog', { name: 'Quick Open' }).count(), 0)
    await window.getByRole('button', { name: 'Find', exact: true }).click()
    const findInput = window.locator('.find-widget .find-part textarea')
    await findInput.fill('Smoke')
    await window
      .locator('.find-widget .matchesCount')
      .filter({ hasText: /of/ })
      .waitFor({ state: 'attached' })
    await window.keyboard.press('Escape')
    await window.getByRole('button', { name: 'Replace', exact: true }).click()
    await window.locator('.find-widget .replace-part textarea').fill('Revised')
    await window.keyboard.press(`${modifierKey()}+Alt+Enter`)
    await window.waitForFunction(
      () => document.querySelector('.output-document h1')?.textContent === 'Revised Title'
    )
    await window.keyboard.press('Escape')
    await window.getByRole('button', { name: 'Go to Line', exact: true }).click()
    const goToLine = window.locator('.quick-input-widget input')
    await goToLine.fill(':3')
    await window.keyboard.press('Enter')
    await window.getByRole('button', { name: /Ln 3, Col/ }).waitFor()
    const wrap = window.getByRole('button', { name: 'Word Wrap', exact: true })
    assert.equal(await wrap.getAttribute('aria-pressed'), 'true')
    await wrap.click()
    assert.equal(await wrap.getAttribute('aria-pressed'), 'false')
    await window.keyboard.press('Alt+Z')
    await window.waitForFunction(
      () =>
        document.querySelector('.editor-toolbar [aria-pressed]')?.getAttribute('aria-pressed') ===
        'true'
    )
    console.log('Electron smoke passed: preview, tabs, undo/save, Quick Open and editor controls.')
  } finally {
    await app.close()
    await rm(fixture, { recursive: true, force: true })
  }
}

run().catch((error) => {
  console.error('Electron smoke test failed:')
  console.error(error)
  process.exit(1)
})
