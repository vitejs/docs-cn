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
export default defineConfig(({ command, mode }) => {
  if (command === 'serve') {
    return {
      // serve 独有配置
    }
  } else {
    return {
      // build 独有配置
    }
  }
})
```

### 异步配置 {#async-config}

如果配置需要调用一个异步函数，也可以转而导出一个异步函数：

```js
export default defineConfig(async ({ command, mode }) => {
  const data = await asyncFunction()
  return {
    // 构建模式所需的特有配置
  }
})
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

- **类型：** `string | false`
- **默认：** `"public"`

  作为静态资源服务的文件夹。该目录中的文件在开发期间在 `/` 处提供，并在构建期间复制到 `outDir` 的根目录，并且始终按原样提供或复制而无需进行转换。该值可以是文件系统的绝对路径，也可以是相对于项目的根目录的相对路径。

  将 `publicDir` 设定为 `false` 可以关闭此项功能。
  
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

  如果你在你的应用程序中有相同依赖的副本（比如 monorepos），请使用此选项强制 Vite 始终将列出的依赖项解析为同一副本（从项目根目录）。

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

### resolve.preserveSymlinks {#resolve-preservesymlinks}

- **类型：** `boolean`
- **默认：** `false`

  启用此选项会使 Vite 通过原始文件路径（即不跟随符号链接的路径）而不是真正的文件路径（即跟随符号链接后的路径）确定文件身份。

