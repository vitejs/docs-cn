# 服务端渲染 {#server-side-rendering}

:::tip 注意
SSR 特别指支持在 Node.js 中运行相同应用程序的前端框架（例如 React、Preact、Vue 和 Svelte），将其预渲染成 HTML，最后在客户端进行水合处理。如果你正在寻找与传统服务器端框架的集成，请查看 [后端集成指南](./backend-integration)。

下面的指南还假定你在选择的框架中有使用 SSR 的经验，并且只关注特定于 Vite 的集成细节。
:::

:::warning 底层 API
这是一个底层 API，是为库和框架作者准备的。如果你的目标是构建一个应用程序，请确保优先查看 [Vite SSR 章节](https://github.com/vitejs/awesome-vite#ssr) 中更上层的 SSR 插件和工具。也就是说，大部分应用都是基于 Vite 的底层 API 之上构建的。

目前，Vite 正在用 [环境 API](https://github.com/vitejs/vite/discussions/16358) 来改进 SSR API。查看链接了解更多详情。
:::

:::tip 帮助
如果你有疑问，可以到社区 [Discord 的 Vite #ssr 频道](https://discord.gg/PkbxgzPhJv)，这里会帮到你。
:::

## 示例项目 {#example-projects}

Vite 为服务端渲染（SSR）提供了内建支持。[`create-vite-extra`](https://github.com/bluwy/create-vite-extra) 包含了一些你可以用作参考的SSR设置示例：

- [Vanilla](https://github.com/bluwy/create-vite-extra/tree/master/template-ssr-vanilla)
- [Vue](https://github.com/bluwy/create-vite-extra/tree/master/template-ssr-vue)
- [React](https://github.com/bluwy/create-vite-extra/tree/master/template-ssr-react)
- [Preact](https://github.com/bluwy/create-vite-extra/tree/master/template-ssr-preact)
- [Svelte](https://github.com/bluwy/create-vite-extra/tree/master/template-ssr-svelte)
- [Solid](https://github.com/bluwy/create-vite-extra/tree/master/template-ssr-solid)

你也可以通过 [运行 `create-vite`](./index.md#scaffolding-your-first-vite-project) 在本地搭建这些项目，并在框架选项下选择 `Others > create-vite-extra`。

## 源码结构 {#source-structure}

一个典型的 SSR 应用应该有如下的源文件结构：

```
- index.html
- server.js # main application server
- src/
  - main.js          # 导出环境无关的（通用的）应用代码
  - entry-client.js  # 将应用挂载到一个 DOM 元素上
  - entry-server.js  # 使用某框架的 SSR API 渲染该应用
```

`index.html` 将需要引用 `entry-client.js` 并包含一个占位标记供给服务端渲染时注入：

```html [index.html]
<div id="app"><!--ssr-outlet--></div>
<script type="module" src="/src/entry-client.js"></script>
```

你可以使用任何你喜欢的占位标记来替代 `<!--ssr-outlet-->`，只要它能够被正确替换。

## 情景逻辑 {#conditional-logic}

如果需要执行 SSR 和客户端间情景逻辑，可以使用：

```js twoslash
import 'vite/client'
// ---cut---
if (import.meta.env.SSR) {
  // ... 仅在服务端执行的逻辑
}
```

这是在构建过程中被静态替换的，因此它将允许对未使用的条件分支进行摇树优化。

## 设置开发服务器 {#setting-up-the-dev-server}

在构建 SSR 应用程序时，你可能希望完全控制主服务器，并将 Vite 与生产环境脱钩。因此，建议以中间件模式使用 Vite。下面是一个关于 [express](https://expressjs.com/) 的例子：

```js{15-18} twoslash [server.js]
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import express from 'express'
import { createServer as createViteServer } from 'vite'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

async function createServer() {
  const app = express()

  // 以中间件模式创建 Vite 应用，并将 appType 配置为 'custom'
  // 这将禁用 Vite 自身的 HTML 服务逻辑
  // 并让上级服务器接管控制
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'custom'
  })

  // 使用 vite 的 Connect 实例作为中间件
  // 如果你使用了自己的 express 路由（express.Router()），你应该使用 router.use
  // 当服务器重启（例如用户修改了 vite.config.js 后），
  // `vite.middlewares` 仍将保持相同的引用
  // （带有 Vite 和插件注入的新的内部中间件堆栈）。
  // 即使在重新启动后，以下内容仍然有效。
  app.use(vite.middlewares)

  app.use('*', async (req, res) => {
    // 服务 index.html - 下面我们来处理这个问题
  })

  app.listen(5173)
}

createServer()
```

这里 `vite` 是 [ViteDevServer](./api-javascript#vitedevserver) 的一个实例。`vite.middlewares` 是一个 [Connect](https://github.com/senchalabs/connect) 实例，它可以在任何一个兼容 connect 的 Node.js 框架中被用作一个中间件。

下一步是实现 `*` 处理程序供给服务端渲染的 HTML：

```js twoslash [server.js]
// @noErrors
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

/** @type {import('express').Express} */
var app
/** @type {import('vite').ViteDevServer}  */
var vite

// ---cut---
app.use('*', async (req, res, next) => {
  const url = req.originalUrl

  try {
    // 1. 读取 index.html
    let template = fs.readFileSync(
      path.resolve(__dirname, 'index.html'),
      'utf-8',
    )

    // 2. 应用 Vite HTML 转换。这将会注入 Vite HMR 客户端，
    //    同时也会从 Vite 插件应用 HTML 转换。
    //    例如：@vitejs/plugin-react 中的 global preambles
    template = await vite.transformIndexHtml(url, template)

    // 3. 加载服务器入口。vite.ssrLoadModule 将自动转换
    //    你的 ESM 源码使之可以在 Node.js 中运行！无需打包
    //    并提供了一种高效的模块失效机制，类似于模块热替换（HMR）。
    const { render } = await vite.ssrLoadModule('/src/entry-server.js')

    // 4. 渲染应用的 HTML。这假设 entry-server.js 导出的 `render`
    //    函数调用了适当的 SSR 框架 API。
    //    例如 ReactDOMServer.renderToString()
    const appHtml = await render(url)

    // 5. 注入渲染后的应用程序 HTML 到模板中。
    const html = template.replace(`<!--ssr-outlet-->`, appHtml)

    // 6. 返回渲染后的 HTML。
    res.status(200).set({ 'Content-Type': 'text/html' }).end(html)
  } catch (e) {
    // 如果捕获到了一个错误，让 Vite 来修复该堆栈，这样它就可以映射回
    // 你的实际源码中。
    vite.ssrFixStacktrace(e)
    next(e)
  }
})
```

`package.json` 中的 `dev` 脚本也应该相应地改变，使用服务器脚本：

```diff [package.json]
  "scripts": {
-   "dev": "vite"
+   "dev": "node server"
  }
```

## 生产环境构建 {#building-for-production}

为了将 SSR 项目交付生产，我们需要：

1. 正常生成一个客户端构建；
2. 再生成一个 SSR 构建，使其通过 `import()` 直接加载，这样便无需再使用 Vite 的 `ssrLoadModule`；

`package.json` 中的脚本应该看起来像这样：

```json [package.json]
{
  "scripts": {
    "dev": "node server",
    "build:client": "vite build --outDir dist/client",
    "build:server": "vite build --outDir dist/server --ssr src/entry-server.js"
  }
}
```

注意使用 `--ssr` 标志表明这将会是一个 SSR 构建。同时需要指定 SSR 的入口。

接着，在 `server.js` 中，通过 `process.env.NODE_ENV` 条件分支，需要添加一些用于生产环境的特定逻辑：

- 使用 `dist/client/index.html` 作为模板，而不是根目录的 `index.html`，因为前者包含了到客户端构建的正确资源链接。

- 使用 `import('./dist/server/entry-server.js')` （该文件是 SSR 构建产物），而不是使用 `await vite.ssrLoadModule('/src/entry-server.js')`。

- 将 `vite` 开发服务器的创建和所有使用都移到 dev-only 条件分支后面，然后添加静态文件服务中间件来服务 `dist/client` 中的文件。

可以参考 [示例项目](#example-projects) 以获取一个可运行的设置。

## 生成预加载指令 {#generating-preload-directives}

`vite build` 支持使用 `--ssrManifest` 标志，这将会在构建输出目录中生成一份 `.vite/ssr-manifest.json`：

```diff
- "build:client": "vite build --outDir dist/client",
+ "build:client": "vite build --outDir dist/client --ssrManifest",
```

上面的脚本将会为客户端构建生成 `dist/client/.vite/ssr-manifest.json`（是的，该 SSR 清单是从客户端构建生成而来，因为我们想要将模块 ID 映射到客户端文件上）。清单包含模块 ID 到它们关联的 chunk 和资源文件的映射。

为了利用该清单，框架需要提供一种方法来收集在服务端渲染调用期间使用到的组件模块 ID。

`@vitejs/plugin-vue` 支持该功能，开箱即用，并会自动注册使用的组件模块 ID 到相关的 Vue SSR 上下文：

```js [src/entry-server.js]
const ctx = {}
const html = await vueServerRenderer.renderToString(app, ctx)
// ctx.modules 现在是一个渲染期间使用的模块 ID 的 Set
```

我们现在需要在 `server.js` 的生产环境分支下读取该清单，并将其传递到 `src/entry-server.js` 导出的 `render` 函数中。这将为我们提供足够的信息，来为异步路由相应的文件渲染预加载指令！查看 [示例代码](https://github.com/vitejs/vite-plugin-vue/blob/main/playground/ssr-vue/src/entry-server.js) 获取完整示例。你还可以利用 [103 Early Hints](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/103) 所提供的信息。

## 预渲染 / SSG {#pre-rendering--ssg}

如果预先知道某些路由所需的路由和数据，我们可以使用与生产环境 SSR 相同的逻辑将这些路由预先渲染到静态 HTML 中。这也被视为一种静态站点生成（SSG）的形式。查看 [示例渲染代码](https://github.com/vitejs/vite-plugin-vue/blob/main/playground/ssr-vue/prerender.js) 获取有效示例。

## SSR 外部化 {#ssr-externals}

当运行 SSR 时依赖会由 Vite 的 SSR 转换模块系统作外部化。这会同时提速开发与构建。

如果依赖需要被 Vite 的管道转换，例如因为其中使用了未经过转译的 Vite 特性，那么它们可以被添加到 [`ssr.noExternal`](../config/ssr-options.md#ssr-noexternal) 中。

对于采用链接的依赖，它们将默认不会被外部化，这是为了能使其利用 Vite HMR 的优势。如果你不需要这一功效，例如，想要把这些依赖当成非链接情况来测试，你可以将其添加到 [`ssr.external`](../config/ssr-options.md#ssr-external)。

:::warning 使用别名
如果你为某个包配置了一个别名，为了能使 SSR 外部化依赖功能正常工作，你可能想要使用的别名应该指的是实际的 `node_modules` 中的包。[Yarn](https://classic.yarnpkg.com/en/docs/cli/add/#toc-yarn-add-alias) 和 [pnpm](https://pnpm.io/aliases/) 都支持通过 `npm:` 前缀来设置别名。
:::

## SSR 专有插件逻辑 {#ssr-specific-plugin-logic}

一些框架，如 Vue 或 Svelte，会根据客户端渲染和服务端渲染的区别，将组件编译成不同的格式。可以向以下的插件钩子中，给 Vite 传递额外的 `options` 对象，对象中包含 `ssr` 属性来支持根据情景转换：

- `resolveId`
- `load`
- `transform`

**示例：**

```js twoslash
/** @type {() => import('vite').Plugin} */
// ---cut---
export function mySSRPlugin() {
  return {
    name: 'my-ssr',
    transform(code, id, options) {
      if (options?.ssr) {
        // 执行 ssr 专有转换...
      }
    },
  }
}
```

`load` 和 `transform` 中的 `options` 对象为可选项，rollup 目前并未使用该对象，但将来可能会用额外的元数据来扩展这些钩子函数。

:::tip Note
Vite 2.7 之前的版本，会提示你 `ssr` 参数的位置不应该是 `options` 对象。目前所有主要框架和插件都已对应更新，但你可能还是会发现使用过时 API 的旧文章。
:::

## SSR 构建目标 {#ssr-target}

SSR 构建的默认目标为 node 环境，但你也可以让服务运行在 Web Worker 上。每个平台的打包条目解析是不同的。你可以将`ssr.target` 设置为 `webworker`，以将目标配置为 Web Worker。

## SSR 构建产物 {#ssr-bundle}

在某些如 `webworker` 运行时等特殊情况中，你可能想要将你的 SSR 打包成单个 JavaScript 文件。你可以通过设置 `ssr.noExternal` 为 `true` 来启用这个行为。这将会做两件事：

- 将所有依赖视为 `noExternal`（非外部化）
- 若任何 Node.js 内置内容被引入，将抛出一个错误

## SSR Resolve Conditions

默认情况下包的入口解析将会使用 [`resolve.conditions`](../config/shared-options.md#resolve-conditions) 中设置的条件来进行 SSR 构建。你可以使用 [`ssr.resolve.conditions`](../config/ssr-options.md#ssr-resolve-conditions) 和 [`ssr.resolve.externalConditions`](../config/ssr-options.md#ssr-resolve-externalconditions) 来自定义这个行为。

## Vite CLI {#vite-cli}

CLI 命令 `$ vite dev` 和 `$ vite preview` 也可以用于 SSR 应用：你可以将你的 SSR 中间件通过 [`configureServer`](/guide/api-plugin#configureserver) 添加到开发服务器、以及通过 [`configurePreviewServer`](/guide/api-plugin#configurepreviewserver) 添加到预览服务器。

:::tip 注意
使用一个后置钩子，使得你的 SSR 中间件在 Vite 的中间件 _之后_ 运行。
:::
