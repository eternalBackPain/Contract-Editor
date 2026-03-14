#!/usr/bin/env node
import assert from 'node:assert/strict'
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

    console.log('Electron smoke test passed.')
  } finally {
    await app.close()
  }
}

run().catch((error) => {
  console.error('Electron smoke test failed:')
  console.error(error)
  process.exit(1)
})