- **相关：** [esbuild#preserve-symlinks](https://esbuild.github.io/api/#preserve-symlinks)，[webpack#resolve.symlinks](https://webpack.js.org/configuration/resolve/#resolvesymlinks)
### css.modules {#css-modules}

- **类型：**

  ```ts
  interface CSSModulesOptions {
    scopeBehaviour?: 'global' | 'local'
    globalModulePaths?: RegExp[]
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
  export default defineConfig({
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `$injectedColor: orange;`
        }
      }
    }
  })
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
  export default defineConfig({
    esbuild: {
      jsxFactory: 'h',
      jsxFragment: 'Fragment'
    }
  })
  ```

  默认情况下，ESbuild 会被应用在 `ts`、`jsx`、`tsx` 文件。你可以通过 `esbuild.include` 和 `esbuild.exclude` 对要处理的文件类型进行配置，这两个配置的类型应为 `string | RegExp | (string | RegExp)[]`。

  此外，你还可以通过 `esbuild.jsxInject` 来自动为每一个被 ESbuild 转换的文件注入 JSX helper。

  ```js
  export default defineConfig({
    esbuild: {
      jsxInject: `import React from 'react'`
    }
  })
  ```

  设置为 `false` 来禁用 ESbuild 转换。

### assetsInclude {#assetsinclude}

- **类型：** `string | RegExp | (string | RegExp)[]`
- **相关内容：** [静态资源处理](/guide/assets)

  指定额外的 [picomatch 模式](https://github.com/micromatch/picomatch) 作为静态资源处理，因此：

  - 当从 HTML 引用它们或直接通过 `fetch` 或 XHR 请求它们时，它们将被插件转换管道排除在外。

  - 从 JavaScript 导入它们将返回解析后的 URL 字符串（如果你设置了 `enforce: 'pre'` 插件来处理不同的资产类型，这可能会被覆盖）。

  内建支持的资源类型列表可以在 [这里](https://github.com/vitejs/vite/blob/main/packages/vite/src/node/constants.ts) 找到。

  **示例：**

  ```js
  export default defineConfig({
    assetsInclude: ['**/*.gltf']
  })
  ```

### logLevel {#loglevel}

- **类型：** `'info' | 'warn' | 'error' | 'silent'`

  调整控制台输出的级别，默认为 `'info'`。

### clearScreen {#clearscreen}

- **类型：** `boolean`
- **默认：** `true`

  设为 `false` 可以避免 Vite 清屏而错过在终端中打印某些关键信息。命令行模式下可以通过 `--clearScreen false` 设置。

### envDir

- **类型：** `string`
- **默认：** `root`

  用于加载 `.env` 文件的目录。可以是一个绝对路径，也可以是相对于项目根的路径。

  关于环境文件的更多信息，请参见 [这里](/guide/env-and-mode#env-files)。

### envPrefix

- **类型：** `string | string[]`
- **默认：** `VITE_`

  以 `envPrefix` 开头的环境变量会通过 import.meta.env 暴露在你的客户端源码中。

:::warning 安全注意事项

- `envPrefix` 不应该被设置为 `''`，因为这将暴露你所有的环境变量，导致敏感信息的意外泄露。Vite 在检测到 `''` 时将会抛出错误。
  :::
  
## 开发服务器选项 {#server-options}

### server.host {#server-host}

- **类型：** `string`
- **默认：** `'127.0.0.1'`

  指定服务器应该监听哪个 IP 地址。
  如果将此设置为 `0.0.0.0` 将监听所有地址，包括局域网和公网地址。

  也可以通过 CLI 使用 `--host 0.0.0.0` 或 `--host` 来设置。

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

  在开发服务器启动时自动在浏览器中打开应用程序。当此值为字符串时，会被用作 URL 的路径名。若你想指定喜欢的浏览器打开服务器，你可以设置环境变量 `process.env.BROWSER`（例如：`firefox`）。查看 [这个 `open` 包](https://github.com/sindresorhus/open#app) 获取更多细节。

  **示例：**

  ```js
  export default defineConfig({
    server: {
      open: '/docs/index.html'
    }
  })
  ```

### server.proxy {#server-proxy}

- **类型：** `Record<string, string | ProxyOptions>`

  为开发服务器配置自定义代理规则。期望接收一个 `{ key: options }` 对象。如果 key 值以 `^` 开头，将会被解释为 `RegExp`。`configure` 可用于访问 proxy 实例。

  使用 [`http-proxy`](https://github.com/http-party/node-http-proxy)。完整选项详见 [此处](https://github.com/http-party/node-http-proxy#options).

  **示例：**

  ```js
  export default defineConfig({
    server: {
      proxy: {
        // 字符串简写写法
        '/foo': 'http://localhost:4567',
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
        },
        // 使用 proxy 实例
        '/api': {
          target: 'http://jsonplaceholder.typicode.com',
          changeOrigin: true,
          configure: (proxy, options) => {
            // proxy 是 'http-proxy' 的实例
          }
        }
      }
    }
  })
  ```

### server.cors {#server-cors}

- **类型：** `boolean | CorsOptions`

  为开发服务器配置 CORS。默认启用并允许任何源，传递一个 [选项对象](https://github.com/expressjs/cors) 来调整行为或设为 `false` 表示禁用。

### server.force {#server-force}

- **类型：** `boolean`
- **相关内容：** [依赖预构建](/guide/dep-pre-bundling)

  设置为 `true` 强制使依赖预构建。

### server.hmr {#server-hmr}

- **类型：** `boolean | { protocol?: string, host?: string, port?: number, path?: string, timeout?: number, overlay?: boolean, clientPort?: number, server?: Server }`

  禁用或配置 HMR 连接（用于 HMR websocket 必须使用不同的 http 服务器地址的情况）。

  设置 `server.hmr.overlay` 为 `false` 可以禁用开发服务器错误的屏蔽。

  `clientPort` 是一个高级选项，只在客户端的情况下覆盖端口，这允许你为 websocket 提供不同的端口，而并非在客户端代码中查找。如果需要在 dev-server 情况下使用 SSL 代理，这非常有用。

  当使用 `server.middlewareMode` 或 `server.https` 时，你需将 `server.hmr.server` 指定为你 HTTP(S) 的服务器，这将通过你的服务器来处理 HMR 的安全连接请求。这在使用自签证书或想通过网络在某端口暴露 Vite 的情况下，非常有用。

### server.watch {#server-watch}

- **类型：** `object`

  传递给 [chokidar](https://github.com/paulmillr/chokidar#api) 的文件系统监听器选项。

  当需要再 Windows Subsystem for Linux (WSL) 2 上运行 Vite 时，如果项目文件夹位于 Windows 文件系统中，你需要将此选项设置为 `{ usePolling: true }`。这是由于 Windows 文件系统的 [WSL2 限制](https://github.com/microsoft/WSL/issues/4739) 造成的。

### server.middlewareMode {#server-middlewaremode}

- **类型：** `'ssr' | 'html'`

  以中间件模式创建 Vite 服务器。（不含 HTTP 服务器）

  - `'ssr'` 将禁用 Vite 自身的 HTML 服务逻辑，因此你应该手动为 `index.html` 提供服务。
  - `'html'` 将启用 Vite 自身的 HTML 服务逻辑。

- **相关：** [SSR - 设置开发服务器](/guide/ssr#setting-up-the-dev-server)

- **示例：**

```js
const express = require('express')
const { createServer: createViteServer } = require('vite')

async function createServer() {
  const app = express()

  // 以中间件模式创建 Vite 服务器
  const vite = await createViteServer({
    server: { middlewareMode: 'ssr' }
  })
  // 将 vite 的 connect 实例作中间件使用
  app.use(vite.middlewares)

  app.use('*', async (req, res) => {
    // 如果 `middlewareMode` 是 `'ssr'`，应在此为 `index.html` 提供服务.
    // 如果 `middlewareMode` 是 `'html'`，则此处无需手动服务 `index.html`
    // 因为 Vite 自会接管
  })
}

createServer()
```

### server.fs.strict {#server-fs-strict}

- **实验性**
- **类型：** `boolean`
- **默认：** `false` (将在后续版本中改为 `true`)

  限制为工作区 root 路径以外的文件的访问。

### server.fs.allow {#server-fs-allow}

- **实验性**
- **类型：** `string[]`

  限制哪些文件可以通过 `/@fs/` 路径提供服务。当 `server.fs.strict` 设置为 true 时，访问这个目录列表外的文件将会返回 403 结果。

  Vite 将会搜索此根目录下潜在工作空间并作默认使用。一个有效的工作空间应符合以下几个条件，否则会默认以 [项目 root 目录](/guide/#index-html-and-project-root) 作备选方案。

  - 在 `package.json` 中包含 `workspaces` 字段
  - 包含以下几种文件之一
    - `pnpm-workspace.yaml`

  接受一个路径作为自定义工作区的 root 目录。可以是绝对路径或是相对于 [项目 root 目录](/guide/#index-html-and-project-root) 的相对路径。示例如下：

  ```js
  export default defineConfig({
    server: {
      fs: {
        // 可以为项目根目录的上一级提供服务
        allow: ['..']
      }
    }
  })
  ```

  当 `server.fs.allow` 被设置时，工作区根目录的自动检索将被禁用。当需要扩展默认的行为时，你可以使用暴露出来的工具函数 `searchForWorkspaceRoot`：

  ```js
  import { defineConfig, searchForWorkspaceRoot } from 'vite'

  export default defineConfig({
    server: {
      fs: {
        allow: [
          // 搜索工作区的根目录
          searchForWorkspaceRoot(process.cwd()),
          // 自定义规则
          '/path/to/custom/allow'
        ]
      }
    }
  })
  ```

### server.origin {#server-origin}

- **类型：** `string`

用于定义开发调试阶段生成资产的 origin。

```js
export default defineConfig({
  server: {
    origin: 'http://127.0.0.1:8080/'
  }
})
```

## 构建选项 {#build-options}

### build.target {#build-target}

- **类型：** `string | string[]`
- **默认：** `'modules'`
- **相关内容：:** [浏览器兼容性](/guide/build#browser-compatibility)

  设置最终构建的浏览器兼容目标。默认值是一个 Vite 特有的值——`'modules'`，这是指 [支持原生 ES 模块的浏览器](https://caniuse.com/es6-module)。

  另一个特殊值是 “esnext” —— 即假设有原生动态导入支持，并且将会转译得尽可能小：

  - 如果 [`build.minify`](#build-minify) 选项为 `'terser'`， `'esnext'` 将会强制降级为 `'es2019'`。
  - 其他情况下将完全不会执行转译。

  转换过程将会由 esbuild 执行，并且此值应该是一个合法的 [esbuild 目标选项](https://esbuild.github.io/api/#target)。自定义目标也可以是一个 ES 版本（例如：`es2015`）、一个浏览器版本（例如：`chrome58`）或是多个目标组成的一个数组。

  注意：如果代码包含不能被 `esbuild` 安全地编译的特性，那么构建将会失败。查看 [esbuild 文档](https://esbuild.github.io/content-types/#javascript) 获取更多细节。

### build.polyfillModulePreload {#build-polyfillmodulepreload}

- **类型：** `boolean`
- **默认值：** `true`

  用于决定是否自动注入 [module preload 的 polyfill](https://guybedford.com/es-module-preloading-integrity#modulepreload-polyfill).

  如果设置为 `true`，此 polyfill 会被自动注入到每个 `index.html` 入口的 proxy 模块中。如果是通过 `build.rollupOptions.input` 将构建配置为使用非 html 的自定义入口，那么则需要在你自定义入口中手动引入 polyfill：

  ```js
  import 'vite/modulepreload-polyfill'
  ```

  注意：此 polyfill **不适用于** [Library 模式](/guide/build#library-mode)。如果你需要支持不支持动态引入的浏览器，你应该避免在你的库中使用此选项。

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

  :::tip 注意
  如果你指定了 `build.lib`，那么 `build.assetsInlineLimit` 将被忽略，无论文件大小，资源都会被内联。
  :::

### build.cssCodeSplit {#build-csscodesplit}

- **类型：** `boolean`
- **默认：** `true`

  启用/禁用 CSS 代码拆分。当启用时，在异步 chunk 中导入的 CSS 将内联到异步 chunk 本身，并在其被加载时插入。

  如果禁用，整个项目中的所有 CSS 将被提取到一个 CSS 文件中。

### build.sourcemap {#build-sourcemap}

- **类型：** `boolean | 'inline' | 'hidden'`
- **默认：** `false`

  构建后是否生成 source map 文件。如果为 `true`，将会创建一个独立的 source map 文件。如果为 `'inline'`，source map 将作为一个 data URI 附加在输出文件中。`'hidden'` 的工作原理与 `'true'` 相似，只是 bundle 文件中相应的注释将不被保留。

### build.rollupOptions {#build-rollupoptions}

- **类型：** [`RollupOptions`](https://rollupjs.org/guide/en/#big-list-of-options)

  自定义底层的 Rollup 打包配置。这与从 Rollup 配置文件导出的选项相同，并将与 Vite 的内部 Rollup 选项合并。查看 [Rollup 选项文档](https://rollupjs.org/guide/en/#big-list-of-options) 获取更多细节。

### build.commonjsOptions {#build-commonjsoptions}

- **类型：** [`RollupCommonJSOptions`](https://github.com/rollup/plugins/tree/master/packages/commonjs#options)

  传递给 [@rollup/plugin-commonjs](https://github.com/rollup/plugins/tree/master/packages/commonjs) 插件的选项。

### build.dynamicImportVarsOptions {#build-dynamicimportvarsoptions}

- **类型：** [`RollupDynamicImportVarsOptions`](https://github.com/rollup/plugins/tree/master/packages/dynamic-import-vars#options)

  传递给 [@rollup/plugin-dynamic-import-vars](https://github.com/rollup/plugins/tree/master/packages/dynamic-import-vars) 的选项。

### build.lib {#build-lib}

- **类型：** `{ entry: string, name?: string, formats?: ('es' | 'cjs' | 'umd' | 'iife')[], fileName?: string | ((format: ModuleFormat) => string) }`
- **相关内容：** [库模式](/guide/build#library-mode)

  构建为库。`entry` 是必须的因为库不能使用 HTML 作为入口。`name` 则是暴露的全局变量，在 `formats` 包含 `'umd'` 或 `'iife'` 时是必须的。默认 `formats` 是 `['es', 'umd']` 。`fileName` 是输出的包文件名，默认 `fileName` 是 `package.json` 的 `name` 选项，同时，它还可以被定义为参数为 `format` 的函数。

### build.manifest {#build-manifest}

- **类型：** `boolean`
- **默认：** `false`
- **相关内容：** [后端集成](/guide/backend-integration)

  当设置为 `true`，构建后将会生成 `manifest.json` 文件，包含了没有被 hash 的资源文件名和 hash 后版本的映射。可以为一些服务器框架渲染时提供正确的资源引入链接。

### build.ssrManifest {#build-ssrmanifest}

- **类型：** `boolean`
- **默认值：** `false`
- **相关链接：** [Server-Side Rendering](/guide/ssr)

  当设置为 `true` 时，构建也将生成 SSR 的 manifest 文件，以确定生产中的样式链接与资产预加载指令。

### build.minify {#build-minify}

- **类型：** `boolean | 'terser' | 'esbuild'`
- **默认：** `'esbuild'`

  设置为 `false` 可以禁用最小化混淆，或是用来指定使用哪种混淆器。默认为 [Esbuild](https://github.com/evanw/esbuild)，它比 terser 快 20-40 倍，压缩率只差 1%-2%。[Benchmarks](https://github.com/privatenumber/minification-benchmarks)

### build.terserOptions {#build-terseroptions}

- **类型：** `TerserOptions`

  传递给 Terser 的更多 [minify 选项](https://terser.org/docs/api-reference#minify-options)。

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

  如果这两者都不合你意，则可以使用此选项指定自定义条目——该值需要遵循 [fast-glob 模式](https://github.com/mrmlnc/fast-glob#basic-syntax) ，或者是相对于 Vite 项目根的模式数组。这将覆盖掉默认条目推断。

### optimizeDeps.exclude {#optimizedeps-exclude}

- **类型：** `string[]`

  在预构建中强制排除的依赖项。

  :::warning CommonJS
  CommonJS 的依赖不应该排除在优化外。如果一个 ESM 依赖被排除在优化外，但是却有一个嵌套的 CommonJS 依赖，则应该为该 CommonJS 依赖添加 `optimizeDeps.include`。例如：

  ```js
  export default defineConfig({
    optimizeDeps: {
      include: ['esm-dep > cjs-dep']
    }
  })
  ```

  :::

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

- **类型：** `string | RegExp | (string | RegExp)[] | true`

  列出的是防止被 SSR 外部化依赖项。如果设为 `true`，将没有依赖被外部化。

### ssr.target

- **类型：** `'node' | 'webworker'`
- **默认：** `node`

  SSR 服务器的构建目标。
