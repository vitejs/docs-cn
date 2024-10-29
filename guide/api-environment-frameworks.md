# 用于框架的环境 API {#environment-api-for-frameworks}

:::warning 实验性
这个 API 的初始版本在 Vite 5.1 中以 "Vite Runtime API" 的名字被引入。这份指南介绍了经过修订后的 API，被重新命名为环境 API（Environment API）。这个 API 将在 Vite 6 中作为实验性功能发布。你现在已经可以在最新的 `vite@6.0.0-beta.x` 版本中进行测试。

资料：

- [反馈讨论](https://github.com/vitejs/vite/discussions/16358) 我们在此处收集新 API 的反馈。
- [环境 API PR](https://github.com/vitejs/vite/pull/16471) 新 API 在此处被实现并进行了审查。

在参与测试这个提议的过程中，请与我们分享您的反馈。
:::

## 环境和框架 {#environments-and-frameworks}

隐式的 `ssr` 环境和其他非客户端环境在开发过程中默认使用 `RunnableDevEnvironment`。虽然这要求运行时与 Vite 服务器运行的环境相同，但这与 `ssrLoadModule` 类似，允许框架迁移并为其 SSR 开发方案启用模块热替换（HMR）。你可以使用 `isRunnableDevEnvironment` 函数来保护任何可运行的环境。

```ts
export class RunnableDevEnvironment extends DevEnvironment {
  public readonly runner: ModuleRunner
}

class ModuleRunner {
  /**
   * 要执行的 URL。可以接受文件路径，服务器路径，或者相对于根路径的 id。
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
首次访问 `runner` 时，它会被立即执行。请注意，当通过调用 `process.setSourceMapsEnabled` 或在不支持的情况下重写 `Error.prepareStackTrace` 创建 `runner` 时，Vite 会启用源映射支持。
:::

## 默认 `RunnableDevEnvironment` {#default-runnabledevenvironment}

假设我们有一个配置为中间件模式的 Vite 服务器，如 [SSR 设置指南](/guide/ssr#setting-up-the-dev-server) 所述，我们可以使用环境 API 来实现 SSR 中间件。省略了错误处理。

```js
import { createServer } from 'vite'

const server = await createServer({
  server: { middlewareMode: true },
  appType: 'custom',
  environments: {
    server: {
      // 默认情况下，模块在开发过程中与 vite 开发服务器在同一进程中运行
    },
  },
})

// 在 TypeScript 中，你可能需要将这个转换为 RunnableDevEnvironment，或者使用
// "isRunnableDevEnvironment" 函数来保护对运行器的访问
const environment = server.environments.node

app.use('*', async (req, res, next) => {
  const url = req.originalUrl

  // 1. 读取 index.html
  let template = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8')

  // 2. 应用 Vite HTML 转换。这将注入 Vite HMR 客户端，
  //    并应用来自 Vite 插件的 HTML 转换，例如
  //    @vitejs/plugin-react 提供的全局前置代码
  template = await server.transformIndexHtml(url, template)

  // 3. 加载服务器入口文件。import(url) 自动将
  //    ESM 源代码转换为 Node.js 可用的代码！
  //    不需要打包，并且提供全面的 HMR 支持。
  const { render } = await environment.runner.import('/src/entry-server.js')

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

const server = createServer()
const ssrEnvironment = server.environment.ssr
const input = {}

const { createHandler } = await ssrEnvironment.runner.import('./entrypoint.js')
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

如果你的代码可以在与用户模块相同的运行时中运行（即，它不依赖于 Node.js 特定的 API），你可以使用虚拟模块。这种方法避免了从使用 Vite API 的代码中获取值的需求。

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
          html = await fs.promises.readFile('index.html', 'utf-8')
          html = await server.transformIndexHtml('/', html)
        } else {
          html = await fs.promises.readFile('dist/client/index.html', 'utf-8')
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

在命令行界面，调用 `vite build` 和 `vite build --ssr` 仍将只构建客户端和仅 ssr 环境以保证向后兼容性。

当 `builder` 未 `undefined` 时（或者调用 `vite build --app`）时，`vite build` 将选择构建整个应用。这将在未来的主要版本中成为默认设置。将创建一个 `ViteBuilder` 实例（构建时等同于 `ViteDevServer`），用于为生产环境构建所有配置的环境。默认情况下，环境的构建按照 `environments` 记录的顺序依次运行。框架或用户可以进一步配置环境的构建方式，使用：

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

## 环境无关的代码 {#environment-agnostic-code}

大部分情况，当前的 `environment` 实例会作为正在运行代码的上下文中的一部分，所以通过 `server.environments` 来访问它们的需求应该很少。例如，在插件钩子内部，环境是作为 `PluginContext` 的一部分暴露出来的，所以可以使用 `this.environment` 来访问它。参见 [用于插件的环境 API](./api-environment-plugins.md) 了解如何构建对环境敏感的插件。
