# 共享选项 {#shared-options}

除非另有说明，本节中的选项适用于所有开发、构建和预览。

## root

- **类型：** `string`
- **默认：** `process.cwd()`

项目根目录（`index.html` 文件所在的位置）。可以是一个绝对路径，或者一个相对于该配置文件本身的相对路径。

更多细节请见 [项目根目录](/guide/#index-html-and-project-root)。

## base {#base}

- **类型：** `string`
- **默认：** `/`
- **相关：** [`server.origin`](/config/server-options.md#server-origin)

开发或生产环境服务的公共基础路径。合法的值包括以下几种：

- 绝对 URL 路径名，例如 `/foo/`
- 完整的 URL，例如 `https://bar.com/foo/ `（域名部分在开发环境中不会被使用，因此该值与 `/foo/` 相同）
- 空字符串或 `./`（用于嵌入形式的开发）

更多信息详见 [公共基础路径](/guide/build#public-base-path)。

## mode {#mode}

- **类型：** `string`
- **默认：** `'development'` 用于开发，`'production'` 用于构建

在配置中指明将会把 **serve 和 build** 时的模式 **都** 覆盖掉。也可以通过命令行 `--mode` 选项来重写。

查看 [环境变量与模式](/guide/env-and-mode) 章节获取更多细节。

## define {#define}

- **类型：** `Record<string, any>`

定义全局常量替换方式。其中每项在开发环境下会被定义在全局，而在构建时被静态替换。

Vite 使用 [esbuild define](https://esbuild.github.io/api/#define) 来进行替换，因此值的表达式必须是一个包含 JSON 可序列化值（null、boolean、number、string、array 或 object）或单一标识符的字符串。对于非字符串值，Vite 将自动使用 `JSON.stringify` 将其转换为字符串。

**示例：**

```js
export default defineConfig({
  define: {
    __APP_VERSION__: JSON.stringify('v1.0.0'),
    __API_URL__: 'window.__backend_api_url',
  },
})
```

::: tip NOTE
对于使用 TypeScript 的开发者来说，请确保在 `env.d.ts` 或 `vite-env.d.ts` 文件中添加类型声明，以获得类型检查以及代码提示。

示例：

```ts
// vite-env.d.ts
declare const __APP_VERSION__: string
```

:::

## plugins

- **类型：** `(Plugin | Plugin[] | Promise<Plugin | Plugin[]>)[]`

需要用到的插件数组。Falsy 虚值的插件将被忽略，插件数组将被扁平化（flatten）。查看 [插件 API](/guide/api-plugin) 获取 Vite 插件的更多细节。

## publicDir {#publicdir}

- **类型：** `string | false`
- **默认：** `"public"`

作为静态资源服务的文件夹。该目录中的文件在开发期间在 `/` 处提供，并在构建期间复制到 `outDir` 的根目录，并且始终按原样提供或复制而无需进行转换。该值可以是文件系统的绝对路径，也可以是相对于项目根目录的相对路径。

将 `publicDir` 设定为 `false` 可以关闭此项功能。

欲了解更多，请参阅 [`public` 目录](/guide/assets#the-public-directory)。

## cacheDir {#cachedir}

- **类型：** `string`
- **默认：** `"node_modules/.vite"`

存储缓存文件的目录。此目录下会存储预打包的依赖项或 vite 生成的某些缓存文件，使用缓存可以提高性能。如需重新生成缓存文件，你可以使用 `--force` 命令行选项或手动删除目录。此选项的值可以是文件的绝对路径，也可以是以项目根目录为基准的相对路径。当没有检测到 package.json 时，则默认为 `.vite`。

## resolve.alias {#resolve-alias}

- **类型：**
  `Record<string, string> | Array<{ find: string | RegExp, replacement: string, customResolver?: ResolverFunction | ResolverObject }>`

将会被传递到 `@rollup/plugin-alias` 作为 [entries 的选项](https://github.com/rollup/plugins/tree/master/packages/alias#entries)。也可以是一个对象，或一个 `{ find, replacement, customResolver }` 的数组。

当使用文件系统路径的别名时，请始终使用绝对路径。相对路径的别名值会原封不动地被使用，因此无法被正常解析。

更高级的自定义解析方法可以通过 [插件](/guide/api-plugin) 实现。

::: warning 在 SSR 中使用
如果你已经为 [SSR 外部化的依赖](/guide/ssr.md#ssr-externals) 配置了别名，你可能想要为真实的 `node_modules` 包配别名。[Yarn](https://classic.yarnpkg.com/en/docs/cli/add/#toc-yarn-add-alias) 和 [pnpm](https://pnpm.io/aliases/) 都支持通过 `npm:` 前缀配置别名。
:::

## resolve.dedupe {#resolve-dedupe}

- **类型：** `string[]`

如果你在你的应用程序中有相同依赖的副本（比如 monorepos），请使用此选项强制 Vite 始终将列出的依赖项解析为同一副本（从项目根目录）。

:::warning SSR + ESM
对于服务端渲染构建，配置项 `build.rollupOptions.output` 为 ESM 构建输出时去重过程将不工作。一个替代方案是先使用 CJS 构建输出，直到 ESM 在插件中有了更好的模块加载支持。
:::

## resolve.conditions {#resolve-conditions}

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

:::warning 解决子路径导出问题
导出以“/”结尾的 key 已被 Node 弃用，可能无法正常工作。请联系包的作者改为使用 [`*` 子路径模式](https://nodejs.org/api/packages.html#package-entry-points)。
:::

## resolve.mainFields {#resolve-mainfields}

- **类型：** `string[]`
- **默认：** `['browser', 'module', 'jsnext:main', 'jsnext']`

`package.json` 中，在解析包的入口点时尝试的字段列表。注意：这比从 `exports` 字段解析的情景导出优先级低：如果一个入口起点从 `exports` 成功解析，`resolve.mainFields` 将被忽略。

## resolve.extensions {#resolve-extensions}

- **类型：** `string[]`
- **默认：** `['.mjs', '.js', '.mts', '.ts', '.jsx', '.tsx', '.json']`

导入时想要省略的扩展名列表。注意，**不** 建议忽略自定义导入类型的扩展名（例如：`.vue`），因为它会影响 IDE 和类型支持。

## resolve.preserveSymlinks {#resolve-preservesymlinks}

- **类型：** `boolean`
- **默认：** `false`

启用此选项会使 Vite 通过原始文件路径（即不跟随符号链接的路径）而不是真正的文件路径（即跟随符号链接后的路径）确定文件身份。

- **相关：** [esbuild#preserve-symlinks](https://esbuild.github.io/api/#preserve-symlinks)，[webpack#resolve.symlinks
  ](https://webpack.js.org/configuration/resolve/#resolvesymlinks)

## html.cspNonce

- **类型：** `string`
- **相关：** [内容安全策略（CSP）](/guide/features#content-security-policy-csp)

一个在生成脚本或样式标签时会用到的 nonce 值占位符。设置此值还会生成一个带有 nonce 值的 meta 标签。

## css.modules

- **类型：**
  ```ts
  interface CSSModulesOptions {
    getJSON?: (
      cssFileName: string,
      json: Record<string, string>,
      outputFileName: string,
    ) => void
    scopeBehaviour?: 'global' | 'local'
    globalModulePaths?: RegExp[]
    exportGlobals?: boolean
    generateScopedName?:
      | string
      | ((name: string, filename: string, css: string) => string)
    hashPrefix?: string
    /**
     * default: undefined
     */
    localsConvention?:
      | 'camelCase'
      | 'camelCaseOnly'
      | 'dashes'
      | 'dashesOnly'
      | ((
          originalClassName: string,
          generatedClassName: string,
          inputFile: string,
        ) => string)
  }
  ```

配置 CSS modules 的行为。选项将被传递给 [postcss-modules](https://github.com/css-modules/postcss-modules)。

当使用 [Lightning CSS](../guide/features.md#lightning-css) 时，该选项不会产生任何效果。如果要启用该选项，则应该使用 [`css.lightningcss.cssModules`](https://lightningcss.dev/css-modules.html) 来替代。

## css.postcss {#css-postcss}

- **类型：** `string | (postcss.ProcessOptions & { plugins?: postcss.AcceptedPlugin[] })`

内联的 PostCSS 配置（格式同 `postcss.config.js`），或者一个（默认基于项目根目录的）自定义的 PostCSS 配置路径。

对内联的 POSTCSS 配置，它期望接收与 `postcss.config.js` 一致的格式。但对于 `plugins` 属性有些特别，只接收使用 [数组格式](https://github.com/postcss/postcss-load-config/blob/main/README.md#array)。

搜索是使用 [postcss-load-config](https://github.com/postcss/postcss-load-config) 完成的，只有被支持的文件名才会被加载。默认情况下，不会搜索工作区根目录（或 [项目根目录](/guide/#index-html-and-project-root)，如果未找到工作区）之外的配置文件。如有必要，您可以指定根目录之外的自定义路径来加载特定的配置文件。

注意：如果提供了该内联配置，Vite 将不会搜索其他 PostCSS 配置源。

## css.preprocessorOptions {#css-preprocessoroptions}

- **类型：** `Record<string, object>`

指定传递给 CSS 预处理器的选项。文件扩展名用作选项的键。每个预处理器支持的选项可以在它们各自的文档中找到：

- `sass`/`scss`:
  - 选择要使用的 sass 应用程序接口 `api: "modern-compiler" | "modern" | "legacy"` (如果安装了`sass-embedded`，默认为`"modern-compiler"`，否则为 `"modern"`). 为获得最佳性能，建议使用 `api: "modern-compiler"` 和 `sass-embedded` 软件包。`"legacy"` API 已过时，将在 Vite 7 中移除。
  - [Options (modern)](https://sass-lang.com/documentation/js-api/interfaces/stringoptions/)
  - [Options (legacy)](https://sass-lang.com/documentation/js-api/interfaces/LegacyStringOptions).
- `less`: [选项](https://lesscss.org/usage/#less-options).
- `styl`/`stylus`: 仅支持 [`define`](https://stylus-lang.com/docs/js.html#define-name-node)，可以作为对象传递。

**示例：**

```js
export default defineConfig({
  css: {
    preprocessorOptions: {
      less: {
        math: 'parens-division',
      },
      styl: {
        define: {
          $specialColor: new stylus.nodes.RGBA(51, 197, 255, 1),
        },
      },
      scss: {
        api: 'modern-compiler', // 或 "modern"，"legacy"
        importers: [
          // ...
        ],
      },
    },
  },
})
```

### css.preprocessorOptions[extension].additionalData

- **类型：** `string | ((source: string, filename: string) => (string | { content: string; map?: SourceMap }))`

该选项可以用来为每一段样式内容添加额外的代码。但是要注意，如果你添加的是实际的样式而不仅仅是变量，那这些样式在最终的产物中会重复。

**示例：**

```js
export default defineConfig({
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `$injectedColor: orange;`,
      },
    },
  },
})
```

## css.preprocessorMaxWorkers

- **实验性：** [提供反馈](https://github.com/vitejs/vite/discussions/15835)
- **类型：** `number | true`
- **默认：** `0`（不会创建任何 worker 线程，而是在主线程中运行）

如果启用了这个选项，那么 CSS 预处理器会尽可能在 worker 线程中运行。`true` 表示 CPU 数量减 1。

## css.devSourcemap {#css-devsourcemap}

- **实验性：** [提供反馈](https://github.com/vitejs/vite/discussions/13845)
- **类型：** `boolean`
- **默认：** `false`

在开发过程中是否启用 sourcemap。

## css.transformer

- **实验性：** [提供反馈](https://github.com/vitejs/vite/discussions/13835)
- **类型：** `'postcss' | 'lightningcss'`
- **默认：** `'postcss'`

该选项用于选择用于 CSS 处理的引擎。详细信息请查看 [Lightning CSS](../guide/features.md#lightning-css)。

::: info 重复的 `@import`
需要注意的是，postcss（postcss-import）处理重复 `@import` 的行为与浏览器是不同的。详情请参考 [postcss/postcss-import#462](https://github.com/postcss/postcss-import/issues/462)。
:::

## css.lightningcss

- **实验性：** [提供反馈](https://github.com/vitejs/vite/discussions/13835)
- **类型：**

```js
import type {
  CSSModulesConfig,
  Drafts,
  Features,
  NonStandard,
  PseudoClasses,
  Targets,
} from 'lightningcss'
```

```js
{
  targets?: Targets
  include?: Features
  exclude?: Features
  drafts?: Drafts
  nonStandard?: NonStandard
  pseudoClasses?: PseudoClasses
  unusedSymbols?: string[]
  cssModules?: CSSModulesConfig,
  // ...
}
```

该选项用于配置 Lightning CSS。有关完整的转换选项，请参阅 [Lightning CSS 仓库](https://github.com/parcel-bundler/lightningcss/blob/master/node/index.d.ts)。

## json.namedExports {#json-namedexports}

- **类型：** `boolean`
- **默认：** `true`

是否支持从 `.json` 文件中进行按名导入。

## json.stringify {#json-stringify}

- **类型：** `boolean | 'auto'`
- **默认：** `'auto'`

若设置为 `true`，导入的 JSON 会被转换为 `export default JSON.parse("...")`，这样会比转译成对象字面量性能更好，尤其是当 JSON 文件较大的时候。

如果设置为 `'auto'`，只有当 [数据大于 10kB 时](https://v8.dev/blog/cost-of-javascript-2019#json:~:text=A%20good%20rule%20of%20thumb%20is%20to%20apply%20this%20technique%20for%20objects%20of%2010%20kB%20or%20larger)，才会对数据进行字符串化处理。

## esbuild {#esbuild}

- **类型：** `ESBuildOptions | false`

`ESBuildOptions` 继承自 [esbuild 转换选项](https://esbuild.github.io/api/#transform)。最常见的用例是自定义 JSX：

```js
export default defineConfig({
  esbuild: {
    jsxFactory: 'h',
    jsxFragment: 'Fragment',
  },
})
```

默认情况下，esbuild 会被应用在 `ts`、`jsx`、`tsx` 文件。你可以通过 `esbuild.include` 和 `esbuild.exclude` 对要处理的文件类型进行配置，这两个配置的值可以是一个正则表达式、一个 [picomatch](https://github.com/micromatch/picomatch#globbing-features) 模式，或是一个值为这两种类型的数组。

此外，你还可以通过 `esbuild.jsxInject` 来自动为每一个被 esbuild 转换的文件注入 JSX helper。

```js
export default defineConfig({
  esbuild: {
    jsxInject: `import React from 'react'`,
  },
})
```

当 [`build.minify`](./build-options.md#build-minify) 为 `true` 时，所有最小化的优化过程都会被默认应用，要禁用它的 [某些特定方面](https://esbuild.github.io/api/#minify)，请设置 `esbuild.minifyIdentifiers`、`esbuild.minifySyntax` 或 `esbuild.minifyWhitespace` 三种选项其中任意一种为 `false`。注意 `esbuild.minify` 选项无法用于覆盖 `build.minify`。

设置为 `false` 来禁用 esbuild 转换。

## assetsInclude {#assetsinclude}

- **类型：** `string | RegExp | (string | RegExp)[]`
- **相关内容：** [静态资源处理](/guide/assets)

指定额外的 [picomatch 模式](https://github.com/micromatch/picomatch#globbing-features) 作为静态资源处理，因此：

- 当从 HTML 引用它们或直接通过 `fetch` 或 XHR 请求它们时，它们将被插件转换管道排除在外。

- 从 JavaScript 导入它们将返回解析后的 URL 字符串（如果你设置了 `enforce: 'pre'` 插件来处理不同的资产类型，这可能会被覆盖）。

内建支持的资源类型列表可以在 [这里](https://github.com/vitejs/vite/blob/main/packages/vite/src/node/constants.ts) 找到。

**示例：**

```js
export default defineConfig({
  assetsInclude: ['**/*.gltf'],
})
```

## logLevel {#loglevel}

- **类型：** `'info' | 'warn' | 'error' | 'silent'`

调整控制台输出的级别，默认为 `'info'`。

## customLogger {#customlogger}

- **类型：**
  ```ts
  interface Logger {
    info(msg: string, options?: LogOptions): void
    warn(msg: string, options?: LogOptions): void
    warnOnce(msg: string, options?: LogOptions): void
    error(msg: string, options?: LogErrorOptions): void
    clearScreen(type: LogType): void
    hasErrorLogged(error: Error | RollupError): boolean
    hasWarned: boolean
  }
  ```

使用自定义 logger 记录消息。可以使用 Vite 的 `createLogger` API 获取默认的 logger 并对其进行自定义，例如，更改消息或过滤掉某些警告。

```ts twoslash
import { createLogger, defineConfig } from 'vite'

const logger = createLogger()
const loggerWarn = logger.warn

logger.warn = (msg, options) => {
  // 忽略空 CSS 文件的警告
  if (msg.includes('vite:css') && msg.includes(' is empty')) return
  loggerWarn(msg, options)
}

export default defineConfig({
  customLogger: logger,
})
```

## clearScreen {#clearscreen}

- **类型：** `boolean`
- **默认：** `true`

设为 `false` 可以避免 Vite 清屏而错过在终端中打印某些关键信息。命令行模式下可以通过 `--clearScreen false` 设置。

## envDir {#envdir}

- **类型：** `string`
- **默认：** `root`

用于加载 `.env` 文件的目录。可以是一个绝对路径，也可以是相对于项目根的路径。

关于环境文件的更多信息，请参见 [这里](/guide/env-and-mode#env-files)。

## envPrefix {#envprefix}

- **类型：** `string | string[]`
- **默认：** `VITE_`

以 `envPrefix` 开头的环境变量会通过 import.meta.env 暴露在你的客户端源码中。

:::warning 安全注意事项
`envPrefix` 不应被设置为空字符串 `''`，这将暴露你所有的环境变量，导致敏感信息的意外泄漏。 检测到配置为 `''` 时 Vite 将会抛出错误.

如果你想暴露一个不含前缀的变量，可以使用 [define](#define) 选项：

```js
define: {
  'import.meta.env.ENV_VARIABLE': JSON.stringify(process.env.ENV_VARIABLE)
}
```

:::

## appType {#apptype}

- **类型：** `'spa' | 'mpa' | 'custom'`
- **默认：** `'spa'`

无论你的应用是一个单页应用（SPA）还是一个 [多页应用（MPA）](../guide/build#multi-page-app)，亦或是一个定制化应用（SSR 和自定义 HTML 处理的框架）：

- `'spa'`：包含 HTML 中间件以及使用 SPA 回退。在预览中将 [sirv](https://github.com/lukeed/sirv) 配置为 `single: true`
- `'mpa'`：包含 HTML 中间件
- `'custom'`：不包含 HTML 中间件

要了解更多，请查看 Vite 的 [SSR 指引](/guide/ssr#vite-cli)。相关内容：[`server.middlewareMode`](./server-options#server-middlewaremode)。

## future

- **类型：** `Record<string, 'warn' | undefined>`
- **默认：** [破坏性变更](/changes/)

启用未来的重大变更，为顺利迁移到 Vite 的下一个主要版本做好准备。随着新功能的开发，这个列表可能会随时进行更新、添加或移除。

请查看 [破坏性变更](/changes/) 页面，了解可能的选项详情。
