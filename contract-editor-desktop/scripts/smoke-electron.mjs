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
  const profile = await mkdtemp(join(tmpdir(), 'contract-editor-profile-'))
  const fixture = await mkdtemp(join(tmpdir(), 'contract-editor-smoke-'))
  await writeFile(join(fixture, 'first.contract'), SMOKE_SOURCE)
  await writeFile(join(fixture, 'second.txt'), '@begin{Second}\n# Second draft\n@end{Second}')
  await mkdir(join(fixture, 'nested'))
  await writeFile(join(fixture, 'nested', 'hidden.contract'), SMOKE_SOURCE)
  const app = await playwrightElectron.launch({
    executablePath: electronPath,
    args: ['.', `--user-data-dir=${profile}`]
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
    const tree = window.getByRole('tree', { name: 'File Explorer', exact: true })
    await tree.focus()
    await window.keyboard.press('ArrowUp')
    await window.getByRole('button', { name: 'New File', exact: true }).click()
    await window.locator('.explorer-inline-input').fill('created.contract')
    await window.keyboard.press('Enter')
    await window.locator('.explorer-inline-input').waitFor({ state: 'detached' })
    await window.getByRole('treeitem', { name: 'created.contract', exact: true }).waitFor()
    assert.equal(await readFile(join(fixture, 'created.contract'), 'utf8'), '')
    await tree.focus()
    await window.getByRole('button', { name: 'New Folder', exact: true }).click()
    await window.locator('.explorer-inline-input').fill('created-folder')
    await window.keyboard.press('Enter')
    await window.locator('.explorer-inline-input').waitFor({ state: 'detached' })
    await window.getByRole('treeitem', { name: 'created-folder', exact: true }).waitFor()
    await window.getByRole('treeitem', { name: 'created.contract', exact: true }).click()
    await window.evaluate(() => {
      window.confirm = () => false
    })
    await tree.focus()
    await window.keyboard.press('Delete')
    assert.equal(await readFile(join(fixture, 'created.contract'), 'utf8'), '')
    await window.evaluate(() => {
      window.confirm = () => true
    })
    // Duplicate names must show an error, retaining the existing file.
    await tree.focus()
    await window.keyboard.press('F2')
    await window.locator('.explorer-inline-input').fill('first.contract')
    await window.keyboard.press('Enter')
    await window.getByRole('alert').filter({ hasText: 'Could not update files' }).waitFor()
    assert.equal(await readFile(join(fixture, 'first.contract'), 'utf8'), SMOKE_SOURCE)
    const duplicateRejected = await window.evaluate(async (root) => {
      try {
        await window.api.createFile(root, 'first.contract')
        return false
      } catch {
        return true
      }
    }, fixture)
    assert.equal(duplicateRejected, true, 'Creating an existing file must fail')
    assert.equal(await readFile(join(fixture, 'first.contract'), 'utf8'), SMOKE_SOURCE)

    const rejected = await window.evaluate(async (outside) => {
      const operations = [
        () => window.api.readFile(outside),
        () => window.api.writeFile(outside, 'invalid'),
        () => window.api.createFile(outside, 'invalid.contract'),
        () => window.api.renamePath(outside, 'invalid'),
        () => window.api.deletePath(outside)
      ]
      return Promise.all(
        operations.map(async (operation) => {
          try {
            await operation()
            return false
          } catch {
            return true
          }
        })
      )
    }, profile)
    assert.ok(rejected.every(Boolean), 'Out-of-project file operations are rejected')
    await window.locator('[data-path]').filter({ hasText: 'first.contract' }).last().click()
    await window.getByRole('tab', { name: 'first.contract', exact: true }).waitFor()
    await editorSurface.click({ position: { x: 10, y: 10 } })
    await window.keyboard.press(`${modifierKey()}+End`)
    await window.keyboard.insertText(' changed')
    await window.getByRole('tab', { name: 'first.contract •', exact: true }).waitFor()
    await window.locator('[data-path]').filter({ hasText: 'second.txt' }).last().click()
    await window.getByRole('tab', { name: 'second.txt', exact: true }).waitFor()
    const secondTab = window.getByRole('tab', { name: 'second.txt', exact: true })
    await secondTab.focus()
    await window.keyboard.press('ArrowLeft')
    await window.waitForFunction(
      () =>
        document.activeElement?.getAttribute('role') === 'tab' &&
        document.activeElement.textContent.includes('first.contract')
    )
    assert.equal(
      await window
        .getByRole('tab', { name: 'first.contract •', exact: true })
        .getAttribute('aria-selected'),
      'true'
    )
    await window.keyboard.press('End')
    assert.equal(await secondTab.getAttribute('aria-selected'), 'true')
    const filter = window.getByRole('textbox', { name: 'Filter files', exact: true })
    await filter.fill('second')
    await filter.press('Home')
    await filter.press('Delete')
    assert.equal(
      await filter.inputValue(),
      'econd',
      'Delete edits the filter without deleting a file'
    )
    await filter.fill('')

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
    await editorSurface.click({ position: { x: 10, y: 10 } })
    await window.keyboard.press(`${modifierKey()}+A`)
    await window.keyboard.insertText('@begin{Broken}')
    await window.waitForFunction(() =>
      document.querySelector('.output-document')?.textContent.includes('ERROR')
    )
    await window.keyboard.press(`${modifierKey()}+A`)
    await window.keyboard.insertText(SMOKE_SOURCE)
    await window.waitForFunction(
      () => document.querySelector('.output-document h1')?.textContent.trim() === 'Smoke Title'
    )

    await window.keyboard.press(`${modifierKey()}+P`)
    await quickSearch.fill('second')
    await window.getByRole('option', { name: /second.txt/ }).waitFor()
    await window.getByRole('button', { name: 'Close Quick Open', exact: true }).focus()
    await window.keyboard.press('Enter')
    assert.equal(await window.getByRole('dialog', { name: 'Quick Open' }).count(), 0)
    assert.equal(
      await window
        .getByRole('tab', { name: 'hidden.contract', exact: true })
        .getAttribute('aria-selected'),
      'true',
      'Closing Quick Open must not open its selected result'
    )

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
    await window.keyboard.press(`${modifierKey()}+B`)
    assert.equal(await window.locator('.workspace-sidebar').isVisible(), false)
    assert.equal(await window.locator('.activity-button[aria-pressed="true"]').count(), 0)

    await window.keyboard.press(`${modifierKey()}+B`)
    await window.getByRole('tree', { name: 'File Explorer', exact: true }).waitFor()
    assert.equal(await window.getByRole('button', { name: 'Open Folder', exact: true }).count(), 0)
    await window.keyboard.press(`${modifierKey()}+Shift+V`)
    assert.equal(await window.locator('.workspace-preview-pane').count(), 0)
    await window.keyboard.press(`${modifierKey()}+2`)
    await window.locator('.workspace-preview-pane').waitFor()
    assert.equal(
      await window
        .locator('[aria-label="Rendered contract preview"]')
        .evaluate((element) => element === document.activeElement),
      true
    )
    await window.keyboard.press(`${modifierKey()}+1`)
    await window.keyboard.press(`${modifierKey()}+K`)
    await window.keyboard.press('z')
    await window.locator('.workspace-shell.is-zen').waitFor()
    assert.equal(await window.locator('.workspace-preview-pane').count(), 0)
    await window.keyboard.press('Escape')
    await window.keyboard.press('Escape')
    await window.locator('.workspace-shell:not(.is-zen)').waitFor()
    const divider = window.getByRole('separator', { name: 'Resize Explorer', exact: true })
    await divider.focus()
    await window.keyboard.press('Home')
    assert.equal(await divider.getAttribute('aria-valuenow'), '190')
    await window.keyboard.press('ArrowRight')
    assert.equal(await divider.getAttribute('aria-valuenow'), '200')
    await divider.dblclick()
    assert.equal(await divider.getAttribute('aria-valuenow'), '260')
    await window.getByRole('button', { name: 'Preview', exact: true }).click()
    await window.getByRole('treeitem', { name: 'hidden.contract', exact: true }).click()
    await window.getByRole('tree', { name: 'File Explorer', exact: true }).focus()
    await window.keyboard.press('F2')
    await window.locator('.explorer-inline-input').fill('renamed.contract')
    await window.keyboard.press('Enter')
    await window.getByRole('tab', { name: 'renamed.contract •', exact: true }).waitFor()
    await window.getByRole('button', { name: 'Save', exact: true }).click()
    await window.getByRole('tab', { name: 'renamed.contract', exact: true }).waitFor()
    assert.match(
      await readFile(join(fixture, 'nested', 'renamed.contract'), 'utf8'),
      /Revised Title/
    )
    await window.getByRole('tree', { name: 'File Explorer', exact: true }).focus()
    await window.keyboard.press('Delete')
    await window.getByText('Deleted from disk', { exact: true }).first().waitFor()
    assert.equal(await window.getByRole('button', { name: 'Save', exact: true }).isDisabled(), true)
    const fillWidths = await window.evaluate(() => ({
      editor: document.querySelector('.workspace-editor-pane').getBoundingClientRect().width,
      group: document.querySelector('.workspace-editor-group').getBoundingClientRect().width
    }))
    assert.ok(
      Math.abs(fillWidths.editor - fillWidths.group) < 2,
      'Editor fills group with preview hidden'
    )
    await window.getByRole('button', { name: 'Preview', exact: true }).click()
    // Reusing a deleted path must create a new model, independent of the retained draft.
    await writeFile(join(fixture, 'nested', 'renamed.contract'), SMOKE_SOURCE)
    await window.getByRole('treeitem', { name: 'renamed.contract', exact: true }).click()
    await window.waitForFunction(
      () => document.querySelector('.output-document h1')?.textContent?.trim() === 'Smoke Title'
    )
    assert.equal(
      await window.getByRole('tab', { name: 'renamed.contract', exact: true }).count(),
      2
    )
    await window.getByRole('tab', { name: 'renamed.contract', exact: true }).first().click()
    await window.waitForFunction(
      () => document.querySelector('.output-document h1')?.textContent?.trim() === 'Revised Title'
    )

    // Layout extremes must account for the divider and keep actions reachable.
    await app.evaluate(({ BrowserWindow }) => BrowserWindow.getAllWindows()[0].setSize(720, 480))
    const split = window.getByRole('separator', { name: 'Resize Editor and Preview', exact: true })
    await split.focus()
    await window.keyboard.press('End')
    const widths = await window.evaluate(() => ({
      group: document.querySelector('.workspace-editor-group').clientWidth,
      panes: [...document.querySelector('.workspace-editor-group').children].reduce(
        (sum, child) => sum + child.getBoundingClientRect().width,
        0
      )
    }))
    assert.ok(Math.abs(widths.group - widths.panes) < 2, 'Panes and divider fit their group')
    await window.getByRole('tab').first().focus()
    await window.keyboard.press('End')
    await window.waitForFunction(() => {
      const active = document.querySelector('.document-tabs [aria-selected="true"]')
      const tab = active.closest('.document-tab').getBoundingClientRect()
      const strip = active.closest('[role="tablist"]').getBoundingClientRect()
      return tab.left >= strip.left - 1 && tab.right <= strip.right + 1
    })
    await window.getByRole('button', { name: 'Formatting', exact: true }).click()
    const profileInput = window.getByRole('textbox', { name: 'Style profile JSON', exact: true })
    const originalProfile = await profileInput.inputValue()
    await profileInput.fill('{broken')
    await window.getByRole('button', { name: 'Apply', exact: true }).click()
    await window.getByRole('alert').filter({ hasText: 'Invalid JSON' }).waitFor()
    assert.equal(await profileInput.getAttribute('aria-invalid'), 'true')
    await profileInput.fill(originalProfile)
    await window.getByRole('button', { name: 'Apply', exact: true }).click()
    assert.equal(await profileInput.getAttribute('aria-invalid'), 'false')
    if (process.env.CONTRACT_EDITOR_SMOKE_SCREENSHOT) {
      await window.screenshot({ path: process.env.CONTRACT_EDITOR_SMOKE_SCREENSHOT })
    }
    console.log(
      'Electron smoke passed: tabs, Quick Open, editing controls, layout and file lifecycle.'
    )
  } finally {
    await app.evaluate(({ BrowserWindow }) => {
      for (const window of BrowserWindow.getAllWindows()) window.destroy()
    })
    await app.close()
    await rm(fixture, { recursive: true, force: true })
    await rm(profile, { recursive: true, force: true })
  }
}

run().catch((error) => {
  console.error('Electron smoke test failed:')
  console.error(error)
  process.exit(1)
})
