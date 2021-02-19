# 配置 Vite

## 配置文件

### 配置文件解析

当以命令行方式运行 `vite` 时，Vite 会自动解析 [项目根目录](/guide/#index-html-与项目根目录) 下名为 `vite.config.js` 的文件。

最基础的配置文件是这样的：

```js
// vite.config.js
export default {
  // 配置选项
}
```

注意，即使项目没有在 `package.json` 中开启 `type: "module"` ，Vite 也支持在配置文件中使用 ESM 语法。在这种情况下，配置文件是在加载之前自动预处理的。

你可以显式地通过 `--config` 命令行选项指定一个配置文件（解析会相对于 `cwd` 路径）

```bash
vite --config my-config.js
```

### 配置智能提示

因为 Vite 本身附带 Typescript 类型，所以你可以通过 IDE 和 jsdoc 的配合来进行智能提示：

```js
/**
 * @type {import('vite').UserConfig}
 */
const config = {
  // ...
}

export default config
```

另外你可以使用 `defineConfig` 帮手函数，这样不用 jsdoc 注解也可以获取类型提示：

```js
import { defineConfig } from 'vite'

export default defineConfig({
  // ...
})
```

Vite 也直接支持 TS 配置文件。你可以在 `vite.config.ts` 中使用 `defineConfig` 帮手函数。

### 情景配置

如果配置文件需要基于命令（`serve` 或 `build`）或者不同场景与 [模式](/guide/env-and-mode) 来决定选项，可以选择导出这样一个函数：

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

## 共享配置

### root

- **类型：** `string`
- **默认：** `process.cwd()`

  项目根目录（`index.html` 文件所在的位置）。可以是一个绝对路径，或者一个相对于该配置文件本身的路径。

  更多细节请见 [项目根目录](/guide/#项目根目录)。

### base

- **类型：** `string`
- **默认：** `/`

  开发或生产环境服务的 公共基础路径。合法的值包括以下几种：

  - 绝对 URL 路径名，例如 `/foo/`
  - 完整的 URL，例如 `https://foo.com/`
  - 空字符串或 `./`（用于开发环境）

  更多信息详见 [公共基础路径](/guide/build#公共基础路径)。

### mode

- **类型：** `string`
- **默认：** serve 时默认 `'development'`，build 时默认 `'production'`

  在配置中指明将会把 **serve 和 build** 时的模式 **都** 覆盖掉。也可以通过命令行 `--mode` 选项来重写。

  查看 [环境变量与模式](/guide/env-and-mode) 章节获取更多细节。

### define

- **类型：** `Record<string, string>`

  定义全局变量替换方式。每项在开发时会被定义为全局变量，而在构建时则是静态替换。

  - 从 `2.0.0-beta.70` 版本开始，字符串值将作为一个直接的表达式，所以如果定义为了一个字符串常量，它需要被显式地引用（例如：通过 `JSON.stringify`）。

  - 替换只会在匹配到周围是单词边界（`\b`）时执行。

### plugins

- **类型：** ` (Plugin | Plugin[])[]`

  将要用到的插件数组。查看 [插件 API](/guide/api-plugin) 获取 Vite 插件的更多细节。

### publicDir

- **类型：** `string`
- **默认：** `"public"`

  作为静态资源服务的文件夹。这个目录中的文件会再开发中被服务于 `/`，在构建时，会被拷贝到 `outDir` 根目录，并没有转换，永远只是复制到这里。该值可以是文件系统的绝对路径，也可以是相对于项目根的路径。

### resolve.alias

- **类型：**

  `Record<string, string> | Array<{ find: string | RegExp, replacement: string }>`

  将会被传递到 `@rollup/plugin-alias` 作为它的 [entries](https://github.com/rollup/plugins/tree/master/packages/alias#entries)。也可以是一个对象，或一个 `{ find, replacement }` 的数组.

  当使用文件系统路径的别名时，请始终使用绝对路径。相对路径作别名值将按原样使用导致不会解析到文件系统路径中。

  更高级的自定义解析方法可以通过 [插件](/guide/api-plugin) 实现。

### resolve.dedupe

- **类型：** `string[]`

  如果你在你的应用程序中有相同依赖的副本（比如 monorepos），使用这个选项来强制 Vite 总是将列出的依赖关系解析到相同的副本（从项目根目录)。

### resolve.conditions

- **类型：** `string[]`

  在解析包的 [情景导出](https://nodejs.org/api/packages.html#packages_conditional_exports) 时允许的附加条件。

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

  Vite 有一个“允许的情景”列表和并且会匹配列表中第一个情景。默认允许的情景是：`import`，`module`，`browser`，`default`，和基于当前情景为 `production/development`。`resolve.conditions` 配置项使得可以指定其他允许的情景。

### resolve.mainFields

- **类型：** `string[]`
- **默认：**: `['module', 'jsnext:main', 'jsnext']`

  `package.json` 中，在解析包的入口点时尝试的字段列表。注意，这比从 `exports` 字段解析的情景导出优先级低：如果一个入口点从 `exports` 成功解析，主字段将被忽略。

### resolve.extensions

- **类型：** `string[]`
- **默认：**: `['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json']`

  导入时想要省略的扩展名列表。注意，**不** 建议忽略自定义导入类型的扩展名（例如：`.vue`），因为它会干扰 IDE 和类型支持。

### css.modules

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

### css.postcss

- **类型：** `string | (postcss.ProcessOptions & { plugins?: postcss.Plugin[] })`

  内联的 PostCSS 配置（格式同 `postcss.config.js`），或者一个（默认基于项目根目录的）自定义的 PostCSS 配置路径。其路径搜索是通过 [postcss-load-config](https://github.com/postcss/postcss-load-config) 实现的。

  注意，如果提供了该内联配置，Vite 将不会搜索其他 PostCSS 配置源。

### css.preprocessorOptions

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

### json.namedExports

- **类型：** `boolean`
- **默认：** `true`

  是否支持从 `.json` 文件中进行按名导入。

### json.stringify

- **类型：** `boolean`
- **默认：** `false`

  若设置为 `true`，导入的 JSON 会被转换为 `export default JSON.parse("...")` 会比转译成对象字面量性能更好，尤其是当 JSON 文件较大的时候。

  开启此项，则会禁用按名导入。

### esbuild

- **类型：** `ESBuildOptions | false`

  `ESBuildOptions` 继承自 [esbuild 转换选项](https://esbuild.github.io/api/#transform-api)。最常见的用例是自定义 JSX：

  ```js
  export default {
    esbuild: {
      jsxFactory: 'h',
      jsxFragment: 'Fragment'
    }
  }
  ```

  默认情况下，ESbuild 应用在 `ts`、`jsx`、`tsx` 文件。你可以通过 `esbuild.include` 和 `esbuild.exclude` 对其进行配置，它们两个配置的类型是`string | RegExp | (string | RegExp)[]`。

  设置成 `false` 可以禁用 ESbuild 转换（默认应用于 `.ts`. `.tsx` 和 `.jsx` 文件）。

  此外，你还可以通过`esbuild.jsxInject`来自动为每一个被 ESbuild 转换的文件注入 JSX helper。

  ```js
  export default {
    esbuild: {
      jsxInject: `import React from 'react'`
    }
  }
  ```

### assetsInclude

- **类型：** `string | RegExp | (string | RegExp)[]`
- **相关内容：** [静态资源处理](/guide/assets)

  指定其他文件类型作为静态资源处理（这样导入它们就会返回解析后的 URL）

### logLevel

- **类型：** `'info' | 'warn' | 'error' | 'silent'`

  调整控制台输出的级别，默认为 `'info'`。

### clearScreen

- **类型：** `boolean`
- **默认：** `true`

  设为 `false` 可以避免 Vite 清屏而错过在终端中打印某些关键信息。命令行模式下请通过 `--clearScreen false` 设置。

## Server Options

### server.host

- **类型：** `string`

  指定服务器主机名

### server.port

- **类型：** `number`

  指定服务器端口。注意：如果端口已经被使用，Vite 会自动尝试下一个可用的端口，所以这可能不是服务器最终监听的实际端口。

### server.strictPort

- **类型：** `boolean`

  设为 `true` 时若端口已被占用则会直接退出，而不是尝试下一个可用端口。

### server.https

- **类型：** `boolean | https.ServerOptions`

  启用 TLS + HTTP/2。注意当 [`server.proxy` option](#server-proxy) 也被使用时，将会仅使用 TLS。

  这个值也可以是一个传递给 `https.createServer()` 的 [选项对象](https://nodejs.org/api/https.html#https_https_createserver_options_requestlistener)。

### server.open

- **类型：** `boolean | string`

  在服务器启动时自动在浏览器中打开应用程序。当此值为字符串时，会被用作 URL 的路径名。

  **示例：**

  ```js
  export default {
    server: {
      open: '/docs/index.html'
    }
  }
  ```

### server.proxy

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

### server.cors

- **类型：** `boolean | CorsOptions`

  为开发服务器配置 CORS。默认启用并允许任何源，传递一个 [选项对象](https://github.com/expressjs/cors) 来调整行为或设为 `false` 表示禁用。

### server.force

- **类型：** `boolean`
- **相关内容：** [Dependency Pre-Bundling](/guide/dep-pre-bundling)

  设置为 `true` 强制使依赖预构建。

### server.hmr

- **类型：** `boolean | { protocol?: string, host?: string, port?: number, path?: string, timeout?: number, overlay?: boolean }`

  禁用或配置 HMR 连接（用于 HMR websocket 必须使用不同的 http 服务器地址的情况）。

  设置 `server.hmr.overlay` 为 `false` 可以禁用服务器错误遮罩层。

### server.watch

- **类型：** `object`

  传递给 [chokidar](https://github.com/paulmillr/chokidar#api) 的文件系统监视器选项。

## Build Options

### build.target

- **类型：** `string`
- **默认：** `es2020`
- **相关内容：:** [浏览器兼容性](/guide/build#浏览器兼容性)

  设置最终构建的浏览器兼容目标。默认值是一个 Vite 特有的值，`'modules'`，这是指 [支持原生 ES 模块的浏览器](https://caniuse.com/es6-module)。

  另一个特殊值是 “esnext” —— 即指执行 minify 转换（作最小化压缩）并假设有原生动态导入支持。

  转换过程将会由 esbuild 执行，并且此值应该是一个合法的 [esbuild 目标选项](https://esbuild.github.io/api/#target)。自定义目标也可以是一个 ES 版本（例如：`es2015`）、一个浏览器版本（例如：`chrome58`）或是多个目标组成的一个数组。

  注意，如果代码包含不能被 `esbuild` 安全地编译的特性，那么构建将会失败。查看 [esbuild 文档](https://esbuild.github.io/api/#target) 获取更多细节。

### build.outDir

- **类型：** `string`
- **默认：** `dist`

  指定输出路径（相对于 [项目根目录](/guide/#项目根目录)).

### build.assetsDir

- **类型：** `string`
- **默认：** `assets`

  指定生成静态资源的存放路径（相对于 `build.outDir`）。

### build.assetsInlineLimit

- **类型：** `number`
- **默认：** `4096` (4kb)

  小于此阈值的导入或引用资源将内联为 base64 编码，以避免额外的 http 请求。设置为 `0` 可以完全禁用此项。

### build.cssCodeSplit

- **类型：** `boolean`
- **默认：** `true`

  启用/禁用 CSS 代码拆分。当启用时，在异步 chunk 中导入的 CSS 将内联到异步 chunk 本身，并在块加载时插入。

  如果禁用，整个项目中的所有 CSS 将被提取到一个 CSS 文件中。

### build.sourcemap

- **类型：** `boolean`
- **默认：** `false`

  构建后是否生成 source map 文件。

### build.rollupOptions

- **类型：** [`RollupOptions`](https://rollupjs.org/guide/en/#big-list-of-options)

  自定义底层的 Rollup 打包配置。这与从 Rollup 配置文件导出的选项相同，并将与 Vite 的内部 Rollup 选项合并。查看 [Rollup 选项文档](https://rollupjs.org/guide/en/#big-list-of-options) 获取更多细节。

### build.commonjsOptions

- **类型：** [`RollupCommonJSOptions`](https://github.com/rollup/plugins/tree/master/packages/commonjs#options)

  传递给 [@rollup/plugin-commonjs](https://github.com/rollup/plugins/tree/master/packages/commonjs) 插件的选项。

### build.lib

- **类型：** `{ entry: string, name?: string, formats?: ('es' | 'cjs' | 'umd' | 'iife')[] }`
- **相关内容：** [Library Mode](/guide/build#库模式)

  构建为库。`entry` 是必须的因为库不可以使用 HTML 作为入口。`name` 则是暴露的全局变量，并且在 `formats` 包含 `'umd'` 或 `'iife'` 时是必须的。默认 `formats` 是 `['es', 'umd']`。

### build.manifest

- **类型：** `boolean`
- **默认：** `false`
- **相关内容：** [后端集成](/guide/backend-integration)

  当设置为 `true`，构建后将会生成 `manifest.json` 文件，映射没有被 hash 的资源文件名和它们的 hash 版本。可以为一些服务器框架渲染时提供正确的资源引入链接。

### build.minify

- **类型：** `boolean | 'terser' | 'esbuild'`
- **默认：** `'terser'`

  设置为 `false` 可以禁用最小化混淆，或是用来指定使用哪种混淆器。默认为 [Terser](https://github.com/terser/terser)，虽然 Terser 相对较慢，但大多数情况下构建后的文件体积更小。ESbuild 最小化混淆更快但构建后的文件相对更大。

### build.terserOptions

- **类型：** `TerserOptions`

  传递给 Terser 的更多 [minify 选项](https://terser.org/docs/api-reference#minify-options)。

### build.write

- **类型：** `boolean`
- **默认：** `true`

  设置为 `false` 来禁用将构建后的文件写入磁盘。这常用于 [编程式地调用 `build()`](/guide/api-javascript#build) 在写入磁盘之前，需要对构建后的文件进行进一步处理。

### build.emptyOutDir

- **类型：** `boolean`
- **默认：** 若 `outDir` 在 `root` 目录下，则为 `true`

  默认情况下，若 `outDir` 在 `root` 目录下，则 Vite 会在构建时清空该目录。若 `outDir` 在根目录之外则会抛出一个警告避免意外删除掉重要的文件。可以设置该选项来关闭这个警告。该功能也可以通过命令行参数 `--emptyOutDir` 来使用。

### build.brotliSize

- **类型：** `boolean`
- **默认：** `true`

  启用/禁用 brotli 压缩大小报告。压缩大型输出文件可能会很慢，因此禁用该功能可能会提高大型项目的构建性能。

### build.chunkSizeWarningLimit

- **类型：** `number`
- **默认：** `500`

  chunk 大小警告的限制（以 kbs 为单位）。

## 依赖优化选项

- **相关内容：** [依赖预构建](/guide/dep-pre-bundling)

### optimizeDeps.entries

- **类型：** `string | string[]`

  默认情况下，Vite 会抓取你的 index.html 来检测需要预构建的依赖项。如果指定了 `build.rollupOptions.input`，Vite 将转而去抓取这些入口点。

  如果这两者都不适合您的需要，则可以使用此选项指定自定义条目 - 该值需要遵循 [fast-glob 模式](https://github.com/mrmlnc/fast-glob#basic-syntax) ，或者是相对于 vite 项目根的模式数组。这将覆盖掉默认条目推断。

### optimizeDeps.exclude

- **类型：** `string[]`

  在预构建中强制排除的依赖项。

### optimizeDeps.include

- **类型：** `string[]`

  默认情况下，不在 `node_modules` 中的，链接的包不会被预构建。使用此选项可强制预构建链接的包。

## SSR 选项

:::warning 实验性
SSR 选项可能会在未来版本中进行调整。
:::

- **相关：** [SSR 外部化](/guide/ssr#SSR-外部化)

### ssr.external

- **类型：** `string[]`

  列出的是要为 SSR 强制外部化的依赖。

### ssr.noExternal

- **类型：** `string[]`

  列出的是防止被 SSR 外部化依赖项。
