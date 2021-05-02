# 配置 Vite {#configuring-vite}

## 配置文件 {#config-file}

### 配置文件解析 {#config-file-resolving}

当以命令行方式运行 `vite` 时，Vite 会自动解析 [项目根目录](/guide/#index-html-and-project-root) 下名为 `vite.config.js` 的文件。

最基础的配置文件是这样的：

```js
// vite.config.js
export default {
  // 配置选项
}
```

注意：即使项目没有在 `package.json` 中开启 `type: "module"`，Vite 也支持在配置文件中使用 ESM 语法。这种情况下，配置文件会在被加载前自动进行预处理。

你可以显式地通过 `--config` 命令行选项指定一个配置文件（相对于 `cwd` 路径进行解析）

```bash
vite --config my-config.js
```

### 配置智能提示 {#config-intellisense}

因为 Vite 本身附带 Typescript 类型，所以你可以通过 IDE 和 jsdoc 的配合来实现智能提示：

```js
/**
 * @type {import('vite').UserConfig}
 */
const config = {
  // ...
}

export default config
```

另外你可以使用 `defineConfig` 工具函数，这样不用 jsdoc 注解也可以获取类型提示：

```js
import { defineConfig } from 'vite'

export default defineConfig({
  // ...
})
```

Vite 也直接支持 TS 配置文件。你可以在 `vite.config.ts` 中使用 `defineConfig` 工具函数。

### 情景配置 {#conditional-config}

如果配置文件需要基于（`serve` 或 `build`）命令或者不同的 [模式](/guide/env-and-mode) 来决定选项，则可以选择导出这样一个函数：

```js
export default ({ command, mode }) => {
  if (command === 'serve') {
    return {
      // serve 独有配置
    }
  } else {
    return {
      // build 独有配置
    }
  }
}
```

### 异步配置 {#async-config}

如果配置需要调用一个异步函数，也可以转而导出一个异步函数：

```js
export default async ({ command, mode }) => {
  const data = await asyncFunction()
  return {
    // 构建模式所需的特有配置
  }
}
```

## 共享配置 {#shared-options}

### root {#root}

- **类型：** `string`
- **默认：** `process.cwd()`

  项目根目录（`index.html` 文件所在的位置）。可以是一个绝对路径，或者一个相对于该配置文件本身的相对路径。

  更多细节请见 [项目根目录](/guide/#index-html-and-project-root)。

### base {#base}

- **类型：** `string`
- **默认：** `/`

  开发或生产环境服务的公共基础路径。合法的值包括以下几种：

  - 绝对 URL 路径名，例如 `/foo/`
  - 完整的 URL，例如 `https://foo.com/`
  - 空字符串或 `./`（用于开发环境）

  更多信息详见 [公共基础路径](/guide/build#public-base-path)。

### mode {#mode}

- **类型：** `string`
- **默认：** `'development'`（开发模式），`'production'`（生产模式）

  在配置中指明将会把 **serve 和 build** 时的模式 **都** 覆盖掉。也可以通过命令行 `--mode` 选项来重写。

  查看 [环境变量与模式](/guide/env-and-mode) 章节获取更多细节。

### define {#define}

- **类型：** `Record<string, string>`

  定义全局常量替换方式。其中每项在开发环境下会被定义在全局，而在构建时被静态替换。

  - 从 `2.0.0-beta.70` 版本开始，字符串值将直接作为一个表达式，所以如果定义为了一个字符串常量，它需要被显式地引用（例如：通过 `JSON.stringify`）。

  - 替换只会在匹配到周围是单词边界（`\b`）时执行。

  因为它是不经过任何语法分析，直接替换文本实现的，所以我们建议只对 CONSTANTS 使用 `define`。

  例如，`process.env.FOO` 和 `__APP_VERSION__` 就非常适合。但 `process` 或 `global` 不应使用此选项。变量相关应使用 shim 或 polyfill 代替。

### plugins {#plugins}

- **类型：** ` (Plugin | Plugin[])[]`

  需要用到的插件数组。Falsy 虚值的插件将被忽略，插件数组将被扁平化（flatten）。查看 [插件 API](/guide/api-plugin) 获取 Vite 插件的更多细节。

### publicDir {#publicdir}

- **类型：** `string`
- **默认：** `"public"`

  作为静态资源服务的文件夹。该目录中的文件在开发期间在 `/` 处提供，并在构建期间复制到 `outDir` 的根目录，并且始终按原样提供或复制而无需进行转换。该值可以是文件系统的绝对路径，也可以是相对于项目的根目录的相对路径。

  欲了解更多，请参阅 [`public` 目录](/guide/assets#the-public-directory)。

### cacheDir {#cachedir}

- **类型：** `string`
- **默认：** `"node_modules/.vite"`

  存储缓存文件的目录。此目录下会存储预打包的依赖项或 vite 生成的某些缓存文件，使用缓存可以提高性能。如需重新生成缓存文件，你可以使用 `--force` 命令行选项或手动删除目录。此选项的值可以是文件的绝对路径，也可以是以项目根目录为基准的相对路径。

### resolve.alias {#resolve-alias}

- **类型：**
  `Record<string, string> | Array<{ find: string | RegExp, replacement: string }>`

  将会被传递到 `@rollup/plugin-alias` 作为 [entries 的选项](https://github.com/rollup/plugins/tree/master/packages/alias#entries)。也可以是一个对象，或一个 `{ find, replacement }` 的数组。

  当使用文件系统路径的别名时，请始终使用绝对路径。相对路径的别名值会原封不动地被使用，因此无法被正常解析。

  更高级的自定义解析方法可以通过 [插件](/guide/api-plugin) 实现。

### resolve.dedupe {#resolve-dedupe}

- **类型：** `string[]`

  如果你在你的应用程序中有相同依赖的副本（比如 monorepos），请使用此选项强制 Vite 始终将列出的依赖项解析为同一副本
  （从项目根目录）。

### resolve.conditions {#resolve-conditions}

- **类型：** `string[]`

  解决程序包中 [情景导出](https://nodejs.org/api/packages.html#packages_conditional_exports) 时的其他允许条件。

  一个带有情景导出的包可能在它的 `package.json` 中有以下 `exports` 字段：

  ```json
  {
    "exports": {
      ".": {
        "import": "./index.esm.js",
        "require": "./index.cjs.js"
      }
    }
  }
  ```

  在这里，`import` 和 `require` 被称为“情景”。情景可以嵌套，并且应该从最特定的到最不特定的指定。

  Vite 有一个“允许的情景”列表，并且会匹配列表中第一个情景。默认允许的情景是：`import`，`module`，`browser`，`default` 和基于当前情景为 `production/development`。`resolve.conditions` 配置项使得我们可以指定其他允许的情景。

### resolve.mainFields {#resolve-mainfields}

- **类型：** `string[]`
- **默认：** `['module', 'jsnext:main', 'jsnext']`

  `package.json` 中，在解析包的入口点时尝试的字段列表。注意：这比从 `exports` 字段解析的情景导出优先级低：如果一个入口点从 `exports` 成功解析，`resolve.mainFields` 将被忽略。

### resolve.extensions {#resolve-extensions}

- **类型：** `string[]`
- **默认：** `['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json']`

  导入时想要省略的扩展名列表。注意，**不** 建议忽略自定义导入类型的扩展名（例如：`.vue`），因为它会影响 IDE 和类型支持。

### css.modules {#css-modules}

- **类型：**

  ```ts
  interface CSSModulesOptions {
    scopeBehaviour?: 'global' | 'local'
    globalModulePaths?: string[]
    generateScopedName?:
      | string
      | ((name: string, filename: string, css: string) => string)
    hashPrefix?: string
    /**
     * 默认：'camelCaseOnly'
     */
    localsConvention?: 'camelCase' | 'camelCaseOnly' | 'dashes' | 'dashesOnly'
  }
  ```

  配置 CSS modules 的行为。选项将被传递给 [postcss-modules](https://github.com/css-modules/postcss-modules)。

### css.postcss {#css-postcss}

- **类型：** `string | (postcss.ProcessOptions & { plugins?: postcss.Plugin[] })`

  内联的 PostCSS 配置（格式同 `postcss.config.js`），或者一个（默认基于项目根目录的）自定义的 PostCSS 配置路径。其路径搜索是通过 [postcss-load-config](https://github.com/postcss/postcss-load-config) 实现的。

  注意：如果提供了该内联配置，Vite 将不会搜索其他 PostCSS 配置源。

### css.preprocessorOptions {#css-preprocessoroptions}

- **类型：** `Record<string, object>`

  指定传递给 CSS 预处理器的选项。例如:

  ```js
  export default {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `$injectedColor: orange;`
        }
      }
    }
  }
  ```

### json.namedExports {#json-namedexports}

- **类型：** `boolean`
- **默认：** `true`

  是否支持从 `.json` 文件中进行按名导入。

### json.stringify {#json-stringify}

- **类型：** `boolean`
- **默认：** `false`

  若设置为 `true`，导入的 JSON 会被转换为 `export default JSON.parse("...")`，这样会比转译成对象字面量性能更好，尤其是当 JSON 文件较大的时候。

  开启此项，则会禁用按名导入。

### esbuild {#esbuild}

- **类型：** `ESBuildOptions | false`

  `ESBuildOptions` 继承自 [ESbuild 转换选项](https://esbuild.github.io/api/#transform-api)。最常见的用例是自定义 JSX：

  ```js
  export default {
    esbuild: {
      jsxFactory: 'h',
      jsxFragment: 'Fragment'
    }
  }
  ```

  默认情况下，ESbuild 会被应用在 `ts`、`jsx`、`tsx` 文件。你可以通过 `esbuild.include` 和 `esbuild.exclude` 对其进行配置，它们两个配置的类型是`string | RegExp | (string | RegExp)[]`。

  此外，你还可以通过 `esbuild.jsxInject` 来自动为每一个被 ESbuild 转换的文件注入 JSX helper。

  ```js
  export default {
    esbuild: {
      jsxInject: `import React from 'react'`
    }
  }
  ```

  设置为 `false` 来禁用 ESbuild 转换。

### assetsInclude {#assetsinclude}

- **类型：** `string | RegExp | (string | RegExp)[]`
- **相关内容：** [静态资源处理](/guide/assets)

  指定其他文件类型作为静态资源处理，因此：

  - 当从 HTML 引用它们或直接通过 `fetch` 或 XHR 请求它们时，它们将被插件转换管道排除在外。

  - 从 JavaScript 导入它们将返回解析后的 URL 字符串（如果你设置了 `enforce: 'pre'` 插件来处理不同的资产类型，这可能会被覆盖）。

  内建支持的资源类型列表可以在 [这里](https://github.com/vitejs/vite/blob/main/packages/vite/src/node/constants.ts) 找到。

### logLevel {#loglevel}

- **类型：** `'info' | 'warn' | 'error' | 'silent'`

  调整控制台输出的级别，默认为 `'info'`。

### clearScreen {#clearscreen}

- **类型：** `boolean`
- **默认：** `true`

  设为 `false` 可以避免 Vite 清屏而错过在终端中打印某些关键信息。命令行模式下可以通过 `--clearScreen false` 设置。

## 开发服务器选项 {#server-options}

### server.host {#server-host}

- **类型：** `string`

  指定开发服务器主机名。

### server.port {#server-port}

- **类型：** `number`

  指定开发服务器端口。注意：如果端口已经被使用，Vite 会自动尝试下一个可用的端口，所以这可能不是开发服务器最终监听的实际端口。

### server.strictPort {#server-strictport}

- **类型：** `boolean`

  设为 `true` 时若端口已被占用则会直接退出，而不是尝试下一个可用端口。

### server.https {#server-https}

- **类型：** `boolean | https.ServerOptions`

  启用 TLS + HTTP/2。注意：当 [`server.proxy` 选项](#server-proxy) 也被使用时，将会仅使用 TLS。

  这个值也可以是一个传递给 `https.createServer()` 的 [选项对象](https://nodejs.org/api/https.html#https_https_createserver_options_requestlistener)。

### server.open {#server-open}

- **类型：** `boolean | string`

  在开发服务器启动时自动在浏览器中打开应用程序。当此值为字符串时，会被用作 URL 的路径名。

  **示例：**

  ```js
  export default {
    server: {
      open: '/docs/index.html'
    }
  }
  ```

### server.proxy {#server-proxy}

- **类型：** `Record<string, string | ProxyOptions>`

  为开发服务器配置自定义代理规则。期望接收一个 `{ key: options }` 对象。如果 key 值以 `^` 开头，将会被解释为 `RegExp`。

  使用 [`http-proxy`](https://github.com/http-party/node-http-proxy)。完整选项详见 [此处](https://github.com/http-party/node-http-proxy#options).

  **示例：**

  ```js
  export default {
    server: {
      proxy: {
        // 字符串简写写法
        '/foo': 'http://localhost:4567/foo',
        // 选项写法
        '/api': {
          target: 'http://jsonplaceholder.typicode.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '')
        },
        // 正则表达式写法
        '^/fallback/.*': {
          target: 'http://jsonplaceholder.typicode.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/fallback/, '')
        }
      }
    }
  }
  ```

### server.cors {#server-cors}

- **类型：** `boolean | CorsOptions`

  为开发服务器配置 CORS。默认启用并允许任何源，传递一个 [选项对象](https://github.com/expressjs/cors) 来调整行为或设为 `false` 表示禁用。

### server.force {#server-force}

- **类型：** `boolean`
- **相关内容：** [依赖预构建](/guide/dep-pre-bundling)

  设置为 `true` 强制使依赖预构建。

### server.hmr {#server-hmr}

- **类型：** `boolean | { protocol?: string, host?: string, port?: number, path?: string, timeout?: number, overlay?: boolean }`

  禁用或配置 HMR 连接（用于 HMR websocket 必须使用不同的 http 服务器地址的情况）。

  设置 `server.hmr.overlay` 为 `false` 可以禁用开发服务器错误的屏蔽。

### server.watch {#server-watch}

- **类型：** `object`

  传递给 [chokidar](https://github.com/paulmillr/chokidar#api) 的文件系统监听器选项。

## 构建选项 {#build-options}

### build.target {#build-target}

- **类型：** `string`
- **默认：** `'modules'`
- **相关内容：:** [浏览器兼容性](/guide/build#browser-compatibility)

  设置最终构建的浏览器兼容目标。默认值是一个 Vite 特有的值——`'modules'`，这是指 [支持原生 ES 模块的浏览器](https://caniuse.com/es6-module)。

  另一个特殊值是 “esnext” —— 即指执行 minify 转换（作最小化压缩）并假设有原生动态导入支持。

  转换过程将会由 esbuild 执行，并且此值应该是一个合法的 [esbuild 目标选项](https://esbuild.github.io/api/#target)。自定义目标也可以是一个 ES 版本（例如：`es2015`）、一个浏览器版本（例如：`chrome58`）或是多个目标组成的一个数组。

  注意：如果代码包含不能被 `esbuild` 安全地编译的特性，那么构建将会失败。查看 [esbuild 文档](https://esbuild.github.io/content-types/#javascript) 获取更多细节。

### build.polyfillDynamicImport {#build-polyfilldynamicimport}

- **类型：** `boolean`
- **默认：** `true` unless `build.target` is `'esnext'`

  决定是否自动注入 [对动态导入的 polyfill](https://github.com/GoogleChromeLabs/dynamic-import-polyfill)。

  该 polyfill 将被自动注入进每个 `index.html` 入口的代理模块中。如果某次构建通过 `build.rollupOptions.input` 选项配置成了使用非 HTML 的自定义入口，则有必要在你的自定义入口中手动引入此 polyfill：

  ```js
  import 'vite/dynamic-import-polyfill'
  ```

  注意：该 polyfill **不会** 应用于 [库模式](/guide/build#library-mode)。如果你需要支持不含原生动态导入功能的浏览器，可能要避免在你的库中使用它。

### build.outDir {#build-outdir}

- **类型：** `string`
- **默认：** `dist`

  指定输出路径（相对于 [项目根目录](/guide/#index-html-and-project-root)).

### build.assetsDir {#build-assetsdir}

- **类型：** `string`
- **默认：** `assets`

  指定生成静态资源的存放路径（相对于 `build.outDir`）。

### build.assetsInlineLimit {#build-assetsinlinelimit}

- **类型：** `number`
- **默认：** `4096` (4kb)

  小于此阈值的导入或引用资源将内联为 base64 编码，以避免额外的 http 请求。设置为 `0` 可以完全禁用此项。

### build.cssCodeSplit {#build-csscodesplit}

- **类型：** `boolean`
- **默认：** `true`

  启用/禁用 CSS 代码拆分。当启用时，在异步 chunk 中导入的 CSS 将内联到异步 chunk 本身，并在其被加载时插入。

  如果禁用，整个项目中的所有 CSS 将被提取到一个 CSS 文件中。

### build.sourcemap {#build-sourcemap}

- **类型：** `boolean | 'inline'`
- **默认：** `false`

  构建后是否生成 source map 文件。

### build.rollupOptions {#build-rollupoptions}

- **类型：** [`RollupOptions`](https://rollupjs.org/guide/en/#big-list-of-options)

  自定义底层的 Rollup 打包配置。这与从 Rollup 配置文件导出的选项相同，并将与 Vite 的内部 Rollup 选项合并。查看 [Rollup 选项文档](https://rollupjs.org/guide/en/#big-list-of-options) 获取更多细节。

### build.commonjsOptions {#build-commonjsoptions}

- **类型：** [`RollupCommonJSOptions`](https://github.com/rollup/plugins/tree/master/packages/commonjs#options)

  传递给 [@rollup/plugin-commonjs](https://github.com/rollup/plugins/tree/master/packages/commonjs) 插件的选项。

### build.lib {#build-lib}

- **类型：** `{ entry: string, name?: string, formats?: ('es' | 'cjs' | 'umd' | 'iife')[], fileName?: string }`
- **相关内容：** [Library Mode](/guide/build#library-mode)

  构建为库。`entry` 是必须的因为库不能使用 HTML 作为入口。`name` 则是暴露的全局变量，在 `formats` 包含 `'umd'` 或 `'iife'` 时是必须的。默认 `formats` 是 `['es', 'umd']` 。`fileName` 是输出的包文件名，默认 `fileName` 是 `package.json` 的 `name` 选项。

### build.manifest {#build-manifest}

- **类型：** `boolean`
- **默认：** `false`
- **相关内容：** [后端集成](/guide/backend-integration)

  当设置为 `true`，构建后将会生成 `manifest.json` 文件，映射没有被 hash 的资源文件名和它们的 hash 版本。可以为一些服务器框架渲染时提供正确的资源引入链接。

### build.minify {#build-minify}

- **类型：** `boolean | 'terser' | 'esbuild'`
- **默认：** `'terser'`

  设置为 `false` 可以禁用最小化混淆，或是用来指定使用哪种混淆器。默认为 [Terser](https://github.com/terser/terser)，虽然 Terser 相对较慢，但大多数情况下构建后的文件体积更小。ESbuild 最小化混淆更快但构建后的文件相对更大。

### build.terserOptions {#build-terseroptions}

- **类型：** `TerserOptions`

  传递给 Terser 的更多 [minify 选项](https://terser.org/docs/api-reference#minify-options)。

### build.cleanCssOptions {#build-cleancssoptions}

- **类型：** `CleanCSS.Options`

  传递给 [clean-css](https://github.com/jakubpawlowicz/clean-css#constructor-options) 的构造器选项。

### build.write {#build-write}

- **类型：** `boolean`
- **默认：** `true`

  设置为 `false` 来禁用将构建后的文件写入磁盘。这常用于 [编程式地调用 `build()`](/guide/api-javascript#build) 在写入磁盘之前，需要对构建后的文件进行进一步处理。

### build.emptyOutDir {#build-emptyoutdir}

- **类型：** `boolean`
- **默认：** 若 `outDir` 在 `root` 目录下，则为 `true`

  默认情况下，若 `outDir` 在 `root` 目录下，则 Vite 会在构建时清空该目录。若 `outDir` 在根目录之外则会抛出一个警告避免意外删除掉重要的文件。可以设置该选项来关闭这个警告。该功能也可以通过命令行参数 `--emptyOutDir` 来使用。

### build.brotliSize {#build-brotlisize}

- **类型：** `boolean`
- **默认：** `true`

  启用/禁用 brotli 压缩大小报告。压缩大型输出文件可能会很慢，因此禁用该功能可能会提高大型项目的构建性能。

### build.chunkSizeWarningLimit {#build-chunksizewarninglimit}

- **类型：** `number`
- **默认：** `500`

  chunk 大小警告的限制（以 kbs 为单位）。

### build.watch {#build-watch}

- **类型：** [`WatcherOptions`](https://rollupjs.org/guide/en/#watch-options)`| null`
- **默认：** `null`

  设置为 `{}` 则会启用 rollup 的监听器。在涉及只用在构建时的插件时和集成开发流程中很常用。

## 依赖优化选项 {#dep-optimization-options}

- **相关内容：** [依赖预构建](/guide/dep-pre-bundling)

### optimizeDeps.entries {#optimizedeps-entries}

- **类型：** `string | string[]`

  默认情况下，Vite 会抓取你的 index.html 来检测需要预构建的依赖项。如果指定了 `build.rollupOptions.input`，Vite 将转而去抓取这些入口点。

  如果这两者都不合你意，则可以使用此选项指定自定义条目——该值需要遵循 [fast-glob 模式](https://github.com/mrmlnc/fast-glob#basic-syntax) ，或者是相对于 vite 项目根的模式数组。这将覆盖掉默认条目推断。

### optimizeDeps.exclude {#optimizedeps-exclude}

- **类型：** `string[]`

  在预构建中强制排除的依赖项。

### optimizeDeps.include {#optimizedeps-include}

- **类型：** `string[]`

  默认情况下，不在 `node_modules` 中的，链接的包不会被预构建。使用此选项可强制预构建链接的包。

### optimizeDeps.keepNames {#optimizedeps-keepnames}

- **类型：** `boolean`
- **默认：** `false`

  打包器有时需要重命名符号以避免冲突。
  设置此项为 `true` 可以在函数和类上保留 `name` 属性。
  若想获取更多详情，请参阅 [`keepNames`](https://esbuild.github.io/api/#keep-names)

## SSR 选项 {#ssr-options}

:::warning 实验性
SSR 选项可能会在未来版本中进行调整。
:::

- **相关：** [SSR 外部化](/guide/ssr#ssr-externals)

### ssr.external {#ssr-external}

- **类型：** `string[]`

  列出的是要为 SSR 强制外部化的依赖。

### ssr.noExternal {#ssr-noexternal}

- **类型：** `string[]`

  列出的是防止被 SSR 外部化依赖项。
