# 从 v4 迁移 {#migration-from-v4}

## Node.js 支持 {#nodejs-support}

Vite 不再支持 Node.js 14 / 16 / 17 / 19，因为它们已经到了 EOL。现在需要 Node.js 18 / 20+。

## Rollup 4

Vite 现在使用 Rollup 4，它也带来了一些重大的变化，特别是：

- 导入断言（`assertions` 属性）已被重命名为导入属性（`attributes` 属性）。
- 不再支持 Acorn 插件。
- 对于 Vite 插件，`this.resolve` 的 `skipSelf` 选项现在默认为 `true`。
- 对于 Vite 插件，`this.parse` 现在只支持 `allowReturnOutsideFunction` 选项。

<<<<<<< HEAD
你可以阅读 [Rollup 的发布说明](https://github.com/rollup/rollup/releases/tag/v4.0.0) 中的破坏性变更，了解在 `build.rollupOptions` 中构建相关的变更。
=======
Read the full breaking changes in [Rollup's release notes](https://github.com/rollup/rollup/releases/tag/v4.0.0) for build-related changes in [`build.rollupOptions`](/config/build-options.md#build-rollupoptions).
>>>>>>> cb28b1ffb3de626548c59cb2211f8f1cdfcd07d0

## 废弃 CJS Node API {#deprecate-cjs-node-api}

CJS 的 Node API 已经被废弃。当调用 `require('vite')` 时，将会记录一个废弃警告。你应该更新你的文件或框架来导入 Vite 的 ESM 构建。

在一个基础的 Vite 项目中，请确保：

1. `vite.config.js` 配置文件的内容使用 ESM 语法。
2. 最近的 `package.json` 文件中有 `"type": "module"`，或者使用 `.mjs` 扩展名，例如 `vite.config.mjs`。

对于其他项目，有几种常见的方法：

- **配置 ESM 为默认，如果需要则选择 CJS：** 在项目 `package.json` 中添加 `"type": "module"`。所有 `*.js` 文件现在都被解释为 ESM，并且需要使用 ESM 语法。你可以将一个文件重命名为 `.cjs` 扩展名来继续使用 CJS。
- **保持 CJS 为默认，如果需要则选择 ESM：** 如果项目 `package.json` 没有 `"type": "module"`，所有 `*.js` 文件都被解释为 CJS。你可以将一个文件重命名为 `.mjs` 扩展名来使用 ESM。
- **动态导入 Vite：** 如果你需要继续使用 CJS，你可以使用 `import('vite')` 动态导入 Vite。这要求你的代码必须在一个 `async` 上下文中编写，但是由于 Vite 的 API 大多是异步的，所以应该还是可以管理的。

查看 [排错指南](/guide/troubleshooting.html#vite-cjs-node-api-deprecated) 获取更多信息。

## 重新设计 `define` 和 `import.meta.env.*` 的替换策略 {#rework-define-and-import-meta-env-replacement-strategy}

<<<<<<< HEAD
在 Vite 4 中，`define` 和 `import.meta.env.*` 特性在开发和构建中使用的是不同的替换策略：
=======
In Vite 4, the [`define`](/config/shared-options.md#define) and [`import.meta.env.*`](/guide/env-and-mode.md#env-variables) features use different replacement strategies in dev and build:
>>>>>>> cb28b1ffb3de626548c59cb2211f8f1cdfcd07d0

- 在开发时，这两个特性分别作为全局变量注入到 `globalThis` 和 `import.meta` 中。
- 在构建时，这两个特性都使用正则表达式进行静态替换。

这导致在尝试访问这些变量时，开发和构建存在一致性问题，有时甚至导致构建失败。例如：

```js
// vite.config.js
export default defineConfig({
  define: {
    __APP_VERSION__: JSON.stringify('1.0.0'),
  },
})
```

```js
const data = { __APP_VERSION__ }
// 开发：{ __APP_VERSION__: "1.0.0" } ✅
// 构建：{ "1.0.0" } ❌

const docs = 'I like import.meta.env.MODE'
// 开发："I like import.meta.env.MODE" ✅
// 构建："I like "production"" ❌
```

Vite 5 通过在构建中使用 `esbuild` 来处理替换，使其与开发行为保持一致。

这个改动不应该影响大部分设置，因为已经在文档中说明了 `define` 的值应该遵循 esbuild 的语法：

> 为了与 esbuild 行为保持一致，表达式必须是一个 JSON 对象（null、boolean、number、string、array 或 object）或一个单一标识符字符串。

然而，如果你更喜欢对值直接使用静态替换，你可以使用 [`@rollup/plugin-replace`](https://github.com/rollup/plugins/tree/master/packages/replace)。

## 其他一般性变化 {#general-changes}

### SSR 外部模块值现在符合生产环境行为 {#ssr-externalized-modules-value-now-matches-production}

在 Vite 4 中，服务器端渲染的外部模块被包装为 `.default` 和 `.__esModule` 处理，以实现更好的互操作性，但是它并不符合运行时环境（例如 Node.js）加载时的生产环境行为，导致难以捕获的不一致性。默认情况下，所有直接的项目依赖都是 SSR 外部化的。

Vite 5 现在删除了 `.default` 和 `.__esModule` 处理，以匹配生产环境行为。在实践中，这不应影响正确打包的依赖项，但是如果你在加载模块时遇到新的问题，你可以尝试以下重构：

```js
// 之前：
import { foo } from 'bar'

// 之后：
import _bar from 'bar'
const { foo } = _bar
```

```js
// 之前：
import foo from 'bar'

// 之后：
import * as _foo from 'bar'
const foo = _foo.default
```

注意，这些更改符合 Node.js 的行为，因此也可以在 Node.js 中运行这些导入进行测试。如果你更喜欢坚持使用之前的方式，你可以将 `legacy.proxySsrExternalModules` 设置为 `true`。

### `worker.plugins` 现在是一个函数 {#worker-plugins-is-now-a-function}

<<<<<<< HEAD
在 Vite 4 中，`worker.plugins` 接受一个插件数组 (`(Plugin | Plugin[])[]`)。从 Vite 5 开始，它需要配置为一个返回插件数组的函数 (`() => (Plugin | Plugin[])[]`)。这个改变是为了让并行的 worker 构建运行得更加一致和可预测。
=======
In Vite 4, [`worker.plugins`](/config/worker-options.md#worker-plugins) accepted an array of plugins (`(Plugin | Plugin[])[]`). From Vite 5, it needs to be configured as a function that returns an array of plugins (`() => (Plugin | Plugin[])[]`). This change is required so parallel worker builds run more consistently and predictably.
>>>>>>> cb28b1ffb3de626548c59cb2211f8f1cdfcd07d0

### 允许路径包含 `.` 回退到 index.html {#allow-path-containing-to-fallback-to-index-html}

<<<<<<< HEAD
在 Vite 4 中，即使 `appType` 被设置为 `'SPA'`（默认），访问包含 `.` 的路径也不会回退到 index.html。从 Vite 5 开始，它将会回退到 index.html。

注意浏览器将不再在控制台中显示 404 错误消息，如果你将图片路径指向一个不存在的文件（例如 `<img src="./file-does-not-exist.png">`）。
=======
In Vite 4, accessing a path in dev containing `.` did not fallback to index.html even if [`appType`](/config/shared-options.md#apptype) is set to `'spa'` (default). From Vite 5, it will fallback to index.html.

Note that the browser will no longer show a 404 error message in the console if you point the image path to a non-existent file (e.g. `<img src="./file-does-not-exist.png">`).

### Align dev and preview HTML serving behaviour

In Vite 4, the dev and preview servers serve HTML based on its directory structure and trailing slash differently. This causes inconsistencies when testing your built app. Vite 5 refactors into a single behaviour like below, given the following file structure:

```
├── index.html
├── file.html
└── dir
    └── index.html
```

| Request           | Before (dev)                 | Before (preview)  | After (dev & preview)        |
| ----------------- | ---------------------------- | ----------------- | ---------------------------- |
| `/dir/index.html` | `/dir/index.html`            | `/dir/index.html` | `/dir/index.html`            |
| `/dir`            | `/index.html` (SPA fallback) | `/dir/index.html` | `/dir.html` (SPA fallback)   |
| `/dir/`           | `/dir/index.html`            | `/dir/index.html` | `/dir/index.html`            |
| `/file.html`      | `/file.html`                 | `/file.html`      | `/file.html`                 |
| `/file`           | `/index.html` (SPA fallback) | `/file.html`      | `/file.html`                 |
| `/file/`          | `/index.html` (SPA fallback) | `/file.html`      | `/index.html` (SPA fallback) |
>>>>>>> cb28b1ffb3de626548c59cb2211f8f1cdfcd07d0

### Manifest 文件现在默认生成到 `.vite` 目录中 {#manifest-files-are-now-generated-in-vite-directory-by-default}

<<<<<<< HEAD
在 Vite 4 中，manifest 文件（`build.manifest`，`build.ssrManifest`）默认会生成在 `build.outDir` 的根目录中。从 Vite 5 开始，这些文件将默认生成在 `build.outDir` 中的 `.vite` 目录中。
=======
In Vite 4, the manifest files ([`build.manifest`](/config/build-options.md#build-manifest), [`build.ssrManifest`](/config/build-options.md#build-ssrmanifest)) was generated in the root of [`build.outDir`](/config/build-options.md#build-outdir) by default. From Vite 5, those will be generated in the `.vite` directory in the `build.outDir` by default.
>>>>>>> cb28b1ffb3de626548c59cb2211f8f1cdfcd07d0

### CLI 快捷功能键需要一个额外的 `Enter` 按键 {#cli-shortcuts-require-an-additional-enter-press}

CLI 快捷功能键，例如 `r` 重启开发服务器，现在需要额外的 `Enter` 按键来触发快捷功能。例如，`r + Enter` 重启开发服务器。

这个改动防止 Vite 吞噬和控制操作系统特定的快捷键，允许更好的兼容性，当将 Vite 开发服务器与其他进程结合使用时，并避免了[之前的注意事项](https://github.com/vitejs/vite/pull/14342)。

<<<<<<< HEAD
### 移除 `--https` 标志和 `https: true` {#remove-https-flag-and-https-true}
=======
### Update `experimentalDecorators` and `useDefineForClassFields` TypeScript behaviour

Vite 5 uses esbuild 0.19 and removes the compatibility layer for esbuild 0.18, which changes how [`experimentalDecorators`](https://www.typescriptlang.org/tsconfig#experimentalDecorators) and [`useDefineForClassFields`](https://www.typescriptlang.org/tsconfig#useDefineForClassFields) are handled.

- **`experimentalDecorators` is not enabled by default**

  You need to set `compilerOptions.experimentalDecorators` to `true` in `tsconfig.json` to use decorators.

- **`useDefineForClassFields` defaults depend on the TypeScript `target` value**

  If `target` is not `ESNext` or `ES2022` or newer, or if there's no `tsconfig.json` file, `useDefineForClassFields` will default to `false` which can be problematic with the default `esbuild.target` value of `esnext`. It may transpile to [static initialization blocks](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Static_initialization_blocks#browser_compatibility) which may not be supported in your browser.

  As such, it is recommended to set `target` to `ESNext` or `ES2022` or newer, or set `useDefineForClassFields` to `true` explicitly when configuring `tsconfig.json`.

```jsonc
{
  "compilerOptions": {
    // Set true if you use decorators
    "experimentalDecorators": true,
    // Set true if you see parsing errors in your browser
    "useDefineForClassFields": true
  }
}
```

### Remove `--https` flag and `https: true`
>>>>>>> cb28b1ffb3de626548c59cb2211f8f1cdfcd07d0

`--https` 标志设置 `https: true`。这个配置本来是要与自动 https 证书生成特性一起使用的，但这个特性在 [Vite 3 中被移除](https://v3.vitejs.dev/guide/migration.html#automatic-https-certificate-generation)。这个配置现在已经没有意义了，因为它会让Vite启动一个没有证书的 HTTPS 服务器。
[`@vitejs/plugin-basic-ssl`](https://github.com/vitejs/vite-plugin-basic-ssl) 和 [`vite-plugin-mkcert`](https://github.com/liuweiGL/vite-plugin-mkcert) 都会设置 `https` 配置，无论 `https` 值是什么，所以你可以直接移除 `--https` 和 `https: true`。

### 移除 `resolvePackageEntry` 和 `resolvePackageData` API {#remove-resolvepackageentry-and-resolvepackagedata-apis}

`resolvePackageEntry` 和 `resolvePackageData` API 已被移除，因为它们暴露了 Vite 的内部机制，并在过去阻碍了 Vite 4.3 的潜在优化。这些 API 可以被第三方包替代，例如：

- `resolvePackageEntry`: [`import.meta.resolve`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import.meta/resolve) 或者 [`import-meta-resolve`](https://github.com/wooorm/import-meta-resolve) 库。
- `resolvePackageData`: 与上述相同，向上爬取包目录以获取根 `package.json`。或者使用社区的 [`vitefu`](https://github.com/svitejs/vitefu) 库。

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

## 移除部分废弃 API {#removed-deprecated-apis}

<<<<<<< HEAD
- CSS 文件的默认导出（例如 `import style from './foo.css'`）：使用 `?inline` 查询参数代替
- `import.meta.globEager`：使用 `import.meta.glob('*', { eager: true })` 来代替
- `ssr.format: 'cjs'` 和 `legacy.buildSsrCjsExternalHeuristics`（[#13816](https://github.com/vitejs/vite/discussions/13816)）
=======
- Default exports of CSS files (e.g `import style from './foo.css'`): Use the `?inline` query instead
- `import.meta.globEager`: Use `import.meta.glob('*', { eager: true })` instead
- `ssr.format: 'cjs'` and `legacy.buildSsrCjsExternalHeuristics` ([#13816](https://github.com/vitejs/vite/discussions/13816))
- `server.middlewareMode: 'ssr'` and `server.middlewareMode: 'html'`: Use [`appType`](/config/shared-options.md#apptype) + [`server.middlewareMode: true`](/config/server-options.md#server-middlewaremode) instead ([#8452](https://github.com/vitejs/vite/pull/8452))
>>>>>>> cb28b1ffb3de626548c59cb2211f8f1cdfcd07d0

## 进阶 {#advanced}

下列改动仅会影响到插件/工具的作者：

- [[#14119] refactor!: merge `PreviewServerForHook` into `PreviewServer` type](https://github.com/vitejs/vite/pull/14119)
  - The `configurePreviewServer` hook now accepts the `PreviewServer` type instead of `PreviewServerForHook` type.
- [[#14818] refactor(preview)!: use base middleware](https://github.com/vitejs/vite/pull/14818)
  - Middlewares added from the returned function in `configurePreviewServer` now does not have access to the `base` when comparing the `req.url` value. This aligns the behaviour with the dev server. You can check the `base` from the `configResolved` hook if needed.

此外，还有其他一些只影响少数用户的破坏性变化。

- [[#14098] fix!: avoid rewriting this (reverts #5312)](https://github.com/vitejs/vite/pull/14098)
  - 之前顶层 `this` 将会在构建时被默认地改写为 `globalThis`，这个行为现在已被移除
- [[#14231] feat!: add extension to internal virtual modules](https://github.com/vitejs/vite/pull/14231)
  - 内置虚拟模块的 id 现在包含一个扩展名（`.js`）
- [[#14583] refactor!: remove exporting internal APIs](https://github.com/vitejs/vite/pull/14583)
  - 移除意外导出的内部 API：`isDepsOptimizerEnabled` 和 `getDepOptimizationConfig`
  - 移除导出的内部类型：`DepOptimizationResult`，`DepOptimizationProcessing` 和 `DepsOptimizer`
  - 改名 `ResolveWorkerOptions` 类型为 `ResolvedWorkerOptions`
- [[#5657] fix: return 404 for resources requests outside the base path](https://github.com/vitejs/vite/pull/5657)
  - 过去，Vite 对于不带 `Accept: text/html` 的请求，会将其当作带有基础路径的请求来处理。现在 Vite 不再这样做，而是返回 404。
- [[#14723] fix(resolve)!: remove special .mjs handling](https://github.com/vitejs/vite/pull/14723)
  - 在过去，当一个库的 `"exports"` 字段映射到一个 `.mjs` 文件时，Vite 仍然会尝试匹配 `"browser"` 和 `"module"` 字段，以修复与某些库的兼容性。现在，这种行为已被移除，以便与导出解析算法保持一致。
- [[#14733] feat(resolve)!: remove `resolve.browserField`](https://github.com/vitejs/vite/pull/14733)
<<<<<<< HEAD
  - `resolve.browserField` has been deprecated since Vite 3 in favour of an updated default of `['browser', 'module', 'jsnext:main', 'jsnext']` for `resolve.mainFields`。
=======
  - `resolve.browserField` has been deprecated since Vite 3 in favour of an updated default of `['browser', 'module', 'jsnext:main', 'jsnext']` for [`resolve.mainFields`](/config/shared-options.md#resolve-mainfields).
- [[#14855] feat!: add isPreview to ConfigEnv and resolveConfig](https://github.com/vitejs/vite/pull/14855)
  - Renamed `ssrBuild` to `isSsrBuild` in the `ConfigEnv` object.
>>>>>>> cb28b1ffb3de626548c59cb2211f8f1cdfcd07d0

## 从 v3 迁移 {#migration-from-v3}

请先查看 [从 v3 迁移指南](https://cn.vitejs.dev/guide/migration-from-v3.html) 文档查看对您的应用所有需要迁移的改动，然后再执行本篇指南所述的改动。
