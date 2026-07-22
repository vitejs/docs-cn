# 用于框架的环境 API {#environment-api-for-frameworks}

:::info 发布候选版本
环境 API 目前处于发布候选阶段。我们将在主要版本发布之间保持 API 的稳定性，以便生态系统能够进行实验并在此基础上进行开发。然而，请注意，[某些特定的 API](/changes/#considering) 仍被视为实验性 API。

我们计划在未来主要版本发布时，待下游项目有足够时间对新功能进行实验并验证后，对这些新 API（可能包含兼容性变更）进行稳定化处理。

资料：

- [反馈讨论](https://github.com/vitejs/vite/discussions/16358) 我们在此处收集新 API 的反馈。
- [环境 API PR](https://github.com/vitejs/vite/pull/16471) 新 API 在此处被实现并进行了审查。

请与我们分享你的反馈。
:::

## 开发环境通信级别 {#devenvironment-communication-levels}

由于环境可能在不同的运行时环境中运行，与环境的通信可能会受到运行时环境的限制。为了使框架能够轻松编写与运行时环境无关的代码，环境 API 提供了三种通信级别。

### `RunnableDevEnvironment`

`RunnableDevEnvironment` 是一种能够在环境与应用代码之间传递任意 JavaScript 值的环境。导入模块时，它会返回真实且可直接使用的导出值（函数、类实例及其他任何值），因此框架可以直接运行服务端入口。隐式 `ssr` 环境及其他非客户端环境在开发阶段默认使用 `RunnableDevEnvironment`。你可以使用 `isRunnableDevEnvironment` 函数来保护对 runner 的访问。

它的 `runner` 是一个 `ModuleRunner`。你可以通过 `runner.import(url)` 导入模块：该方法会从 Vite 模块图中获取、转换并执行模块（`url` 可以是文件路径、服务器路径或相对于根目录的 id），然后返回支持完整 HMR 的实例化模块。它是 `server.ssrLoadModule` 的现代替代方案，框架可以迁移到此 API，为 SSR 开发流程启用 HMR。

::: info 为何它能够传递任意值
`RunnableDevEnvironment` 与 Vite 服务器在同一运行时中执行模块，因此值可以在进程内跨越边界，而无需序列化。这正是它与 [`FetchableDevEnvironment`](#fetchabledevenvironment) 的区别，后者只能通过 Fetch API 传递序列化后的 `Request`/`Response` 对象。因此，使用 `RunnableDevEnvironment` 时，runner 的运行时必须与 Vite 服务器所在的运行时相同。
:::

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

假设已按照 [SSR 设置指南](/guide/ssr#setting-up-the-dev-server) 中描述的方式配置了 Vite 服务器的中间件模式，现在我们使用环境 API 实现 SSR 中间件。请注意，它不必命名为 `ssr`，因此在本示例中我们将它命名为 `server`。错误处理已省略。

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

在使用支持 HMR（如 `RunnableDevEnvironment`）的环境时，你应在服务器入口文件中添加 `import.meta.hot.accept()` 以获得最佳性能。若未添加此代码，服务器文件的更改将导致整个服务器模块图失效：

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

一个常见用例是框架需要支持无法直接运行 Vite 的运行时（例如 Cloudflare Workers）。这种场景无法使用 `RunnableDevEnvironment`，因为它要求 runner 与 Vite 服务器共享同一运行时，以便值在进程内跨越边界。基于 Fetch API 的标准化方案使框架可以在所有目标运行时中复用同一套请求处理流程：开发中间件将每个浏览器请求作为 `Request` 转发，再将返回的 `Response` 发送回浏览器，从而与生产环境中的应用请求处理方式保持一致。

该环境通过 `handleRequest` 方法提供了一种标准化的请求处理方式：

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

如果环境未实现 `RunnableDevEnvironment` 或 `FetchableDevEnvironment` 接口，你需要手动设置通信。

如果你的代码可以在与用户模块相同的运行时环境中运行（即不依赖于 Node.js 特定的 API），你可以使用虚拟模块。这种方法消除了通过 Vite 的 API 从代码中访问值的必要性。

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

设置 `builder` 选项后（即使设为空对象 `{}`，`vite build --app` 也正是这样做的），`vite build` 将选择构建整个应用。这将在未来的主要版本中成为默认行为。在此模式下，Vite 会创建一个 `ViteBuilder` 实例（构建时等同于 `ViteDevServer`），并用它为生产环境构建所有已配置的环境。默认情况下，各环境会按照 `environments` 记录中的顺序依次构建。

### 使用 `builder.buildApp` 配置应用构建 {#configuring-the-app-build-with-builder-buildapp}

框架或用户可以通过 `builder.buildApp` 选项控制各环境的构建方式。该选项接收 `ViteBuilder` 实例（下例中名为 `builder`），并负责构建各个环境。例如，可以并行构建其中一些环境：

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

### `buildApp` 插件钩子 {#the-buildapp-plugin-hook}

除 `builder.buildApp` 配置选项外，插件也可以定义 `buildApp` 钩子来参与应用构建。配置选项与插件钩子按固定顺序运行：顺序为 `'pre'` 或 `null` 的钩子最先运行，随后运行已配置的 `builder.buildApp`，最后运行顺序为 `'post'` 的钩子。在钩子中，可以通过 `environment.isBuilt` 判断某个环境是否已经构建，从而避免重复构建。

### 使用 `createBuilder` 以编程方式构建 {#building-programmatically-with-createbuilder}

要从自己的代码中触发应用构建，请使用 `createBuilder`，而不是独立的 `build` 函数。`createBuilder` 在构建阶段相当于 `createServer`：它会解析配置并返回一个 `ViteBuilder`，其 `buildApp` 方法可构建所有已配置的环境。也可以使用 `builder.build(environment)` 单独构建某个环境。

```js [build.js]
import { createBuilder } from 'vite'

const builder = await createBuilder()
await builder.buildApp()
```

对于环境感知的构建，`createBuilder` 取代了独立的 `build` 函数。`build` 仍可作为上述旧版仅客户端构建和仅 SSR 构建的简单入口，但无法构建任意环境。运行 `builder.buildApp()` 等同于以编程方式执行 `vite build --app`。

## 环境无关的代码 {#environment-agnostic-code}

大部分情况，当前的 `environment` 实例会作为正在运行代码的上下文中的一部分，所以通过 `server.environments` 来访问它们的需求应该很少。例如，在插件钩子内部，环境是作为 `PluginContext` 的一部分暴露出来的，所以可以使用 `this.environment` 来访问它。参见 [用于插件的环境 API](./api-environment-plugins.md) 了解如何构建对环境敏感的插件。
