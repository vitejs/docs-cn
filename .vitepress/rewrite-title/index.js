import path from 'node:path'
import fsp from 'node:fs/promises'
import matterService from '../utils/frontmatter-service.js'
import { fileURLToPath } from 'node:url'
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const workspacePath = path.resolve(__dirname, '..', '..')

const h1MdRegExp = /^#\s+(.+)\s+(\{#([\w-]+)\})$/
/** 在此书写所有文章所在的目录名 */
const articleDirs = ['blog', 'config', 'guide', 'plugins']

const rewriteMarkdownTitle = (filePath) => {
  const matter = matterService.open(filePath)
  const lines = String(matter.file).split(/\r?\n/)
  const h1Line = lines.find((line) => h1MdRegExp.test(line))
  if (!h1Line) return

  const title = h1MdRegExp.exec(h1Line)[1]
  matter.set('title', title).save()
}

const ergodicDirectory = async (dirPath) => {
  try {
    const files = await fsp.readdir(dirPath)
    for (let i = 0; i < files.length; i++) {
      const file = files[i],
        filePath = path.join(dirPath, file)
      const stats = await fsp.stat(filePath)
      if (stats.isFile()) {
        if (filePath.split('.').pop().toLowerCase() === 'md') {
          rewriteMarkdownTitle(filePath)
        }
      } else if (stats.isDirectory()) {
        if (articleDirs.includes(filePath.split('/').pop())) {
          await ergodicDirectory(filePath)
        }
      }
    }
  } catch (err) {
    console.warn(
      `vite-docs-cn: failed to rewrite frontmatter for titles.\n ${err}!`
    )
  }
}

export default () => ergodicDirectory(workspacePath)
