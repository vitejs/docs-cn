# Migration from v4 {#migration-from-v4}

## Node.js 支持 {#nodejs-support}

Vite 不再支持 Node.js 14 / 16 / 17 / 19，因为它们已经到了 EOL。现在需要 Node.js 18 / 20+。

## 废弃 CJS Node API {#deprecate-cjs-node-api}

CJS 的 Node API 已经被废弃。当调用 `require('vite')` 时，将会记录一个废弃警告。你应该更新你的文件或框架来导入 Vite 的 ESM 构建。

在一个基础的 Vite 项目中，请确保：

1. `vite.config.js` 配置文件的内容使用 ESM 语法。
2. 最近的 `package.json` 文件中有 `"type": "module"`，或者使用 `.mjs` 扩展名，例如 `vite.config.mjs`。

对于其他项目，有几种常见的方法：

- **配置 ESM 为默认，如果需要则选择 CJS：** 在项目 `package.json` 中添加 `"type": "module"`。所有 `*.js` 文件现在都被解释为 ESM，并且需要使用 ESM 语法。你可以将一个文件重命名为 `.cjs` 扩展名来继续使用 CJS。
- **保持 CJS 为默认，如果需要则选择 ESM：** 如果项目 `package.json` 没有 `"type": "module"`，所有 `*.js` 文件都被解释为 CJS。你可以将一个文件重命名为 `.mjs` 扩展名来使用 ESM。
- **动态导入 Vite：** 如果你需要继续使用 CJS，你可以使用 `import('vite')` 动态导入 Vite。这要求你的代码必须在一个 `async` 上下文中编写，但是由于 Vite 的 API 大多是异步的，所以应该还是可以管理的。

查看 [排错指南](https://cn.vitejs.dev/guide/troubleshooting.html#vite-cjs-node-api-deprecated) 获取更多信息。

## 其他一般性变化 {#general-changes}

### 允许路径包含 `.` 回退到 index.html {#allow-path-containing-to-fallback-to-index-html}

在 Vite 4 中，即使 `appType` 被设置为 `'SPA'`（默认），访问包含 `.` 的路径也不会回退到 index.html。从 Vite 5 开始，它将会回退到 index.html。

注意浏览器将不再在控制台中显示 404 错误消息，如果你将图片路径指向一个不存在的文件（例如 `<img src="./file-does-not-exist.png">`）。

### Manifest 文件现在默认生成到 `.vite` 目录中 {#manifest-files-are-now-generated-in-vite-directory-by-default}

在 Vite 4 中，manifest 文件（`build.manifest`，`build.ssrManifest`）默认会生成在 `build.outDir` 的根目录中。从 Vite 5 开始，这些文件将默认生成在 `build.outDir` 中的 `.vite` 目录中。

### CLI 快捷功能键需要一个额外的 `Enter` 按键 {#cli-shortcuts-require-an-additional-enter-press}

CLI 快捷功能键，例如 `r` 重启开发服务器，现在需要额外的 `Enter` 按键来触发快捷功能。例如，`r + Enter` 重启开发服务器。

这个改动防止 Vite 吞噬和控制操作系统特定的快捷键，允许更好的兼容性，当将 Vite 开发服务器与其他进程结合使用时，并避免了[之前的注意事项](https://github.com/vitejs/vite/pull/14342)。

<<<<<<< HEAD
## 移除部分废弃 API
=======
### Remove `resolvePackageEntry` and `resolvePackageData` APIs

The `resolvePackageEntry` and `resolvePackageData` APIs are removed as they exposed Vite's internals and blocked potential Vite 4.3 optimizations in the past. These APIs can be replaced with third-party packages, for example:

- `resolvePackageEntry`: [`import.meta.resolve`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import.meta/resolve) or the [`import-meta-resolve`](https://github.com/wooorm/import-meta-resolve) package.
- `resolvePackageData`: Same as above, and crawl up the package directory to get the root `package.json`. Or use the community [`vitefu`](https://github.com/svitejs/vitefu) package.

```js
import { resolve } from 'import-meta-env'
import { findDepPkgJsonPath } from 'vitefu'
import fs from 'node:fs'

const pkg = 'my-lib'
const basedir = process.cwd()

// `resolvePackageEntry`:
const packageEntry = resolve(pkg, basedir)

// `resolvePackageData`:
const packageJsonPath = findDepPkgJsonPath(pkg, basedir)
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'))
```

## Removed Deprecated APIs
>>>>>>> 6dfbb9189b93d95e733dbc9beaab59c1521b932c

- CSS 文件的默认导出（例如 `import style from './foo.css'`）：使用 `?inline` 查询参数代替
- `import.meta.globEager`：使用 `import.meta.glob('*', { eager: true })` 来代替
- `ssr.format: 'cjs'` 和 `legacy.buildSsrCjsExternalHeuristics`（[#13816](https://github.com/vitejs/vite/discussions/13816)）

## 进阶 {#advanced}

下列改动仅会影响到插件/工具的作者：

- [[#14119] refactor!: merge `PreviewServerForHook` into `PreviewServer` type](https://github.com/vitejs/vite/pull/14119)

此外，还有其他一些只影响少数用户的破坏性变化。

- [[#14098] fix!: avoid rewriting this (reverts #5312)](https://github.com/vitejs/vite/pull/14098)
  - 之前顶层 `this` 将会在构建时被默认地改写为 `globalThis`，这个行为现在已被移除
- [[#14231] feat!: add extension to internal virtual modules](https://github.com/vitejs/vite/pull/14231)
<<<<<<< HEAD
  - 内置虚拟模块的 id 现在包含一个扩展名（`.js`）
=======
  - Internal virtual modules' id now has an extension (`.js`).
- [[#14583] refactor!: remove exporting internal APIs](https://github.com/vitejs/vite/pull/14583)
  - Removed accidentally exported internal APIs: `isDepsOptimizerEnabled` and `getDepOptimizationConfig`
  - Removed exported internal types: `DepOptimizationResult`, `DepOptimizationProcessing`, and `DepsOptimizer`
  - Renamed `ResolveWorkerOptions` type to `ResolvedWorkerOptions`
>>>>>>> 6dfbb9189b93d95e733dbc9beaab59c1521b932c
- [[#5657] fix: return 404 for resources requests outside the base path](https://github.com/vitejs/vite/pull/5657)
  - 过去，Vite 对于不带 `Accept: text/html` 的请求，会将其当作带有基础路径的请求来处理。现在 Vite 不再这样做，而是返回 404。

## 从 v3 迁移 {#migration-from-v3}

请先查看 [从 v3 迁移指南](https://cn.vitejs.dev/guide/migration-from-v3.html) 文档查看对您的应用所有需要迁移的改动，然后再执行本篇指南所述的改动。
