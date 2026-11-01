import { writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { EXAMPLE_DRAFT } from '../shared/example-draft.mjs'

export function createExampleFile(rootPath) {
  for (let index = 0; ; index += 1) {
    const path = join(rootPath, index === 0 ? 'example.contract' : `example-${index}.contract`)
    try {
      writeFileSync(path, EXAMPLE_DRAFT, { encoding: 'utf8', flag: 'wx' })
      return { path, content: EXAMPLE_DRAFT }
    } catch (error) {
      if (error.code === 'EEXIST') continue
      throw new Error(
        `Could not create example; check the folder for a partially created file: ${error.message}`
      )
    }
  }
}
