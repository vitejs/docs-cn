# 从 v4 迁移 {#migration-from-v4}

## Node.js 支持 {#nodejs-support}

Vite 不再支持 Node.js 14 / 16 / 17 / 19，因为它们已经到了 EOL。现在需要 Node.js 18 / 20+。

Some internal APIs have been removed due to changes in Vite's implementation. If you were relying on one of them, please create a [feature request](https://github.com/vitejs/vite/issues/new?assignees=&labels=enhancement%3A+pending+triage&projects=&template=feature_request.yml).

Vite 现在使用 Rollup 4，它也带来了一些重大的变化，特别是：

- 导入断言（`assertions` 属性）已被重命名为导入属性（`attributes` 属性）。
- 不再支持 Acorn 插件。
- 对于 Vite 插件，`this.resolve` 的 `skipSelf` 选项现在默认为 `true`。
- 对于 Vite 插件，`this.parse` 现在只支持 `allowReturnOutsideFunction` 选项。

你可以阅读 [Rollup 的发布说明](https://github.com/rollup/rollup/releases/tag/v4.0.0) 中的破坏性变更，了解在 [`build.rollupOptions`](/config/build-options.md#build-rollupoptions) 中构建相关的变更。

如果你正在使用 TypeScript，请确保设置 `moduleResolution: 'bundler'`（或 `node16`/`nodenext`）因为 Rollup 4 需要它。或者你可以设置 `skipLibCheck: true`。

## 废弃 CJS Node API {#deprecate-cjs-node-api}

CJS 的 Node API 已经被废弃。当调用 `require('vite')` 时，将会记录一个废弃警告。你应该更新你的文件或框架来导入 Vite 的 ESM 构建。

在一个基础的 Vite 项目中，请确保：

1. `vite.config.js` 配置文件的内容使用 ESM 语法。
2. 最近的 `package.json` 文件中有 `"type": "module"`，或者使用 `.mjs`/`.mts` 扩展名，例如 `vite.config.mjs` 或者 `.vite.config.mts`。

对于其他项目，有几种常见的方法：

- **配置 ESM 为默认，如果需要则选择 CJS：** 在项目 `package.json` 中添加 `"type": "module"`。所有 `*.js` 文件现在都被解释为 ESM，并且需要使用 ESM 语法。你可以将一个文件重命名为 `.cjs` 扩展名来继续使用 CJS。
- **保持 CJS 为默认，如果需要则选择 ESM：** 如果项目 `package.json` 没有 `"type": "module"`，所有 `*.js` 文件都被解释为 CJS。你可以将一个文件重命名为 `.mjs` 扩展名来使用 ESM。
- **动态导入 Vite：** 如果你需要继续使用 CJS，你可以使用 `import('vite')` 动态导入 Vite。这要求你的代码必须在一个 `async` 上下文中编写，但是由于 Vite 的 API 大多是异步的，所以应该还是可以管理的。

查看 [排错指南](/guide/troubleshooting.html#vite-cjs-node-api-deprecated) 获取更多信息。

## 重新设计 `define` 和 `import.meta.env.*` 的替换策略 {#rework-define-and-import-meta-env-replacement-strategy}

在 Vite 4 中，[`define`](/config/shared-options.md#define) 和 [`import.meta.env.*`](/guide/env-and-mode.md#env-variables) 特性在开发和构建中使用的是不同的替换策略：

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

在 Vite 4 中，服务端渲染的外部模块被包装为 `.default` 和 `.__esModule` 处理，以实现更好的互操作性，但是它并不符合运行时环境（例如 Node.js）加载时的生产环境行为，导致难以捕获的不一致性。默认情况下，所有直接的项目依赖都是 SSR 外部化的。

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

在 Vite 4 中，[`worker.plugins`](/config/worker-options.md#worker-plugins) 接受一个插件数组 (`(Plugin | Plugin[])[]`)。从 Vite 5 开始，它需要配置为一个返回插件数组的函数 (`() => (Plugin | Plugin[])[]`)。这个改变是为了让并行的 worker 构建运行得更加一致和可预测。

### 允许路径包含 `.` 回退到 index.html {#allow-path-containing-to-fallback-to-index-html}

在 Vite 4 中，即使 [`appType`](/config/shared-options.md#apptype) 被设置为 `'SPA'`（默认），访问包含 `.` 的路径也不会回退到 index.html。从 Vite 5 开始，它将会回退到 index.html。

注意浏览器将不再在控制台中显示 404 错误消息，如果你将图片路径指向一个不存在的文件（例如 `<img src="./file-does-not-exist.png">`）。

### Align dev and preview HTML serving behaviour {#align-dev-and-preview-html-serving-behaviour}

在 Vite 4 中，开发服务器和预览服务器会根据 HTML 的目录结构和尾部斜杠的不同来提供 HTML。这会导致在测试构建后的应用时出现不一致的情况。Vite 5 重构成了一个单一的行为，如下所示，给定以下文件结构：

```
├── index.html
├── file.html
└── dir
    └── index.html
```

| 请求               | 过往版本 (dev)                | 过往版本 (preview) | 现在 (dev & preview)          |
| ----------------- | ---------------------------- | ----------------- | ---------------------------- |
| `/dir/index.html` | `/dir/index.html`            | `/dir/index.html` | `/dir/index.html`            |
| `/dir`            | `/index.html` (SPA fallback) | `/dir/index.html` | `/index.html` (SPA fallback) |
| `/dir/`           | `/dir/index.html`            | `/dir/index.html` | `/dir/index.html`            |
| `/file.html`      | `/file.html`                 | `/file.html`      | `/file.html`                 |
| `/file`           | `/index.html` (SPA fallback) | `/file.html`      | `/file.html`                 |
| `/file/`          | `/index.html` (SPA fallback) | `/file.html`      | `/index.html` (SPA fallback) |

### Manifest 文件现在默认生成到 `.vite` 目录中 {#manifest-files-are-now-generated-in-vite-directory-by-default}

在 Vite 4 中，manifest 文件（[`build.manifest`](/config/build-options.md#build-manifest)，[`build.ssrManifest`](/config/build-options.md#build-ssrmanifest)）默认会生成在 [`build.outDir`](/config/build-options.md#build-outdir) 的根目录中。

从 Vite 5 开始，这些文件将默认生成在 `build.outDir` 中的 `.vite` 目录中。这个改变有助于解决当公共文件被复制到 `build.outDir` 时，具有相同 manifest 文件名时的冲突。

### 对应的 CSS 文件未在 manifest.json 文件中作为顶级入口列出 {#corresponding-css-files-are-not-listed-as-top-level-entry-in-manifest-json-file}

在 Vite 4 中，JavaScript 入口起点的对应 CSS 文件也被列为了 manifest 文件的顶级入口（[`build.manifest`](/config/build-options.md#build-manifest)）。这些条目是非故意添加的，仅对简单情况有效。

在 Vite 5 中，对应的 CSS 文件只能在 JavaScript 入口起点中找到。
在注入 JS 文件时，对应的 CSS 文件 [应被注入](/guide/backend-integration.md#:~:text=%3C!%2D%2D%20if%20production%20%2D%2D%3E%0A%3Clink%20rel%3D%22stylesheet%22%20href%3D%22/assets/%7B%7B%20manifest%5B%27main.js%27%5D.css%20%7D%7D%22%20/%3E%0A%3Cscript%20type%3D%22module%22%20src%3D%22/assets/%7B%7B%20manifest%5B%27main.js%27%5D.file%20%7D%7D%22%3E%3C/script%3E)。
当需要单独注入 CSS 时，必需将其添加为单独的入口起点。

### CLI 快捷功能键需要一个额外的 `Enter` 按键 {#cli-shortcuts-require-an-additional-enter-press}

CLI 快捷功能键，例如 `r` 重启开发服务器，现在需要额外的 `Enter` 按键来触发快捷功能。例如，`r + Enter` 重启开发服务器。

这个改动防止 Vite 吞噬和控制操作系统特定的快捷键，允许更好的兼容性，当将 Vite 开发服务器与其他进程结合使用时，并避免了[之前的注意事项](https://github.com/vitejs/vite/pull/14342)。

### Update `experimentalDecorators` and `useDefineForClassFields` TypeScript behaviour {#update-experimentaldecorators-and-usedefineforclassfields-typescript-behaviour}

Vite 5 使用 esbuild 0.19 并移除了 esbuild 0.18 的兼容层，这改变了 [`experimentalDecorators`](https://www.typescriptlang.org/tsconfig#experimentalDecorators) 和 [`useDefineForClassFields`](https://www.typescriptlang.org/tsconfig#useDefineForClassFields) 的处理方式。

- **`useDefineForClassFields` 默认不启用**

  你需要在 `tsconfig.json` 中设置 `compilerOptions.experimentalDecorators` 为 `true` 来使用装饰器。

- **`useDefineForClassFields` 默认依赖 TypeScript 的 `target` 值**

  如果 `target` 不是 `ESNext` 或 `ES2022` 或更新的版本，或者没有 `tsconfig.json` 文件，`useDefineForClassFields` 将默认为 `false`，这可能会导致默认的 `esbuild.target` 值 `esnext` 出现问题。它可能会转译为[静态初始化块](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Static_initialization_blocks#browser_compatibility)，这在你的浏览器中可能不被支持。

  因此，建议在配置 `tsconfig.json` 时将 `target` 设置为 `ESNext` 或 `ES2022` 或更新的版本，或者将 `useDefineForClassFields` 显式地设置为 `true`。

```jsonc
{
  "compilerOptions": {
    // 若要使用装饰器就设为 true
    "experimentalDecorators": true,
    // 如果你在浏览器中看到解析错误，请设置为 true
    "useDefineForClassFields": true,
  },
}
```

### 移除 `--https` 标志和 `https: true` {#remove-https-flag-and-https-true}

`--https` 标志会在内部设置 `server.https: true` 和 `preview.https: true`。这个配置本来是为了与自动 https 证书生成功能一起使用的，但是这个功能在[Vite 3 中被移除](https://v3.vitejs.dev/guide/migration.html#automatic-https-certificate-generation)。因此，这个配置已经不再有用，因为它会启动一个没有证书的 Vite HTTPS 服务器。

如果你使用 [`@vitejs/plugin-basic-ssl`](https://github.com/vitejs/vite-plugin-basic-ssl) 或者 [`vite-plugin-mkcert`](https://github.com/liuweiGL/vite-plugin-mkcert)，它们已经在内部设置了 `https` 配置，所以你可以在你的设置中移除 `--https`，`server.https: true`，和`preview.https: true`。

### 移除 `resolvePackageEntry` 和 `resolvePackageData` API {#remove-resolvepackageentry-and-resolvepackagedata-apis}

`resolvePackageEntry` 和 `resolvePackageData` API 已被移除，因为它们暴露了 Vite 的内部机制，并在过去阻碍了 Vite 4.3 的潜在优化。这些 API 可以被第三方包替代，例如：

- `resolvePackageEntry`: [`import.meta.resolve`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import.meta/resolve) 或者 [`import-meta-resolve`](https://github.com/wooorm/import-meta-resolve) 库。
- `resolvePackageData`: 与上述相同，向上爬取包目录以获取根 `package.json`。或者使用社区的 [`vitefu`](https://github.com/svitejs/vitefu) 库。

```js
import { resolve } from 'import-meta-resolve'
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

- CSS 文件的默认导出（例如 `import style from './foo.css'`）：使用 `?inline` 查询参数代替
- `import.meta.globEager`：使用 `import.meta.glob('*', { eager: true })` 来代替
- `ssr.format: 'cjs'` 和 `legacy.buildSsrCjsExternalHeuristics`（[#13816](https://github.com/vitejs/vite/discussions/13816)）
- `server.middlewareMode: 'ssr'` 和 `server.middlewareMode: 'html'`：使用 [`appType`](/config/shared-options.md#apptype) + [`server.middlewareMode: true`](/config/server-options.md#server-middlewaremode) 来代替（[#8452](https://github.com/vitejs/vite/pull/8452)）

## 进阶 {#advanced}

下列改动仅会影响到插件/工具的作者：

- [[#14119] refactor!: merge `PreviewServerForHook` into `PreviewServer` type](https://github.com/vitejs/vite/pull/14119)
  - The `configurePreviewServer` hook now accepts the `PreviewServer` type instead of `PreviewServerForHook` type.
- [[#14818] refactor(preview)!: use base middleware](https://github.com/vitejs/vite/pull/14818)
  - Middlewares added from the returned function in `configurePreviewServer` now does not have access to the `base` when comparing the `req.url` value. This aligns the behaviour with the dev server. You can check the `base` from the `configResolved` hook if needed.
- [[#14834] fix(types)!: expose httpServer with Http2SecureServer union](https://github.com/vitejs/vite/pull/14834)
  - `http.Server | http2.Http2SecureServer` is now used instead of `http.Server` where appropriate.

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
  - `resolve.browserField` 已从 Vite 3 开始被弃用，而是使用 [`resolve.mainFields`](/config/shared-options.md#resolve-mainfields) 的更新默认值 `['browser', 'module', 'jsnext:main', 'jsnext']`。
- [[#14855] feat!: add isPreview to ConfigEnv and resolveConfig](https://github.com/vitejs/vite/pull/14855)
  - 在 `ConfigEnv` 对象中，重命名 `ssrBuild` 为 `isSsrBuild`。
- [[#14945] fix(css): correctly set manifest source name and emit CSS file](https://github.com/vitejs/vite/pull/14945)
  - CSS 文件名现在是基于 chunk 名生成的。

## 从 v3 迁移 {#migration-from-v3}

请先查看 [从 v3 迁移指南](/guide/migration-from-v3) 文档查看对您的应用所有需要迁移的改动，然后再执行本篇指南所述的改动。
