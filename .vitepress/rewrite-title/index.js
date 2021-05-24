const path = require('path')
const fs = require('fs')
const workspacePath = path.resolve(__dirname, '..', '..')
const articleDirs = ['blog', 'config', 'guide', 'plugins']
const h1MdRegExp = /^#\s+(.+)\s+(\{#([\w-]+)\})$/

const rewriteMarkdownTitle = (filePath) => {
  fs.readFile(filePath, (err, fileData) => {
    if (err) {
      console.warn(`Reading file: ${filePath} failed !`)
      return
    }

    const lines = String(fileData).split(/\r?\n/)
    if (h1MdRegExp.test(lines[0])) {
      const matched = h1MdRegExp.exec(lines[0])
      const titleMeta = `---\ntitle: ${matched[1]}\n---\n`
      fs.writeFile(filePath, titleMeta + fileData, (err) => {
        if (err) {
          console.warn(`Writing title meta ${matched[1]} failed !`)
          return
        }
      })
    }
  })
}

const ergodicDirectory = (dirPath) => {
  fs.readdir(dirPath, (err, files) => {
    if (err) {
      console.warn('Directory reading failed !')
      return
    }

    files.forEach((file) => {
      const filePath = path.join(dirPath, file)
      fs.stat(filePath, (err, stats) => {
        if (err) {
          console.warn('File status reading failed !')
          return
        }

        if (stats.isFile()) {
          if (filePath.split('.').pop().toLowerCase() === 'md') {
            rewriteMarkdownTitle(filePath)
          }
        } else if (stats.isDirectory()) {
          if (articleDirs.includes(filePath.split('/').pop())) {
            ergodicDirectory(filePath)
          }
        }
      })
    })
  })
}

ergodicDirectory(workspacePath)
