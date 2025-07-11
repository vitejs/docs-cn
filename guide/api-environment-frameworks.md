# 用于框架的环境 API {#environment-api-for-frameworks}

:::info 发布候选版本
环境 API 目前处于发布候选阶段。我们将在主要版本发布之间保持 API 的稳定性，以便生态系统能够进行实验并在此基础上进行开发。然而，请注意，[某些特定的 API](/changes/#considering) 仍被视为实验性 API。

我们计划在未来主要版本发布时，待下游项目有足够时间对新功能进行实验并验证后，对这些新 API（可能包含兼容性变更）进行稳定化处理。

资料：

- [反馈讨论](https://github.com/vitejs/vite/discussions/16358) 我们在此处收集新 API 的反馈。
- [环境 API PR](https://github.com/vitejs/vite/pull/16471) 新 API 在此处被实现并进行了审查。

请与我们分享您的反馈。
:::

<<<<<<< HEAD
## 环境和框架 {#environments-and-frameworks}

隐式的 `ssr` 环境和其他非客户端环境在开发过程中默认使用 `RunnableDevEnvironment`。虽然这要求运行时与 Vite 服务器运行的环境相同，但这与 `ssrLoadModule` 类似，允许框架迁移并为其 SSR 开发方案启用模块热替换（HMR）。你可以使用 `isRunnableDevEnvironment` 函数来保护任何可运行的环境。
=======
## DevEnvironment Communication Levels

Since environments may run in different runtimes, communication against the environment may have constraints depending on the runtime. To allow frameworks to write runtime agnostic code easily, the Environment API provides three kinds of communication levels.

### `RunnableDevEnvironment`

`RunnableDevEnvironment` is an environment that can communicate arbitrary values. The implicit `ssr` environment and other non-client environments use a `RunnableDevEnvironment` by default during dev. While this requires the runtime to be the same with the one the Vite server is running in, this works similarly with `ssrLoadModule` and allows frameworks to migrate and enable HMR for their SSR dev story. You can guard any runnable environment with an `isRunnableDevEnvironment` function.
>>>>>>> 55d2c4e66962b48725ec13b1b87d3073deaea349

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

<<<<<<< HEAD
那些通过 [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Window/fetch) 与它们的运行环境进行交互的框架可以使用 `FetchableDevEnvironment`，它提供了一种标准化的方式来通过 `handleRequest` 方法处理请求：

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
              // 处理请求并返回响应
            },
          })
        },
      },
    },
  },
})

// 现在，任何使用环境 API 的人都可以调用 `dispatchFetch`
if (isFetchableDevEnvironment(server.environments.custom)) {
  const response: Response = await server.environments.custom.dispatchFetch(
    new Request('/request-to-handle'),
  )
}
```

:::warning
Vite 会检查 `dispatchFetch` 方法的输入和输出：请求必须是全局 `Request` 类的一个实例，而响应必须是全局 `Response` 类的一个实例。如果不满足这些条件，Vite 将会抛出一个 `TypeError`。

尽管 `FetchableDevEnvironment` 是作为一个类来实现的，但请注意，Vite 团队可能会随时更改它，因为其被视为实现细节部分。
:::

## 默认 `RunnableDevEnvironment` {#default-runnabledevenvironment}

假设我们有一个配置为中间件模式的 Vite 服务器，如 [SSR 设置指南](/guide/ssr#setting-up-the-dev-server) 所述，我们可以使用环境 API 来实现 SSR 中间件。请记住，它不必命名为 `ssr`，因此在本例中我们将其命名为 `server`。错误处理部分已省略。
=======
Given a Vite server configured in middleware mode as described by the [SSR setup guide](/guide/ssr#setting-up-the-dev-server), let's implement the SSR middleware using the environment API. Remember that it doesn't have to be called `ssr`, so we'll name it `server` in this example. Error handling is omitted.
>>>>>>> 55d2c4e66962b48725ec13b1b87d3073deaea349

```js
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createServer } from 'vite'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

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
  const indexHtmlPath = path.resolve(__dirname, 'index.html')
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

<<<<<<< HEAD
## 运行时无关的 SSR {#runtime-agnostic-ssr}

由于 `RunnableDevEnvironment` 只能用于在与 Vite 服务器相同的运行时中运行代码，它需要一个可以运行 Vite 服务器的运行时（即与 Node.js 兼容的运行时）。这意味着您需要使用原始的 `DevEnvironment` 来使其对运行时无关。

:::info `FetchableDevEnvironment` 提议

