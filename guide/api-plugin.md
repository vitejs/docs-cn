# 插件 API {#plugin-api}

Vite 插件扩展了设计出色的 Rollup 接口，带有一些 Vite 独有的配置项。因此，你只需要编写一个 Vite 插件，就可以同时为开发环境和生产环境工作。

**推荐在阅读下面的章节之前，首先阅读下 [Rollup 插件文档](https://rollupjs.org/plugin-development/)**

## 致插件创作者 {#authoring-a-plugin}

Vite 努力秉承开箱即用的原则，因此在创作一款新插件前，请确保已经阅读过 [Vite 的功能指南](/guide/features)，避免重复劳作。同时还应查看社区是否存在可用插件，包括 [兼容 Rollup 的插件](https://github.com/rollup/awesome) 以及 [Vite 的专属插件](https://github.com/vitejs/awesome-vite#plugins)。

当创作插件时，你可以在 `vite.config.js` 中直接使用它。没必要直接为它创建一个新的 package。当你发现某个插件在你项目中很有用时，可以考虑 [在社区中](https://chat.vite.dev) 将其与他人分享。

::: tip
在学习、调试或创作插件时，我们建议在你的项目中引入 [vite-plugin-inspect](https://github.com/antfu/vite-plugin-inspect)。 它可以帮助你检查 Vite 插件的中间状态。安装后，你可以访问 `localhost:5173/__inspect/` 来检查你项目的模块和栈信息。请查阅 [vite-plugin-inspect 文档](https://github.com/antfu/vite-plugin-inspect) 中的安装说明。
![vite-plugin-inspect](/images/vite-plugin-inspect.png)
:::

## 约定 {#conventions}

如果插件不使用 Vite 特有的钩子，可以作为 [兼容 Rollup 的插件](#rollup-plugin-compatibility) 来实现，推荐使用 [Rollup 插件名称约定](https://rollupjs.org/plugin-development/#conventions)。

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

更多详情参见 [虚拟模块的相关内容](#virtual-modules-convention).

## 插件配置 {#plugins-config}

用户会将插件添加到项目的 `devDependencies` 中并使用数组形式的 `plugins` 选项配置它们。

```js [vite.config.js]
import vitePlugin from 'vite-plugin-feature'
import rollupPlugin from 'rollup-plugin-feature'

export default defineConfig({
  plugins: [vitePlugin(), rollupPlugin()],
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

```js [vite.config.js]
import { defineConfig } from 'vite'
import framework from 'vite-plugin-framework'

export default defineConfig({
  plugins: [framework()],
})
```

## 简单示例 {#simple-examples}

:::tip
通常的惯例是创建一个 Vite/Rollup 插件作为一个返回实际插件对象的工厂函数。该函数可以接受允许用户自定义插件行为的选项。
:::

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
    },
  }
}
```

### 引入一个虚拟文件 {#importing-a-virtual-file}

请在 [下一小节中](#virtual-modules-convention) 中查看示例：

## 虚拟模块相关说明 {#virtual-modules-convention}

虚拟模块是一种很实用的模式，使你可以对使用 ESM 语法的源文件传入一些编译时信息。

```js
export default function myPlugin() {
  const virtualModuleId = 'virtual:my-module'
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
    },
  }
}
```

这使得可以在 JavaScript 中引入这些模块：

```js
import { msg } from 'virtual:my-module'

console.log(msg)
```

虚拟模块在 Vite（以及 Rollup）中都以 `virtual:` 为前缀，作为面向用户路径的一种约定。如果可能的话，插件名应该被用作命名空间，以避免与生态系统中的其他插件发生冲突。举个例子，`vite-plugin-posts` 可以要求用户导入一个 `virtual:posts` 或者 `virtual:posts/helpers` 虚拟模块来获得编译时信息。在内部，使用了虚拟模块的插件在解析时应该将模块 ID 加上前缀 `\0`，这一约定来自 rollup 生态。这避免了其他插件尝试处理这个 ID（比如 node 解析），而例如 sourcemap 这些核心功能可以利用这一信息来区别虚拟模块和正常文件。`\0` 在导入 URL 中不是一个被允许的字符，因此我们需要在导入分析时替换掉它们。一个虚拟 ID 为 `\0{id}` 在浏览器中开发时，最终会被编码为 `/@id/__x00__{id}`。这个 id 会被解码回进入插件处理管线前的样子，因此这对插件钩子的代码是不可见的。

请注意，直接从真实文件派生出来的模块，就像单文件组件中的脚本模块（如.vue 或 .svelte SFC）不需要遵循这个约定。SFC 通常在处理时生成一组子模块，但这些模块中的代码可以映射回文件系统。对这些子模块使用 `\0` 会使 sourcemap 无法正常工作。

## 通用钩子 {#universal-hooks}

在开发中，Vite 开发服务器会创建一个插件容器来调用 [Rollup 构建钩子](https://rollupjs.org/plugin-development/#build-hooks)，与 Rollup 如出一辙。

以下钩子在服务器启动时被调用：

- [`options`](https://rollupjs.org/plugin-development/#options)
- [`buildStart`](https://rollupjs.org/plugin-development/#buildstart)

以下钩子会在每个传入模块请求时被调用：

- [`resolveId`](https://rollupjs.org/plugin-development/#resolveid)
- [`load`](https://rollupjs.org/plugin-development/#load)
- [`transform`](https://rollupjs.org/plugin-development/#transform)

它们还有一个扩展的 `options` 参数，包含其他特定于 Vite 的属性。你可以在 [SSR 文档](/guide/ssr#ssr-specific-plugin-logic) 中查阅更多内容。

一些 `resolveId` 调用的 `importer` 值可能是根目录下的通用 `index.html` 的绝对路径，这是由于 Vite 非打包的开发服务器模式无法始终推断出实际的导入者。对于在 Vite 的解析管道中处理的导入，可以在导入分析阶段跟踪导入者，提供正确的 `importer` 值。

以下钩子在服务器关闭时被调用：

- [`buildEnd`](https://rollupjs.org/plugin-development/#buildend)
- [`closeBundle`](https://rollupjs.org/plugin-development/#closebundle)

请注意 [`moduleParsed`](https://rollupjs.org/plugin-development/#moduleparsed) 钩子在开发中是 **不会** 被调用的，因为 Vite 为了性能会避免完整的 AST 解析。

[Output Generation Hooks](https://rollupjs.org/plugin-development/#output-generation-hooks)（除了 `closeBundle`) 在开发中是 **不会** 被调用的。你可以认为 Vite 的开发服务器只调用了 `rollup.rollup()` 而没有调用 `bundle.generate()`。

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
      resolve: {
        alias: {
          foo: 'bar',
        },
      },
    }),
  })

  // 直接改变配置（应仅在合并不起作用时使用）
  const mutateConfigPlugin = () => ({
    name: 'mutate-config',
    config(config, { command }) {
      if (command === 'build') {
        config.root = 'foo'
      }
    },
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
  const examplePlugin = () => {
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
      },
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
    },
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
    },
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
      },
    }
  }
  ```

  注意 `configureServer` 在运行生产版本时不会被调用，所以其他钩子需要防范它缺失。

### `configurePreviewServer` {#configurepreviewserver}

- **类型：** `(server: PreviewServer) => (() => void) | void | Promise<(() => void) | void>`
- **种类：** `async`, `sequential`
- **参见：** [PreviewServerForHook](./api-javascript#previewserverforhook)

  与 [`configureServer`](/guide/api-plugin.html#configureserver) 相同，但用于预览服务器。`configurePreviewServer` 这个钩子与 `configureServer` 类似，也是在其他中间件安装前被调用。如果你想要在其他中间件 **之后** 安装一个插件，你可以从 `configurePreviewServer` 返回一个函数，它将会在内部中间件被安装之后再调用：

  ```js
  const myPlugin = () => ({
    name: 'configure-preview-server',
    configurePreviewServer(server) {
      // 返回一个钩子，会在其他中间件安装完成后调用
      return () => {
        server.middlewares.use((req, res, next) => {
          // 自定义处理请求 ...
        })
      }
    },
  })
  ```

### `transformIndexHtml` {#transformindexhtml}

- **类型：** `IndexHtmlTransformHook | { order?: 'pre' | 'post', handler: IndexHtmlTransformHook }`
- **种类：** `async`, `sequential`

  转换 `index.html` 的专用钩子。钩子接收当前的 HTML 字符串和转换上下文。上下文在开发期间暴露[`ViteDevServer`](./api-javascript#vitedevserver)实例，在构建期间暴露 Rollup 输出的包。

  这个钩子可以是异步的，并且可以返回以下其中之一:

  - 经过转换的 HTML 字符串
  - 注入到现有 HTML 中的标签描述符对象数组（`{ tag, attrs, children }`）。每个标签也可以指定它应该被注入到哪里（默认是在 `<head>` 之前）
  - 一个包含 `{ html, tags }` 的对象

  默认情况下 `order` 是 `undefined`，这个钩子会在 HTML 被转换后应用。为了注入一个应该通过 Vite 插件管道的脚本， `order: 'pre'` 指将在处理 HTML 之前应用。 `order: 'post'` 是在所有未定义的 `order` 的钩子函数被应用后才应用。
  
  **基础示例：**

  ```js
  const htmlPlugin = () => {
    return {
      name: 'html-transform',
      transformIndexHtml(html) {
        return html.replace(
          /<title>(.*?)<\/title>/,
          `<title>Title replaced!</title>`,
        )
      },
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
    },
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

  ::: warning 注意
  如果你正在使用一个对入口文件有特殊处理方式的框架（比如 [SvelteKit](https://github.com/sveltejs/kit/discussions/8269#discussioncomment-4509145)），那么这个钩子就不会被触发。
  :::

### `handleHotUpdate` {#handlehotupdate}

- **类型：** `(ctx: HmrContext) => Array<ModuleNode> | void | Promise<Array<ModuleNode> | void>`
- **参见：** [HMR API](./api-hmr)

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

  - 返回一个空数组并进行全面刷新：

    ```js
    handleHotUpdate({ server, modules, timestamp }) {
      // 手动使模块失效
      const invalidatedModules = new Set()
      for (const mod of modules) {
        server.moduleGraph.invalidateModule(
          mod,
          invalidatedModules,
          timestamp,
          true
        )
      }
      server.ws.send({ type: 'full-reload' })
      return []
    }
    ```

  - 返回一个空数组，并通过向客户端发送自定义事件，来进行完全自定义的 HMR处理：

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

请注意，这与钩子的排序是分开的，钩子的顺序仍然会受到它们的 `order` 属性的影响，这一点 [和 Rollup 钩子的表现一样](https://rollupjs.org/plugin-development/#build-hooks)。

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

- 没有使用 [`moduleParsed`](https://rollupjs.org/plugin-development/#moduleparsed) 钩子。
- 它在打包钩子和输出钩子之间没有很强的耦合。

如果一个 Rollup 插件只在构建阶段有意义，则在 `build.rollupOptions.plugins` 下指定即可。它的工作原理与 Vite 插件的 `enforce: 'post'` 和 `apply: 'build'` 相同。

你也可以用 Vite 独有的属性来扩展现有的 Rollup 插件:

```js [vite.config.js]
import example from 'rollup-plugin-example'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    {
      ...example(),
      enforce: 'post',
      apply: 'build',
    },
  ],
})
```

## 路径规范化 {#path-normalization}

Vite 对路径进行了规范化处理，在解析路径时使用 POSIX 分隔符（ / ），同时保留了 Windows 中的卷名。而另一方面，Rollup 在默认情况下保持解析的路径不变，因此解析的路径在 Windows 中会使用 win32 分隔符（ \\ ）。然而，Rollup 插件会使用 `@rollup/pluginutils` 内部的 [`normalizePath` 工具函数](https://github.com/rollup/plugins/tree/master/packages/pluginutils#normalizepath)，它在执行比较之前将分隔符转换为 POSIX。所以意味着当这些插件在 Vite 中使用时，`include` 和 `exclude` 两个配置模式，以及与已解析路径比较相似的路径会正常工作。

所以对于 Vite 插件来说，在将路径与已解析的路径进行比较时，首先规范化路径以使用 POSIX 分隔符是很重要的。从 `vite` 模块中也导出了一个等效的 `normalizePath` 工具函数。

```js
import { normalizePath } from 'vite'

normalizePath('foo\\bar') // 'foo/bar'
normalizePath('foo/bar') // 'foo/bar'
```

## 过滤与 include/exclude 模式 {#filtering-include-exclude-pattern}

Vite 暴露了 [`@rollup/pluginutils` 的 `createFilter`](https://github.com/rollup/plugins/tree/master/packages/pluginutils#createfilter) 函数，以支持 Vite 独有插件和集成使用标准的 include/exclude 过滤模式，Vite 核心自身也正在使用它。

## 客户端与服务端间通信 {#client-server-communication}

从 Vite 2.9 开始，我们为插件提供了一些实用工具，以帮助处理与客户端的通信。

### 服务端到客户端 {#server-to-client}

在插件一侧，我们可以使用 `server.ws.send` 来向客户端广播事件：

```js [vite.config.js]
export default defineConfig({
  plugins: [
    {
      // ...
      configureServer(server) {
        server.ws.on('connection', () => {
          server.ws.send('my:greetings', { msg: 'hello' })
        })
      },
    },
  ],
})
```

::: tip 注意
我们建议总是给你的事件名称 **添加前缀**，以避免与其他插件冲突。
:::

在客户端侧，使用 [`hot.on`](/guide/api-hmr.html#hot-on-event-cb) 去监听事件：

```ts twoslash
import 'vite/client'
// ---cut---
// 客户端
if (import.meta.hot) {
  import.meta.hot.on('my:greetings', (data) => {
    console.log(data.msg) // hello
  })
}
```

### 客户端到服务端 {#client-to-server}

为了从客户端向服务端发送事件，我们可以使用 [`hot.send`](/guide/api-hmr.html#hot-send-event-payload)：

```ts
// 客户端
if (import.meta.hot) {
  import.meta.hot.send('my:from-client', { msg: 'Hey!' })
}
```

然后使用 `server.ws.on` 并在服务端监听这些事件：

```js [vite.config.js]
export default defineConfig({
  plugins: [
    {
      // ...
      configureServer(server) {
        server.ws.on('my:from-client', (data, client) => {
          console.log('Message from client:', data.msg) // Hey!
          //  只回复客户端（如果需要的话）
          client.send('my:ack', { msg: 'Hi! I got your message!' })
        })
      },
    },
  ],
})
```

### 自定义事件的 TypeScript 类型定义指南 {#typeScript-for-custom-events}

Vite 会在内部从 `CustomEventMap` 这个接口推断出 payload 的类型，可以通过扩展这个接口来为自定义事件进行类型定义：

:::tip 提示
在指定 TypeScript 声明文件时，确保包含 `.d.ts` 扩展名。否则，TypeScript 可能不会知道试图扩展的是哪个文件。
:::

```ts [events.d.ts]
import 'vite/types/customEvent.d.ts'

declare module 'vite/types/customEvent.d.ts' {
  interface CustomEventMap {
    'custom:foo': { msg: string }
    // 'event-key': payload
  }
}
```

这个接口扩展被 `InferCustomEventPayload<T>` 所使用，用来推断事件 `T` 的 payload 类型。要了解更多关于这个接口如何被使用的信息，请参考 [HMR API 文档](./api-hmr#hmr-api)。

```ts twoslash
import 'vite/client'
import type { InferCustomEventPayload } from 'vite/types/customEvent.d.ts'
declare module 'vite/types/customEvent.d.ts' {
  interface CustomEventMap {
    'custom:foo': { msg: string }
  }
}
// ---cut---
type CustomFooPayload = InferCustomEventPayload<'custom:foo'>
import.meta.hot?.on('custom:foo', (payload) => {
  // payload 的类型为 { msg: string }
})
import.meta.hot?.on('unknown:event', (payload) => {
  // payload 的类型为 any
})
```
