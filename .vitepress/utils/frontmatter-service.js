import fs from 'node:fs'
import matter from 'gray-matter'
import _ from 'lodash'

// gray-matter is a dep for vitepress,
// no need to specify that in package.json

class FrontMatterService {
  /** @param {Record<string, any>} obj */
  __print(obj) {
    // eslint-disable-next-line no-console
    console.log(JSON.stringify(obj, null, 2))
  }

  /** @param {string} filePath */
  open(filePath) {
    this.filePath = filePath
    this.file = fs.readFileSync(filePath)
    this.matter = matter(String(this.file))
    return this
  }

  isEmpty() {
    return _._isEmpty(this.matter.data)
  }

  /** @param{(data: string) => void} callback */
  readFile(callback) {
    callback(String(this.file))
    return this
  }

  show() {
    this.__print(this.matter)
    return this
  }

  /**
   * @param {string} key
   * @param {string} value
   */
  set(key, value) {
    this.matter.data[key] = value
    return this
  }

  /** @param {Record<string, any>} src */
  extend(src) {
    _.extend(this.matter.data, src)
    return this
  }

  save() {
    const matterStringifyData = this.matter.stringify()
    fs.writeFile(this.filePath, matterStringifyData, (err) => {
      if (err) {
        console.warn(`${this.filePath} -- Saving file with matter failed !!`)
      }
    })
  }
}

export default new FrontMatterService()