最初的提议是在 `DevEnvironment` 类上有一个 `run` 方法，该方法将允许消费者通过使用 `transport` 选项在运行器端调用一个导入。在我们的测试中，我们发现 API 还不够通用，以至于我们暂时不开始推荐它。目前，我们正在寻求对 [`FetchableDevEnvironment` 提议](https://github.com/vitejs/vite/discussions/18191) 的反馈。

:::

`RunnableDevEnvironment` 有一个 `runner.import` 函数，返回模块的值。但是这个函数在原始的 `DevEnvironment` 中不可用，并且需要将使用 Vite 的 API 和用户模块的代码解耦。

例如，下面的例子中，使用 Vite API 的代码使用了用户模块的值：

```ts
// 使用 Vite API 的代码
import { createServer } from 'vite'
=======
### `FetchableDevEnvironment`

:::info

We are looking for feedback on [the `FetchableDevEnvironment` proposal](https://github.com/vitejs/vite/discussions/18191).

:::

`FetchableDevEnvironment` is an environment that can communicate with its runtime via the [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Window/fetch) interface. Since the `RunnableDevEnvironment` is only possible to implement in a limited set of runtimes, we recommend to use the `FetchableDevEnvironment` instead of the `RunnableDevEnvironment`.

This environment provides a standardized way of handling requests via the `handleRequest` method:

```ts
import {
  createServer,
  createFetchableDevEnvironment,
  isFetchableDevEnvironment,
} from 'vite'
>>>>>>> 55d2c4e66962b48725ec13b1b87d3073deaea349

const server = await createServer({
  server: { middlewareMode: true },
  appType: 'custom',
  environments: {
    custom: {
      dev: {
        createEnvironment(name, config) {
          return createFetchableDevEnvironment(name, config, {
            handleRequest(request: Request): Promise<Response> | Response {
              // handle Request and return a Response
            },
          })
        },
      },
    },
  },
})

// Any consumer of the environment API can now call `dispatchFetch`
if (isFetchableDevEnvironment(server.environments.custom)) {
  const response: Response = await server.environments.custom.dispatchFetch(
    new Request('/request-to-handle'),
  )
}
```

<<<<<<< HEAD
如果你的代码可以在与用户模块相同的运行时中运行（即，它不依赖于 Node.js 特定的 API），你可以使用虚拟模块。这种方法避免了从使用 Vite API 的代码中获取值的需求。
=======
:::warning
Vite validates the input and output of the `dispatchFetch` method: the request must be an instance of the global `Request` class and the response must be the instance of the global `Response` class. Vite will throw a `TypeError` if this is not the case.

Note that although the `FetchableDevEnvironment` is implemented as a class, it is considered an implementation detail by the Vite team and might change at any moment.
:::

### raw `DevEnvironment`

If the environment does not implement the `RunnableDevEnvironment` or `FetchableDevEnvironment` interfaces, you need to set up the communication manually.

If your code can run in the same runtime as the user modules (i.e., it does not rely on Node.js-specific APIs), you can use a virtual module. This approach eliminates the need to access the value from the code using Vite's APIs.
>>>>>>> 55d2c4e66962b48725ec13b1b87d3073deaea349

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

<<<<<<< HEAD
// 使用每个环境工厂暴露的函数来运行代码
// 检查每个环境工厂提供了什么
if (ssrEnvironment instanceof RunnableDevEnvironment) {
  ssrEnvironment.runner.import('virtual:entrypoint')
} else if (ssrEnvironment instanceof CustomDevEnvironment) {
=======
// use exposed functions by each environment factories that runs the code
// check for each environment factories what they provide
if (ssrEnvironment instanceof CustomDevEnvironment) {
>>>>>>> 55d2c4e66962b48725ec13b1b87d3073deaea349
  ssrEnvironment.runEntrypoint('virtual:entrypoint')
} else {
  throw new Error(`Unsupported runtime for ${ssrEnvironment.name}`)
}

// -------------------------------------
// virtual:entrypoint
const { createHandler } = await import('./entrypoint.js')
const handler = createHandler(input)
const response = handler(new Request('/'))

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

const req = new Request('/')

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

const response = handler(new Request('/'))

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

当 `builder` 为 `undefined` 时（或者调用 `vite build --app`）时，`vite build` 将选择构建整个应用。这将在未来的主要版本中成为默认设置。将创建一个 `ViteBuilder` 实例（构建时等同于 `ViteDevServer`），用于为生产环境构建所有配置的环境。默认情况下，环境的构建按照 `environments` 记录的顺序依次运行。框架或用户可以进一步配置环境的构建方式，使用：

```js
export default {
  builder: {
    buildApp: async (builder) => {
      const environments = Object.values(builder.environments)
      return Promise.all(
        environments.map((environment) => builder.build(environment)),
      )
    },
  },
}
```

插件还可以定义一个 `buildApp` 钩子。顺序 `'pre'` 和 `'null'` 在配置的 `builder.buildApp` 之前执行，顺序 `'post'` 钩子在其之后执行。`environment.isBuilt` 可用于检查环境是否已被构建。

## 环境无关的代码 {#environment-agnostic-code}

大部分情况，当前的 `environment` 实例会作为正在运行代码的上下文中的一部分，所以通过 `server.environments` 来访问它们的需求应该很少。例如，在插件钩子内部，环境是作为 `PluginContext` 的一部分暴露出来的，所以可以使用 `this.environment` 来访问它。参见 [用于插件的环境 API](./api-environment-plugins.md) 了解如何构建对环境敏感的插件。
