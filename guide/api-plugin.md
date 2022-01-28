# 插件 API {#plugin-api}

Vite 插件扩展了设计出色的 Rollup 接口，带有一些 Vite 独有的配置项。因此，你只需要编写一个 Vite 插件，就可以同时为开发环境和生产环境工作。

**推荐在阅读下面的章节之前，首先阅读下 [Rollup 插件文档](https://rollupjs.org/guide/en/#plugin-development)**

## 致插件创作者 {#authoring-a-plugin}

Vite 努力秉承开箱即用的原则，因此在创作一款新插件前，请确保已经阅读过 [Vite 的功能指南](/guide/features)，避免重复劳作。同时还应查看社区是否存在可用插件，包括 [兼容 Rollup 的插件](https://github.com/rollup/awesome) 以及 [Vite 的专属插件](https://github.com/vitejs/awesome-vite#plugins)。

当创作插件时，你可以在 `vite.config.js` 中直接使用它。没必要直接为它创建一个新的 package。当你发现某个插件在你项目中很有用时，可以考虑，可以考虑 [在社区中](https://chat.vitejs.dev) 将其与他人分享。

::: tip
在学习、调试或创作插件时，我们建议在你的项目中引入 [vite-plugin-inspect](https://github.com/antfu/vite-plugin-inspect)。 它可以帮助你检查 Vite 插件的中间状态。安装后，你可以访问 `localhost:3000/__inspect/` 来检查你项目的模块和栈信息。请查阅 [vite-plugin-inspect 文档](https://github.com/antfu/vite-plugin-inspect) 中的安装说明。
![vite-plugin-inspect](/images/vite-plugin-inspect.png)
:::

## 约定 {#conventions}

如果插件不使用 Vite 特有的钩子，可以作为 [兼容 Rollup 的插件](#rollup-plugin-compatibility) 来实现，推荐使用 [Rollup 插件名称约定](https://rollupjs.org/guide/en/#conventions)。

- Rollup 插件应该有一个带 `rollup-plugin-` 前缀、语义清晰的名称。
- 在 package.json 中包含 `rollup-plugin` 和 `vite-plugin` 关键字。

这样，插件也可以用于纯 Rollup 或基于 WMR 的项目。

对于 Vite 专属的插件：

- Vite 插件应该有一个带 `vite-plugin-` 前缀、语义清晰的名称。
- 在 package.json 中包含 `vite-plugin` 关键字。
- 在插件文档增加一部分关于为什么本插件是一个 Vite 专属插件的详细说明（如，本插件使用了 Vite 特有的插件钩子）。

如果你的插件只适用于特定的框架，它的名字应该遵循以下前缀格式：

- `vite-plugin-vue-` 前缀作为 Vue 插件
- `vite-plugin-react-` 前缀作为 React 插件
- `vite-plugin-svelte-` 前缀作为 Svelte 插件

<<<<<<< HEAD
Vite 对虚拟模块的规范是在路径前加上 `virtual:`。如果可能的话，插件名应该作为命名空间使用，以避免与生态系统中的其他插件发生冲突。例如，`vite-plugin-posts` 可以让用户引入 `virtual:posts` 或 `virtual:posts/helpers` 虚拟模块，以获得构建时信息。在内部，使用虚拟模块的插件在解析模块 ID 时应以 `\0` 为前缀，这是一个来自 Rollup 生态系统的惯例。这可以防止其他插件试图处理这个 ID（如节点解析），而像 sourcemap 这样的核心功能可以使用这些信息来区分虚拟模块和普通文件。`\0` 在导入的 URL 中不是一个允许的字符，所以我们必须在导入分析中替换它们。在浏览器中，一个 `0{id}` 的虚拟 ID 最终被编码为 `/@id/__x00__{id}`。在进入插件处理管道之前，这个 ID 会被解码回来。所以这个过程在插件钩子代码中将是不可见的。

请注意，模块都直接来源于真实的文件，而单文件组件（比如 .vue 或 .svelte 文件）中的 script 模块将不需要这样的转换。单文件组件被处理时一般会生成一系列子模块但其代码都可以被映射回文件系统。对这些子模块使用 `\0` 会使得 sourcemap 工作异常。
=======
See also [Virtual Modules Convention](#virtual-modules-convention).
>>>>>>> f67ed654469b1812414ab2ee6e8f8d02d9422b39

## 插件配置 {#plugins-config}

用户会将插件添加到项目的 `devDependencies` 中并使用数组形式的 `plugins` 选项配置它们。

```js
// vite.config.js
import vitePlugin from 'vite-plugin-feature'
import rollupPlugin from 'rollup-plugin-feature'

export default defineConfig({
  plugins: [vitePlugin(), rollupPlugin()]
})
```

假值的插件将被忽略，可以用来轻松地启用或停用插件。

`plugins` 也可以接受将多个插件作为单个元素的预设。这对于使用多个插件实现的复杂特性（如框架集成）很有用。该数组将在内部被扁平化（flatten）。

```js
// 框架插件
import frameworkRefresh from 'vite-plugin-framework-refresh'
import frameworkDevtools from 'vite-plugin-framework-devtools'

export default function framework(config) {
  return [frameworkRefresh(config), frameworkDevTools(config)]
}
```

```js
// vite.config.js
import { defineConfig } from 'vite'
import framework from 'vite-plugin-framework'

export default defineConfig({
  plugins: [framework()]
})
```

## 简单示例 {#simple-examples}

:::tip
通常的惯例是创建一个 Vite/Rollup 插件作为一个返回实际插件对象的工厂函数。该函数可以接受允许用户自定义插件行为的选项。
:::

<<<<<<< HEAD
### 引入一个虚拟文件 {#importing-a-virtual-file}
=======
### Transforming Custom File Types

```js
const fileRegex = /\.(my-file-ext)$/

export default function myPlugin() {
  return {
    name: 'transform-file',

    transform(src, id) {
      if (fileRegex.test(id)) {
        return {
          code: compileFileToJS(src),
          map: null // provide source map if available
        }
      }
    }
  }
}
```

### Importing a Virtual File
>>>>>>> f67ed654469b1812414ab2ee6e8f8d02d9422b39

See the example in the [next section](#virtual-modules-convention).

## Virtual Modules Convention

Virtual modules are a useful scheme that allows you to pass build time information to the source files using normal ESM import syntax.

```js
export default function myPlugin() {
  const virtualModuleId = '@my-virtual-module'
  const resolvedVirtualModuleId = '\0' + virtualModuleId

  return {
    name: 'my-plugin', // 必须的，将会在 warning 和 error 中显示
    resolveId(id) {
      if (id === virtualModuleId) {
        return resolvedVirtualModuleId
      }
    },
    load(id) {
      if (id === resolvedVirtualModuleId) {
        return `export const msg = "from virtual module"`
      }
    }
  }
}
```

这使得可以在 JavaScript 中引入这些模块：

```js
import { msg } from '@my-virtual-module'

console.log(msg)
```

<<<<<<< HEAD
### 转换自定义文件类型 {#transforming-custom-file-types}

```js
const fileRegex = /\.(my-file-ext)$/

export default function myPlugin() {
  return {
    name: 'transform-file',

    transform(src, id) {
      if (fileRegex.test(id)) {
        return {
          code: compileFileToJS(src),
          map: null // 如果可行将提供 source map
        }
      }
    }
  }
}
```
=======
Virtual modules in Vite (and Rollup) are prefixed with `virtual:` for the user-facing path by convention. If possible the plugin name should be used as a namespace to avoid collisions with other plugins in the ecosystem. For example, a `vite-plugin-posts` could ask users to import a `virtual:posts` or `virtual:posts/helpers` virtual modules to get build time information. Internally, plugins that use virtual modules should prefix the module ID with `\0` while resolving the id, a convention from the rollup ecosystem. This prevents other plugins from trying to process the id (like node resolution), and core features like sourcemaps can use this info to differentiate between virtual modules and regular files. `\0` is not a permitted char in import URLs so we have to replace them during import analysis. A `\0{id}` virtual id ends up encoded as `/@id/__x00__{id}` during dev in the browser. The id will be decoded back before entering the plugins pipeline, so this is not seen by plugins hooks code.

Note that modules directly derived from a real file, as in the case of a script module in a Single File Component (like a .vue or .svelte SFC) don't need to follow this convention. SFCs generally generate a set of submodules when processed but the code in these can be mapped back to the filesystem. Using `\0` for these submodules would prevent sourcemaps from working correctly.
>>>>>>> f67ed654469b1812414ab2ee6e8f8d02d9422b39

## 通用钩子 {#universal-hooks}

在开发中，Vite 开发服务器会创建一个插件容器来调用 [Rollup 构建钩子](https://rollupjs.org/guide/en/#build-hooks)，与 Rollup 如出一辙。

以下钩子在服务器启动时被调用：

- [`options`](https://rollupjs.org/guide/en/#options)
- [`buildStart`](https://rollupjs.org/guide/en/#buildstart)

以下钩子会在每个传入模块请求时被调用：

- [`resolveId`](https://rollupjs.org/guide/en/#resolveid)
- [`load`](https://rollupjs.org/guide/en/#load)
- [`transform`](https://rollupjs.org/guide/en/#transform)

以下钩子在服务器关闭时被调用：

- [`buildEnd`](https://rollupjs.org/guide/en/#buildend)
- [`closeBundle`](https://rollupjs.org/guide/en/#closebundle)

请注意 [`moduleParsed`](https://rollupjs.org/guide/en/#moduleparsed) 钩子在开发中是 **不会** 被调用的，因为 Vite 为了性能会避免完整的 AST 解析。

[Output Generation Hooks](https://rollupjs.org/guide/en/#output-generation-hooks)（除了 `closeBundle`) 在开发中是 **不会** 被调用的。你可以认为 Vite 的开发服务器只调用了 `rollup.rollup()` 而没有调用 `bundle.generate()`。

## Vite 独有钩子 {#vite-specific-hooks}

Vite 插件也可以提供钩子来服务于特定的 Vite 目标。这些钩子会被 Rollup 忽略。

### `config` {#config}

- **类型：** `(config: UserConfig, env: { mode: string, command: string }) => UserConfig | null | void`
- **种类：** `async`, `sequential`

  在解析 Vite 配置前调用。钩子接收原始用户配置（命令行选项指定的会与配置文件合并）和一个描述配置环境的变量，包含正在使用的 `mode` 和 `command`。它可以返回一个将被深度合并到现有配置中的部分配置对象，或者直接改变配置（如果默认的合并不能达到预期的结果）。

  **示例：**

  ```js
  // 返回部分配置（推荐）
  const partialConfigPlugin = () => ({
    name: 'return-partial',
    config: () => ({
      alias: {
        foo: 'bar'
      }
    })
  })

  // 直接改变配置（应仅在合并不起作用时使用）
  const mutateConfigPlugin = () => ({
    name: 'mutate-config',
    config(config, { command }) {
      if (command === 'build') {
        config.root = __dirname
      }
    }
  })
  ```

  ::: warning 注意
  用户插件在运行这个钩子之前会被解析，因此在 `config` 钩子中注入其他插件不会有任何效果。
  :::

### `configResolved` {#configresolved}

- **类型：** `(config: ResolvedConfig) => void | Promise<void>`
- **种类：** `async`, `parallel`

  在解析 Vite 配置后调用。使用这个钩子读取和存储最终解析的配置。当插件需要根据运行的命令做一些不同的事情时，它也很有用。

  **示例：**

  ```js
  const exmaplePlugin = () => {
    let config

    return {
      name: 'read-config',

      configResolved(resolvedConfig) {
        // 存储最终解析的配置
        config = resolvedConfig
      },

      // 在其他钩子中使用存储的配置
      transform(code, id) {
        if (config.command === 'serve') {
          // dev: 由开发服务器调用的插件
        } else {
          // build: 由 Rollup 调用的插件
        }
      }
    }
  }
  ```

  注意，在开发环境下，`command` 的值为 `serve`（在 CLI 中，`vite` 和 `vite dev` 是 `vite serve` 的别名）。

### `configureServer` {#configureserver}

- **类型：** `(server: ViteDevServer) => (() => void) | void | Promise<(() => void) | void>`
- **种类：** `async`, `sequential`
- **此外请看** [ViteDevServer](./api-javascript#vitedevserver)

  是用于配置开发服务器的钩子。最常见的用例是在内部 [connect](https://github.com/senchalabs/connect) 应用程序中添加自定义中间件:

  ```js
  const myPlugin = () => ({
    name: 'configure-server',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        // 自定义请求处理...
      })
    }
  })
  ```

  **注入后置中间件**

  `configureServer` 钩子将在内部中间件被安装前调用，所以自定义的中间件将会默认会比内部中间件早运行。如果你想注入一个在内部中间件 **之后** 运行的中间件，你可以从 `configureServer` 返回一个函数，将会在内部中间件安装后被调用：

  ```js
  const myPlugin = () => ({
    name: 'configure-server',
    configureServer(server) {
      // 返回一个在内部中间件安装后
      // 被调用的后置钩子
      return () => {
        server.middlewares.use((req, res, next) => {
          // 自定义请求处理...
        })
      }
    }
  })
  ```

  **存储服务器访问**

  在某些情况下，其他插件钩子可能需要访问开发服务器实例（例如访问 websocket 服务器、文件系统监视程序或模块图）。这个钩子也可以用来存储服务器实例以供其他钩子访问:

  ```js
  const myPlugin = () => {
    let server
    return {
      name: 'configure-server',
      configureServer(_server) {
        server = _server
      },
      transform(code, id) {
        if (server) {
          // 使用 server...
        }
      }
    }
  }
  ```

  注意 `configureServer` 在运行生产版本时不会被调用，所以其他钩子需要防范它缺失。

### `transformIndexHtml` {#transformindexhtml}

- **类型：** `IndexHtmlTransformHook | { enforce?: 'pre' | 'post', transform: IndexHtmlTransformHook }`
- **种类：** `async`, `sequential`

  转换 `index.html` 的专用钩子。钩子接收当前的 HTML 字符串和转换上下文。上下文在开发期间暴露[`ViteDevServer`](./api-javascript#vitedevserver)实例，在构建期间暴露 Rollup 输出的包。

  这个钩子可以是异步的，并且可以返回以下其中之一:

  - 经过转换的 HTML 字符串
  - 注入到现有 HTML 中的标签描述符对象数组（`{ tag, attrs, children }`）。每个标签也可以指定它应该被注入到哪里（默认是在 `<head>` 之前）
  - 一个包含 `{ html, tags }` 的对象

  **基础示例：**

  ```js
  const htmlPlugin = () => {
    return {
      name: 'html-transform',
      transformIndexHtml(html) {
        return html.replace(
          /<title>(.*?)<\/title>/,
          `<title>Title replaced!</title>`
        )
      }
    }
  }
  ```

  **完整钩子签名：**

  ```ts
  type IndexHtmlTransformHook = (
    html: string,
    ctx: {
      path: string
      filename: string
      server?: ViteDevServer
      bundle?: import('rollup').OutputBundle
      chunk?: import('rollup').OutputChunk
    }
  ) =>
    | IndexHtmlTransformResult
    | void
    | Promise<IndexHtmlTransformResult | void>

  type IndexHtmlTransformResult =
    | string
    | HtmlTagDescriptor[]
    | {
        html: string
        tags: HtmlTagDescriptor[]
      }

  interface HtmlTagDescriptor {
    tag: string
    attrs?: Record<string, string>
    children?: string | HtmlTagDescriptor[]
    /**
     * 默认： 'head-prepend'
     */
    injectTo?: 'head' | 'body' | 'head-prepend' | 'body-prepend'
  }
  ```

### `handleHotUpdate` {#handlehotupdate}

- **类型：** `(ctx: HmrContext) => Array<ModuleNode> | void | Promise<Array<ModuleNode> | void>`

  执行自定义 HMR 更新处理。钩子接收一个带有以下签名的上下文对象：

  ```ts
  interface HmrContext {
    file: string
    timestamp: number
    modules: Array<ModuleNode>
    read: () => string | Promise<string>
    server: ViteDevServer
  }
  ```

  - `modules` 是受更改文件影响的模块数组。它是一个数组，因为单个文件可能映射到多个服务模块（例如 Vue 单文件组件）。

  - `read` 这是一个异步读函数，它返回文件的内容。之所以这样做，是因为在某些系统上，文件更改的回调函数可能会在编辑器完成文件更新之前过快地触发，并 `fs.readFile` 直接会返回空内容。传入的 `read` 函数规范了这种行为。

  钩子可以选择:

  - 过滤和缩小受影响的模块列表，使 HMR 更准确。

  - 返回一个空数组，并通过向客户端发送自定义事件来执行完整的自定义 HMR 处理:

    ```js
    handleHotUpdate({ server }) {
      server.ws.send({
        type: 'custom',
        event: 'special-update',
        data: {}
      })
      return []
    }
    ```

    客户端代码应该使用 [HMR API](./api-hmr) 注册相应的处理器（这应该被相同插件的 `transform` 钩子注入）：

    ```js
    if (import.meta.hot) {
      import.meta.hot.on('special-update', (data) => {
        // 执行自定义更新
      })
    }
    ```

## 插件顺序 {#plugin-ordering}

一个 Vite 插件可以额外指定一个 `enforce` 属性（类似于 webpack 加载器）来调整它的应用顺序。`enforce` 的值可以是`pre` 或 `post`。解析后的插件将按照以下顺序排列：

- Alias
- 带有 `enforce: 'pre'` 的用户插件
- Vite 核心插件
- 没有 enforce 值的用户插件
- Vite 构建用的插件
- 带有 `enforce: 'post'` 的用户插件
- Vite 后置构建插件（最小化，manifest，报告）

## 情景应用 {#conditional-application}

默认情况下插件在开发（serve）和构建（build）模式中都会调用。如果插件只需要在预览或构建期间有条件地应用，请使用 `apply` 属性指明它们仅在 `'build'` 或 `'serve'` 模式时调用：

```js
function myPlugin() {
  return {
    name: 'build-only',
    apply: 'build' // 或 'serve'
  }
}
```

同时，还可以使用函数来进行更精准的控制：

```js
apply(config, { command }) {
  // 非 SSR 情况下的 build
  return command === 'build' && !config.build.ssr
}
```

## Rollup 插件兼容性 {#rollup-plugin-compatibility}

相当数量的 Rollup 插件将直接作为 Vite 插件工作（例如：`@rollup/plugin-alias` 或 `@rollup/plugin-json`），但并不是所有的，因为有些插件钩子在非构建式的开发服务器上下文中没有意义。

一般来说，只要 Rollup 插件符合以下标准，它就应该像 Vite 插件一样工作：

- 没有使用 [`moduleParsed`](https://rollupjs.org/guide/en/#moduleparsed) 钩子。
- 它在打包钩子和输出钩子之间没有很强的耦合。

如果一个 Rollup 插件只在构建阶段有意义，则在 `build.rollupOptions.plugins` 下指定即可。

你也可以用 Vite 独有的属性来扩展现有的 Rollup 插件:

```js
// vite.config.js
import example from 'rollup-plugin-example'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    {
      ...example(),
      enforce: 'post',
      apply: 'build'
    }
  ]
})
```

查看 [Vite Rollup 插件](https://vite-rollup-plugins.patak.dev) 获取兼容的官方 Rollup 插件列表及其使用指南。

## 路径规范化 {#path-normalization}

Vite 对路径进行了规范化处理，在解析路径时使用 POSIX 分隔符（ / ），同时保留了 Windows 中的卷名。而另一方面，Rollup 在默认情况下保持解析的路径不变，因此解析的路径在 Windows 中会使用 win32 分隔符（ \\ ）。然而，Rollup 插件会使用 `@rollup/pluginutils` 内部的 [`normalizePath` 工具函数](https://github.com/rollup/plugins/tree/master/packages/pluginutils#normalizepath)，它在执行比较之前将分隔符转换为 POSIX。所以意味着当这些插件在 Vite 中使用时，`include` 和 `exclude` 两个配置模式，以及与已解析路径比较相似的路径会正常工作。

所以对于 Vite 插件来说，在将路径与已解析的路径进行比较时，首先规范化路径以使用 POSIX 分隔符是很重要的。从 `vite` 模块中也导出了一个等效的 `normalizePath` 工具函数。

```js
import { normalizePath } from 'vite'

normalizePath('foo\\bar') // 'foo/bar'
normalizePath('foo/bar') // 'foo/bar'
```
