#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'node:fs'
import { extname, resolve } from 'node:path'
import { compile, validate } from '@contract-editor/core'

function printHelp() {
  console.log(`contractc - Contract Editor CLI

Usage:
  contractc validate <input>
  contractc compile <input> --to xml|html [--out <path>] [--style <path>] [--embed-style]

Notes:
  - Supported input extensions: .contract, .txt
  - .contract is the recommended extension for new documents.`)
}

function formatDiagnostic(diagnostic) {
  const line = Number.isFinite(diagnostic.line) ? diagnostic.line : 0
  const column = Number.isFinite(diagnostic.column) ? diagnostic.column : 0
  return `[${diagnostic.code}] ${diagnostic.message} (${line}:${column})`
}

function assertSupportedInput(path) {
  const ext = extname(path).toLowerCase()
  if (ext !== '.contract' && ext !== '.txt') {
    throw new Error(`Unsupported input extension '${ext}'. Use .contract or .txt.`)
  }
}

function readSource(inputPath) {
  const fullPath = resolve(inputPath)
  assertSupportedInput(fullPath)
  return readFileSync(fullPath, 'utf-8')
}

function readStyleProfile(stylePath) {
  const raw = readFileSync(resolve(stylePath), 'utf-8')
  try {
    return JSON.parse(raw)
  } catch {
    throw new Error(`Invalid style profile JSON at '${stylePath}'.`)
  }
}

function parseArgs(argv) {
  const [command, ...rest] = argv
  if (!command || command === '--help' || command === '-h') {
    return { command: 'help' }
  }

  if (command === 'validate') {
    const input = rest[0]
    if (!input) throw new Error('Missing input path for validate command.')
    return { command, input }
  }

  if (command === 'compile') {
    const input = rest[0]
    if (!input) throw new Error('Missing input path for compile command.')

    let target = ''
    let outPath = ''
    let stylePath = ''
    let embedStyle = false

    for (let i = 1; i < rest.length; i += 1) {
      const arg = rest[i]
      if (arg === '--to') {
        target = rest[i + 1] || ''
        i += 1
        continue
      }
      if (arg === '--out') {
        outPath = rest[i + 1] || ''
        i += 1
        continue
      }
      if (arg === '--style') {
        stylePath = rest[i + 1] || ''
        i += 1
        continue
      }
      if (arg === '--embed-style') {
        embedStyle = true
        continue
      }
      throw new Error(`Unknown option '${arg}'`)
    }

    if (target !== 'xml' && target !== 'html') {
      throw new Error("compile requires '--to xml' or '--to html'.")
    }

    if (stylePath === '' && rest.includes('--style')) {
      throw new Error("compile option '--style' requires a path.")
    }

    return { command, input, target, outPath, stylePath, embedStyle }
  }

  throw new Error(`Unknown command '${command}'`)
}

function runValidate(input) {
  const source = readSource(input)
  const result = validate(source)
  if (result.valid) {
    console.log('Valid.')
    return 0
  }

  for (const diagnostic of result.diagnostics) {
    console.error(formatDiagnostic(diagnostic))
  }
  return 1
}

function runCompile(input, target, outPath, stylePath, embedStyle) {
  const source = readSource(input)
  const styleProfile = stylePath ? readStyleProfile(stylePath) : undefined

  if (target === 'xml' && (stylePath || embedStyle)) {
    console.error('Warning: style options are ignored when compiling to xml.')
  }

  const compileOptions =
    target === 'html'
      ? {
          styleProfile,
          includeCss: embedStyle
        }
      : undefined

  const result = compile(source, target, compileOptions)
  if (!result.success) {
    for (const diagnostic of result.diagnostics) {
      console.error(formatDiagnostic(diagnostic))
    }
    return 1
  }

  for (const diagnostic of result.diagnostics) {
    if (diagnostic?.severity === 'warning') {
      console.error(formatDiagnostic(diagnostic))
    }
  }

  if (outPath) {
    writeFileSync(resolve(outPath), result.output, 'utf-8')
  } else {
    process.stdout.write(result.output)
    if (!result.output.endsWith('\n')) process.stdout.write('\n')
  }

  return 0
}

try {
  const parsed = parseArgs(process.argv.slice(2))
  if (parsed.command === 'help') {
    printHelp()
    process.exit(0)
  }

  const code =
    parsed.command === 'validate'
      ? runValidate(parsed.input)
      : runCompile(parsed.input, parsed.target, parsed.outPath, parsed.stylePath, parsed.embedStyle)

  process.exit(code)
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error))
  process.exit(1)
}
