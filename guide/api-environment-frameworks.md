# 用于框架的环境 API {#environment-api-for-frameworks}

:::info 发布候选版本
环境 API 目前处于发布候选阶段。我们将在主要版本发布之间保持 API 的稳定性，以便生态系统能够进行实验并在此基础上进行开发。然而，请注意，[某些特定的 API](/changes/#considering) 仍被视为实验性 API。

我们计划在未来主要版本发布时，待下游项目有足够时间对新功能进行实验并验证后，对这些新 API（可能包含兼容性变更）进行稳定化处理。

资料：

- [反馈讨论](https://github.com/vitejs/vite/discussions/16358) 我们在此处收集新 API 的反馈。
- [环境 API PR](https://github.com/vitejs/vite/pull/16471) 新 API 在此处被实现并进行了审查。

请与我们分享您的反馈。
:::

## 开发环境通信级别 {#devenvironment-communication-levels}

由于环境可能在不同的运行时环境中运行，与环境的通信可能会受到运行时环境的限制。为了使框架能够轻松编写与运行时环境无关的代码，环境 API 提供了三种通信级别。

### `RunnableDevEnvironment`

<<<<<<< HEAD
`RunnableDevEnvironment` 是一种能够传递任意值的环境。隐式 `ssr` 环境及其他非客户端环境在开发阶段默认使用 `RunnableDevEnvironment`。虽然这要求运行时与 Vite 服务器运行的环境一致，但其工作原理与 `ssrLoadModule` 类似，并允许框架迁移并为其 SSR 开发流程启用 HMR。您可以通过 `isRunnableDevEnvironment` 函数对任何可运行环境进行保护。
=======
`RunnableDevEnvironment` is an environment that can communicate arbitrary JavaScript values with your application code. Importing a module returns its real, live exports (functions, class instances, and any other values), so frameworks can run their server entries directly. The implicit `ssr` environment and other non-client environments use a `RunnableDevEnvironment` by default during dev. You can guard access to the runner with the `isRunnableDevEnvironment` function.

Its `runner` is a `ModuleRunner`. You import modules through it with `runner.import(url)`, which fetches, transforms, and evaluates a module from the Vite module graph (the `url` accepts a file path, server path, or id relative to the root) and returns the instantiated module with full HMR support. It is the modern replacement for `server.ssrLoadModule`, so frameworks can migrate to it to enable HMR for their SSR dev story.

:::info Why it can communicate arbitrary values
A `RunnableDevEnvironment` evaluates modules in the same runtime as the Vite server, so values cross the boundary in-process instead of being serialized. This is what distinguishes it from [`FetchableDevEnvironment`](#fetchabledevenvironment), which can only communicate through serialized `Request`/`Response` objects over the Fetch API. As a result, using a `RunnableDevEnvironment` requires the runner's runtime to be the same as the one the Vite server is running in.
:::
>>>>>>> 72679918273e579ba5cdc82fd8a86b48fa7d0e34

```ts
export class RunnableDevEnvironment extends DevEnvironment {
  public readonly runner: ModuleRunner
}

class ModuleRunner {
  /**
   * 要执行的 URL。
   * 可以接受文件路径，服务器路径，或者相对于根路径的 id。
   * 返回一个实例化的模块（和 ssrLoadModule 中的一样）
   */
  public async import(url: string): Promise<Record<string, any>>
  /**
   * 其他的 ModuleRunner 方法...
   */
}

if (isRunnableDevEnvironment(server.environments.ssr)) {
  await server.environments.ssr.runner.import('/entry-point.js')
}
```

:::warning
只有在第一次使用时，`runner` 才会被加载。请注意，当通过调用 `process.setSourceMapsEnabled` 或在不支持的情况下重写 `Error.prepareStackTrace` 创建 `runner` 时，Vite 会启用源映射支持。
:::

假设已按照[SSR 设置指南](/guide/ssr#setting-up-the-dev-server)中描述的方式配置了 Vite 服务器的中间件模式，现在我们使用环境 API 实现 SSR 中间件。请注意，它不必命名为 `ssr`，因此在本示例中我们将它命名为 `server`。错误处理已省略。

```js
import fs from 'node:fs'
import path from 'node:path'
import { createServer } from 'vite'

const viteServer = await createServer({
  server: { middlewareMode: true },
  appType: 'custom',
  environments: {
    server: {
      // 默认情况下，模块与 vite 开发服务器在同一进程中运行
    },
  },
})

// 在 TypeScript 中，你可能需要将这个转换为 RunnableDevEnvironment，或者
// 使用 "isRunnableDevEnvironment" 来保护对运行器的访问
const serverEnvironment = viteServer.environments.server

app.use('*', async (req, res, next) => {
  const url = req.originalUrl

  // 1. 读取 index.html
  const indexHtmlPath = path.resolve(import.meta.dirname, 'index.html')
  let template = fs.readFileSync(indexHtmlPath, 'utf-8')

  // 2. 应用 Vite HTML 转换。这将注入 Vite HMR 客户端，
  //    并应用来自 Vite 插件的 HTML 转换，例如
  //    @vitejs/plugin-react 提供的全局前置代码
  template = await viteServer.transformIndexHtml(url, template)

  // 3. 加载服务器入口文件。import(url) 自动将
  //    ESM 源代码转换为 Node.js 可用的代码！
  //    不需要打包，并且提供全面的 HMR 支持。
  const { render } = await serverEnvironment.runner.import(
    '/src/entry-server.js',
  )

  // 4. 渲染应用的 HTML。将假设 entry-server.js 导出的
  //    `render` 函数调用了对应框架的 SSR API，
  //    例如 ReactDOMServer.renderToString()
  const appHtml = await render(url)

  // 5. 将应用渲染的 HTML 注入到模板中。
  const html = template.replace(`<!--ssr-outlet-->`, appHtml)

  // 6. 发送渲染后的 HTML 回去。
  res.status(200).set({ 'Content-Type': 'text/html' }).end(html)
})
```

在使用支持 HMR（如 `RunnableDevEnvironment`）的环境时，您应在服务器入口文件中添加 `import.meta.hot.accept()` 以获得最佳性能。若未添加此代码，服务器文件的更改将导致整个服务器模块图失效：

```js
// src/entry-server.js
export function render(...) { ... }

if (import.meta.hot) {
  import.meta.hot.accept()
}
```

### `FetchableDevEnvironment`

:::info

我们正在征集对 [`FetchableDevEnvironment` 提案](https://github.com/vitejs/vite/discussions/18191) 的反馈意见。

:::

`FetchableDevEnvironment` 是一种可以通过 [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Window/fetch) 接口与运行时进行通信的环境。由于 `RunnableDevEnvironment` 仅能在有限的运行时环境中实现，我们建议使用 `FetchableDevEnvironment` 替代 `RunnableDevEnvironment`。

<<<<<<< HEAD
该环境通过 `handleRequest` 方法提供了一种标准化的请求处理方式：
=======
A common reason to reach for it is a framework that wants to support a runtime that can't run Vite directly (e.g. Cloudflare Workers). A `RunnableDevEnvironment` can't be used there, since it requires the runner to share the Vite server's runtime so values can cross the boundary in-process. Standardizing on the Fetch API lets the framework keep a single request-handling path across all of its target runtimes: its dev middleware forwards each incoming browser request as a `Request` and sends the returned `Response` back to the browser, mirroring how the app handles requests in production.

This environment provides a standardized way of handling requests via the `handleRequest` method:
>>>>>>> 72679918273e579ba5cdc82fd8a86b48fa7d0e34

```ts
import {
  createServer,
  createFetchableDevEnvironment,
  isFetchableDevEnvironment,
} from 'vite'

const server = await createServer({
  server: { middlewareMode: true },
  appType: 'custom',
  environments: {
    custom: {
      dev: {
        createEnvironment(name, config) {
          return createFetchableDevEnvironment(name, config, {
            handleRequest(request: Request): Promise<Response> | Response {
              // 处理请求和返回响应
            },
          })
        },
      },
    },
  },
})

// 环境 API 的任何使用者现在都可以调用 `dispatchFetch`
if (isFetchableDevEnvironment(server.environments.custom)) {
  const response: Response = await server.environments.custom.dispatchFetch(
    new Request('http://example.com/request-to-handle'),
  )
}
```

:::warning
Vite 验证 `dispatchFetch` 方法的输入和输出：请求必须是全局 `Request` 类的实例，响应必须是全局 `Response` 类的实例。如果不符合此条件，Vite 将抛出 `TypeError` 异常。

请注意，尽管 `FetchableDevEnvironment` 作为类实现，但 Vite 团队将其视为实现细节，可能随时发生变化。
:::

### raw `DevEnvironment`

如果环境未实现 `RunnableDevEnvironment` 或 `FetchableDevEnvironment` 接口，您需要手动设置通信。

如果您的代码可以在与用户模块相同的运行时环境中运行（即不依赖于 Node.js 特定的 API），您可以使用虚拟模块。这种方法消除了通过 Vite 的 API 从代码中访问值的必要性。

```ts
// 使用 Vite API 的代码
import { createServer } from 'vite'

const server = createServer({
  plugins: [
    // 处理 `virtual:entrypoint` 的插件
    {
      name: 'virtual-module',
      /* 插件实现 */
    },
  ],
})
const ssrEnvironment = server.environment.ssr
const input = {}

// 使用每个环境工厂暴露的函数来运行代码
// 检查每个环境工厂提供了什么
if (ssrEnvironment instanceof RunnableDevEnvironment) {
  ssrEnvironment.runEntrypoint('virtual:entrypoint')
} else {
  throw new Error(`Unsupported runtime for ${ssrEnvironment.name}`)
}

// -------------------------------------
// virtual:entrypoint
const { createHandler } = await import('./entrypoint.js')
const handler = createHandler(input)
const response = handler(new Request('http://example.com/'))

// -------------------------------------
// ./entrypoint.js
export function createHandler(input) {
  return function handler(req) {
    return new Response('hello')
  }
}
```

例如，如果你想在用户模块上调用 `transformIndexHtml`，你可以使用以下插件：

```ts {13-21}
function vitePluginVirtualIndexHtml(): Plugin {
  let server: ViteDevServer | undefined
  return {
    name: vitePluginVirtualIndexHtml.name,
    configureServer(server_) {
      server = server_
    },
    resolveId(source) {
      return source === 'virtual:index-html' ? '\0' + source : undefined
    },
    async load(id) {
      if (id === '\0' + 'virtual:index-html') {
        let html: string
        if (server) {
          this.addWatchFile('index.html')
          html = fs.readFileSync('index.html', 'utf-8')
          html = await server.transformIndexHtml('/', html)
        } else {
          html = fs.readFileSync('dist/client/index.html', 'utf-8')
        }
        return `export default ${JSON.stringify(html)}`
      }
      return
    },
  }
}
```

如果你的代码需要 Node.js API，你可以使用 `hot.send` 从用户模块与使用 Vite API 的代码进行通信。但是，请注意，这种方式在构建过程后可能无法以相同的方式工作。

```ts
// 使用 Vite API 的代码
import { createServer } from 'vite'

const server = createServer({
  plugins: [
    // 处理 `virtual:entrypoint` 的插件
    {
      name: 'virtual-module',
      /* 插件实现 */
    },
  ],
})
const ssrEnvironment = server.environment.ssr
const input = {}

// 使用每个环境工厂暴露的函数来运行代码
// 检查每个环境工厂提供了什么
if (ssrEnvironment instanceof RunnableDevEnvironment) {
  ssrEnvironment.runner.import('virtual:entrypoint')
} else if (ssrEnvironment instanceof CustomDevEnvironment) {
  ssrEnvironment.runEntrypoint('virtual:entrypoint')
} else {
  throw new Error(`Unsupported runtime for ${ssrEnvironment.name}`)
}

const req = new Request('http://example.com/')

const uniqueId = 'a-unique-id'
ssrEnvironment.send('request', serialize({ req, uniqueId }))
const response = await new Promise((resolve) => {
  ssrEnvironment.on('response', (data) => {
    data = deserialize(data)
    if (data.uniqueId === uniqueId) {
      resolve(data.res)
    }
  })
})

// -------------------------------------
// virtual:entrypoint
const { createHandler } = await import('./entrypoint.js')
const handler = createHandler(input)

import.meta.hot.on('request', (data) => {
  const { req, uniqueId } = deserialize(data)
  const res = handler(req)
  import.meta.hot.send('response', serialize({ res: res, uniqueId }))
})

const response = handler(new Request('http://example.com/'))

// -------------------------------------
// ./entrypoint.js
export function createHandler(input) {
  return function handler(req) {
    return new Response('hello')
  }
}
```

## 构建过程中的环境 {#environments-during-build}

在命令行接口中，调用 `vite build` 和 `vite build --ssr` 仍将只构建客户端和仅 ssr 环境以保证向后兼容性。

<<<<<<< HEAD
当 `builder` 选项不为 `undefined` 时（或者调用 `vite build --app`）时，`vite build` 将选择构建整个应用。这将在未来的主要版本中成为默认设置。将创建一个 `ViteBuilder` 实例（构建时等同于 `ViteDevServer`），用于为生产环境构建所有配置的环境。默认情况下，环境的构建按照 `environments` 记录的顺序依次运行。框架或用户可以进一步使用 `builder.buildApp` 选项配置环境的构建方式：
=======
When the `builder` option is set (even to an empty object `{}`, which is what `vite build --app` does), `vite build` opts in to building the entire app instead. This will become the default in a future major. In this mode, Vite creates a `ViteBuilder` instance (the build-time equivalent of a `ViteDevServer`) and uses it to build all configured environments for production. By default, environments are built in series, following the order of the `environments` record.

### Configuring the app build with `builder.buildApp`

A framework or user can control how the environments are built through the `builder.buildApp` option. It receives the `ViteBuilder` instance (named `builder` in the example below) and is responsible for building each environment; for instance, to build some of them in parallel:
>>>>>>> 72679918273e579ba5cdc82fd8a86b48fa7d0e34

```js [vite.config.js]
import { defineConfig } from 'vite'

export default defineConfig({
  builder: {
    buildApp: async (builder) => {
      const environments = Object.values(builder.environments)
      await Promise.all(
        environments.map((environment) => builder.build(environment)),
      )
    },
  },
})
```

<<<<<<< HEAD
插件还可以定义一个 `buildApp` 钩子。顺序 `'pre'` 和 `null` 在配置的 `builder.buildApp` 之前执行，顺序 `'post'` 钩子在其之后执行。`environment.isBuilt` 可用于检查环境是否已被构建。
=======
### The `buildApp` plugin hook

Besides the `builder.buildApp` config option, plugins can define a `buildApp` hook to participate in the app build. The config option and the plugin hooks run in a defined order: hooks with order `'pre'` or `null` run first, then the configured `builder.buildApp`, then hooks with order `'post'`. Within a hook, `environment.isBuilt` tells you whether an environment has already been built, which lets a plugin avoid building it twice.

### Building programmatically with `createBuilder`

To trigger an app build from your own code, use `createBuilder` instead of the standalone `build` function. `createBuilder` is the build-time equivalent of `createServer`: it resolves the config and returns a `ViteBuilder`, whose `buildApp` method builds every configured environment. You can also build a single environment with `builder.build(environment)`.

```js [build.js]
import { createBuilder } from 'vite'

const builder = await createBuilder()
await builder.buildApp()
```

`createBuilder` supersedes the standalone `build` function for environment-aware builds. `build` still works as the simple entry point for the legacy client-only and ssr-only builds described above, but it cannot build arbitrary environments. Running `builder.buildApp()` is the programmatic equivalent of `vite build --app`.
>>>>>>> 72679918273e579ba5cdc82fd8a86b48fa7d0e34

## 环境无关的代码 {#environment-agnostic-code}

大部分情况，当前的 `environment` 实例会作为正在运行代码的上下文中的一部分，所以通过 `server.environments` 来访问它们的需求应该很少。例如，在插件钩子内部，环境是作为 `PluginContext` 的一部分暴露出来的，所以可以使用 `this.environment` 来访问它。参见 [用于插件的环境 API](./api-environment-plugins.md) 了解如何构建对环境敏感的插件。
