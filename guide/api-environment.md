# 环境 API {#environment-api}

<<<<<<< HEAD
:::warning 底层 API
这个 API 的初始版本在 Vite 5.1 中以 "Vite 运行时 API" 的名字被引入。这份指南描述了一个经过修订的 API，被重新命名为环境 API（Environment API）。这个 API 将在 Vite 6 中作为实验性功能发布。你现在已经可以在最新的 `vite@6.0.0-beta.x` 版本中进行测试。
=======
:::warning Experimental
Initial work for this API was introduced in Vite 5.1 with the name "Vite Runtime API". This guide describes a revised API, renamed to Environment API. This API will be released in Vite 6 as experimental. You can already test it in the latest `vite@6.0.0-beta.x` version.
>>>>>>> 7ee571b4721ec5095cd05d438fb0532a3e064507

资料：

- [反馈讨论](https://github.com/vitejs/vite/discussions/16358) 我们在此处收集新 API 的反馈。
- [环境 API PR](https://github.com/vitejs/vite/pull/16471) 新 API 在此处被实现并进行了审查。

在你测试这个提议的过程中，请与我们分享你的反馈。
:::

<<<<<<< HEAD
Vite 6 正式引入了环境（Environments）的概念，引入了新的 API 来创建和配置环境，以及使用一致的 API 访问其选项和上下文工具。自 Vite 2 以来，有两个默认的环境（`client` 和 `ssr`）。插件钩子在最后的选项参数中接收到一个 `ssr` 布尔值，以识别每个处理模块的目标环境。一些 API 预期一个可选的最后 `ssr` 参数，以正确地将模块关联到正确的环境（例如 `server.moduleGraph.getModuleByUrl(url, { ssr })`）。`ssr` 环境使用 `config.ssr` 进行配置，该配置包含了客户端环境中的部分选项。在开发过程中，`client` 和 `ssr` 环境与单个共享的插件管道一起并发运行。在构建过程中，每个构建都获得了一个新的已解析的配置实例和一组新的插件。

新的环境 API 不仅明确了这两个默认环境，而且允许用户创建尽可能多的命名环境。配置环境有一种统一的方式（使用 `config.environments`），并且可以在插件钩子中使用 `this.environment` 访问正在处理的模块的环境选项和上下文工具。之前预期 `ssr` 设为一个布尔值的 API 现在限定在适当的环境中（例如 `environment.moduleGraph.getModuleByUrl(url)`）。在开发过程中，所有环境像以前一样并发运行。在构建过程中，为了向后兼容，每个构建都获得自己的已解析配置实例。但插件或用户可以选择共享构建管道。

即使在内部有大的变化，并且有新的可选 API，但是从 Vite 5 到 Vite 6 并没有破坏性的更改。Vite 6 的初始目标将是尽可能平滑地将生态系统迁移到新的主要版本，直到有足够的用户准备好使用这些插件的新版本，才会在插件中采用新的 API。

## 在 Vite 服务器中使用环境 {#using-environments-in-the-vite-server}

一个单一的 Vite 开发服务器可以同时与不同的模块执行环境进行交互。我们将“环境”这个词用来指代一个配置好的 Vite 处理流程，它可以解析 id，加载和处理源代码，并且连接到执行代码的运行环境。转化后的源代码被称为模块，每个环境中处理的模块之间的关系被保留在一个模块图谱中。这些模块的代码被发送到与每个环境相关联的运行环境中执行。当一个模块被评估时，运行环境会请求其导入的模块，触发模块图谱的一部分处理。在一个典型的 Vite 应用中，环境将被用来处理发送给客户端的 ES 模块和进行 SSR 的服务器程序。一个应用可以在 Node 服务器中进行 SSR，但也可以在其他 JS 运行环境，如 [Cloudflare 的 workerd](https://github.com/cloudflare/workerd) 中进行。因此，我们可以在同一台 Vite 服务器上拥有不同类型的环境：例如浏览器环境，Node 环境，以及 workerd 环境。

Vite 模块运行器（Module Runner）允许首先通过 Vite 插件处理代码来运行它。这与 `server.ssrLoadModule` 不同，因为运行器的实现是从服务器中解耦的。这允许库和框架的作者实现 Vite 服务器和运行器之间的通信层。浏览器使用服务器的 Web Socket 和通过 HTTP 请求与其对应的环境进行通信。Node 模块运行器可以直接进行函数调用来处理模块，因为它在同一进程中运行。其他环境可以像 workerd 或 Vitest 那样连接到 JS 运行时来运行模块。

所有这些环境都共享 Vite 的 HTTP 服务器，中间件和 Web Socket。已解析的配置和插件管道也是共享的，但插件可以使用 `apply`，所以它的钩子只会被某些环境调用。环境也可以在钩子内部访问以进行精细控制。

![Vite Environments](../images/vite-environments.svg)

Vite 开发服务器默认提供两个环境：一个 `client` 环境和一个 `ssr` 环境。默认情况下，客户端环境是一个浏览器环境，模块运行器通过将虚拟模块 `/@vite/client` 导入到客户端应用程序来实现。默认情况下，SSR 环境在与 Vite 服务器相同的 Node 运行时中运行，并且允许应用服务器在开发过程中用于渲染请求，同时完全支持模块热替换（HMR）。我们稍后将讨论框架和用户如何更改默认客户端和 SSR 环境的环境类型，或者注册新的环境（例如，为 [RSC](https://react.dev/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023#react-server-components) 创建一个单独的模块图）。

可以通过 `server.environments` 来访问可用的环境：

```js
const environment = server.environments.client

environment.transformRequest(url)

console.log(server.environments.ssr.moduleGraph)
```

通常情况下，当前的 `environment` 实例将作为正在运行的代码的上下文的一部分，因此很少需要通过 `server.environments` 来访问它们。例如，在插件钩子中，环境作为 `PluginContext` 的一部分被暴露出来，因此可以使用 `this.environment` 来访问它。

开发环境是 `DevEnvironment` 类的一个实例：

```ts
class DevEnvironment {
  /**
   * Unique identifier for the environment in a Vite server.
   * By default Vite exposes 'client' and 'ssr' environments.
   */
  name: string
  /**
   * Communication channel to send and receive messages from the
   * associated module runner in the target runtime.
   */
  hot: HotChannel | null
  /**
   * Graph of module nodes, with the imported relationship between
   * processed modules and the cached result of the processed code.
   */
  moduleGraph: EnvironmentModuleGraph
  /**
   * Resolved plugins for this environment, including the ones
   * created using the per-environment `create` hook
   */
  plugins: Plugin[]
  /**
   * Allows to resolve, load, and transform code through the
   * environment plugins pipeline
   */
  pluginContainer: EnvironmentPluginContainer
  /**
   * Resolved config options for this environment. Options at the server
   * global scope are taken as defaults for all environments, and can
   * be overridden (resolve conditions, external, optimizedDeps)
   */
  config: ResolvedConfig & ResolvedDevEnvironmentOptions

  constructor(name, config, { hot, options }: DevEnvironmentSetup)

  /**
   * Resolve the URL to an id, load it, and process the code using the
   * plugins pipeline. The module graph is also updated.
   */
  async transformRequest(url: string): TransformResult

  /**
   * Register a request to be processed with low priority. This is useful
   * to avoid waterfalls. The Vite server has information about the imported
   * modules by other requests, so it can warmup the module graph so the
   * modules are already processed when they are requested.
   */
  async warmupRequest(url: string): void
}
```

`TransformResult` 如下：

```ts
interface TransformResult {
  code: string
  map: SourceMap | { mappings: '' } | null
  etag?: string
  deps?: string[]
  dynamicDeps?: string[]
}
```

Vite 还支持 `RunnableDevEnvironment`，它扩展了 `DevEnvironment`，暴露了一个 `ModuleRunner` 实例。你可以使用 `isRunnableDevEnvironment` 函数来保护任何可运行的环境。

:::warning
当 `runner` 第一次被访问时，它会立即被评估。请注意，当通过调用 `process.setSourceMapsEnabled` 或者如果它不可用，通过覆盖 `Error.prepareStackTrace` 创建 `runner` 时，Vite 会启用源映射（source map）支持。
:::

```ts
export class RunnableDevEnvironment extends DevEnvironment {
  public readonly runner: ModuleRunnner
}

if (isRunnableDevEnvironment(server.environments.ssr)) {
  await server.environments.ssr.runner.import('/entry-point.js')
}
```
Vite 服务器中的环境实例让你可以使用 `environment.transformRequest(url)` 方法来处理 URL。这个函数会利用插件管道将 `url` 解析为模块 `id`，加载它（从文件系统读取文件或通过实现虚拟模块的插件），然后转换代码。在转换模块的过程中，导入和其他元数据会通过创建或更新相应的模块节点，在环境模块图中被记录下来。处理完成后，转换结果也会存储在模块中。

但是，环境实例本身无法执行代码，因为执行模块的运行时可能与 Vite 服务器运行的运行时不同。这就是浏览器环境的情况。当在浏览器中加载 HTML 时，其脚本被执行，触发整个静态模块图的评估。每个导入的 URL 都会生成一个向 Vite 服务器获取模块代码的请求，最终这个请求会通过调用 `server.environments.client.transformRequest(url)` 被 Transform Middleware 处理。在这种情况下，服务器中的环境实例和浏览器中的模块运行器之间的连接是通过 HTTP 进行的。

:::info transformRequest 命名
在这个提案的当前版本中，我们使用 `transformRequest(url)` 和 `warmupRequest(url)`，这样对于习惯于 Vite 当前 API 的用户来说，更容易进行讨论和理解。在发布前，我们也可以借此机会回顾这些名称。例如，它可以被命名为 `environment.processModule(url)` 或 `environment.loadModule(url)`，借鉴 Rollup 的插件钩子中的 `context.load(id)`。目前，我们认为保持当前的名称并推迟这次讨论是更好的。
:::

:::info 运行模块
初始提案中有一个 `run` 方法，它允许消费者通过使用 `transport` 选项在运行器端调用导入。在我们的测试中，我们发现 API 不够通用，无法开始推荐它。我们愿意基于框架反馈实现一个内置的远程 SSR 实现层。同时，Vite 仍然暴露一个 [`RunnerTransport` API](#runnertransport) 来隐藏运行器 RPC 的复杂性。
:::

在开发模式下，默认的 `ssr` 环境是一个 `RunnableDevEnvironment`，它有一个模块运行器，该运行器使用 `new AsyncFunction` 在与开发服务器相同的 JS 运行时中实现评估。这个运行器是 `ModuleRunner` 的一个实例，它暴露：

```ts
class ModuleRunner {
  /**
   * URL to execute. Accepts file path, server path, or id relative to the root.
   * Returns an instantiated module (same as in ssrLoadModule)
   */
  public async import(url: string): Promise<Record<string, any>>
  /**
   * Other ModuleRunner methods...
   */
```

:::info
在 v5.1 运行时 API 中，有 `executeUrl` 和 `executeEntryPoint` 方法 - 现在它们被合并到一个 `import` 方法中。如果你想退出 HMR 支持，可以使用 `hmr: false` 标志创建一个运行器。
:::

给定一个按照 [SSR 设置指南](/guide/ssr#setting-up-the-dev-server) 描述的方式配置为中间件模式的 Vite 服务器，让我们使用环境 API 实现 SSR 中间件。错误处理会被省略。

```js
import { createServer, createRunnableDevEnvironment } from 'vite'

const server = await createServer({
  server: { middlewareMode: true },
  appType: 'custom',
  environments: {
    node: {
      dev: {
        // Default Vite SSR environment can be overridden in the config, so
        // make sure you have a Node environment before the request is received.
        createEnvironment(name, config) {
          return createRunnableDevEnvironment(name, config)
        },
      },
    },
  },
})

// You might need to cast this to RunnableDevEnvironment in TypeScript or use
// the "isRunnableDevEnvironment" function to guard the access to the runner
const environment = server.environments.node

app.use('*', async (req, res, next) => {
  const url = req.originalUrl

  // 1. Read index.html
  let template = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8')

  // 2. Apply Vite HTML transforms. This injects the Vite HMR client,
  //    and also applies HTML transforms from Vite plugins, e.g. global
  //    preambles from @vitejs/plugin-react
  template = await server.transformIndexHtml(url, template)

  // 3. Load the server entry. import(url) automatically transforms
  //    ESM source code to be usable in Node.js! There is no bundling
  //    required, and provides full HMR support.
  const { render } = await environment.runner.import('/src/entry-server.js')

  // 4. render the app HTML. This assumes entry-server.js's exported
  //     `render` function calls appropriate framework SSR APIs,
  //    e.g. ReactDOMServer.renderToString()
  const appHtml = await render(url)

  // 5. Inject the app-rendered HTML into the template.
  const html = template.replace(`<!--ssr-outlet-->`, appHtml)

  // 6. Send the rendered HTML back.
  res.status(200).set({ 'Content-Type': 'text/html' }).end(html)
})
```

## 环境无关的 SSR {#environment-agnostic-ssr}

::: info
目前还不清楚 Vite 应该提供什么 API 来覆盖最常见的 SSR 使用场景。我们正在考虑发布环境 API，但不提供官方的环境无关 SSR 方法，以让生态系统首先探索常见模式。
:::

## 独立的模块图 {#separate-module-graphs}

每个环境都有一个独立的模块图。所有模块图都有相同的签名，因此可以实现通用算法来爬取或查询图，而无需依赖环境。`hotUpdate` 是一个很好的例子。当一个文件被修改时，每个环境的模块图将被用来发现受影响的模块，并为每个环境独立执行 HMR。

::: info
Vite v5 有一个混合的 Client 和 SSR 模块图。给定一个未处理的或无效的节点，我们无法知道它是否对应于 Client，SSR，还是两者都有。模块节点有一些带前缀的属性，如 `clientImportedModules` 和 `ssrImportedModules`（以及 `importedModules`，返回两者的并集）。`importers` 包含每个模块节点的 Client 和 SSR 环境的所有导入者。模块节点还有 `transformResult` 和 `ssrTransformResult`。一个向后兼容层允许生态系统从已弃用的 `server.moduleGraph` 迁移。
:::

每个模块都由一个 `EnvironmentModuleNode` 实例表示。模块可能在图中注册，但尚未处理（在这种情况下，`transformResult` 会是 `null`）。在模块处理后，`importers` 和 `importedModules` 也会更新。

```ts
class EnvironmentModuleNode {
  environment: string

  url: string
  id: string | null = null
  file: string | null = null

  type: 'js' | 'css'

  importers = new Set<EnvironmentModuleNode>()
  importedModules = new Set<EnvironmentModuleNode>()
  importedBindings: Map<string, Set<string>> | null = null

  info?: ModuleInfo
  meta?: Record<string, any>
  transformResult: TransformResult | null = null

  acceptedHmrDeps = new Set<EnvironmentModuleNode>()
  acceptedHmrExports: Set<string> | null = null
  isSelfAccepting?: boolean
  lastHMRTimestamp = 0
  lastInvalidationTimestamp = 0
}
```

`environment.moduleGraph` is an instance of `EnvironmentModuleGraph`:

```ts
export class EnvironmentModuleGraph {
  environment: string

  urlToModuleMap = new Map<string, EnvironmentModuleNode>()
  idToModuleMap = new Map<string, EnvironmentModuleNode>()
  etagToModuleMap = new Map<string, EnvironmentModuleNode>()
  fileToModulesMap = new Map<string, Set<EnvironmentModuleNode>>()

  constructor(
    environment: string,
    resolveId: (url: string) => Promise<PartialResolvedId | null>,
  )

  async getModuleByUrl(
    rawUrl: string,
  ): Promise<EnvironmentModuleNode | undefined>

  getModulesByFile(file: string): Set<EnvironmentModuleNode> | undefined

  onFileChange(file: string): void

  invalidateModule(
    mod: EnvironmentModuleNode,
    seen: Set<EnvironmentModuleNode> = new Set(),
    timestamp: number = Date.now(),
    isHmr: boolean = false,
  ): void

  invalidateAll(): void

  async ensureEntryFromUrl(
    rawUrl: string,
    setIsSelfAccepting = true,
  ): Promise<EnvironmentModuleNode>

  createFileOnlyEntry(file: string): EnvironmentModuleNode

  async resolveUrl(url: string): Promise<ResolvedUrl>

  updateModuleTransformResult(
    mod: EnvironmentModuleNode,
    result: TransformResult | null,
  ): void

  getModuleByEtag(etag: string): EnvironmentModuleNode | undefined
}
```

## 创建新的环境 {#creating-new-environments}

这个功能的一个目标是提供一个可定制的 API 来处理和运行代码。用户可以使用公开的基础设施来创建新的环境类型。

```ts
import { DevEnvironment, RemoteEnvironmentTransport } from 'vite'

function createWorkerdDevEnvironment(name: string, config: ResolvedConfig, context: DevEnvironmentContext) {
  const hot = /* ... */
  const connection = /* ... */
  const transport = new RemoteEnvironmentTransport({
    send: (data) => connection.send(data),
    onMessage: (listener) => connection.on('message', listener),
  })

  const workerdDevEnvironment = new DevEnvironment(name, config, {
    options: {
      resolve: { conditions: ['custom'] },
      ...context.options,
    },
    hot,
    remoteRunner: {
      transport,
    },
  })
  return workerdDevEnvironment
}
```

然后，用户可以创建一个 workerd 环境来进行服务端渲染（SSR）：

```js
const ssrEnvironment = createWorkerdEnvironment('ssr', config)
```

## 环境配置 {#environment-configuration}
=======
## Formalizing Environments

Vite 6 formalizes the concept of Environments. Until Vite 5, there were two implicit Environments (`client` and `ssr`). The new Environment API allows users to create as many environments as needed to map the way their apps work in production. This new capabilities required a big internal refactoring, but a big effort has been placed on backward compatibility. The initial goal of Vite 6 is to move the ecosystem to the new major as smoothly as possible, delaying the adoption of these new experimental APIs until enough users have migrated and frameworks and plugin authors have validated the new design.

## Closing the gap between build and dev

For a simple SPA, there is a single environment. The app will run in the user browser. During dev, except for Vite's requiring a modern browser, the environment matches closely the production runtime. In Vite 6, it would still be possible to use Vite without users knowing about environments. The usual vite config works for the default client environment in this case.

In a typical server side rendered Vite app, there are two environments. The client environment is running the app in the browser, and the node environment runs the server that performs SSR. When running Vite in dev mode, the server code is executed in the same Node process as the Vite dev server giving a close approximation of the production environment. But an app can run servers in other JS runtimes, like [Cloudflare's workerd](https://github.com/cloudflare/workerd). And it is also common for modern apps to have more than two environments (for example, an app could be running by a browser, a node server, and an edge server). Vite 5 didn't allow for these cases to be properly represented.

Vite 6 allows users to configure their app during build and dev to map all of its environments. During dev, a single Vite dev server can now be used to run code in multiple different environments concurrently. The app source code is still transformed by Vite dev server. On top of the shared HTTP server, middlewares, resolved config, and plugins pipeline, the Vite server now has a set of independent dev environments. Each of them is configured to match the production environment as closely as possible, and is connected to a dev runtime where the code is executed (for workerd, the server code can now run in miniflare locally). In the client, the browser imports and executes the code. In other environments, a module runner fetches and evaluates the transformed code.

![Vite Environments](../images/vite-environments.svg)

## Environment Configuration
>>>>>>> 7ee571b4721ec5095cd05d438fb0532a3e064507

环境是通过 `environments` 配置选项显式配置的。

```js
export default {
  environments: {
    client: {
      resolve: {
        conditions: [], // configure the Client environment
      },
    },
    ssr: {
      dev: {
        optimizeDeps: {}, // configure the SSR environment
      },
    },
    rsc: {
      resolve: {
        noExternal: true, // configure a custom environment
      },
    },
  },
}
```

所有环境配置都从用户的根配置扩展，允许用户在根级别为所有环境添加默认值。这对于配置只有 Vite 客户端的应用程序的常见场景非常有用，可以在不通过 `environments.client` 的情况下完成。

```js
export default {
  resolve: {
    conditions: [], // configure a default for all environments
  },
}
```

`EnvironmentOptions` 接口展示了所有每个环境的选项。有些 `SharedEnvironmentOptions` 适用于 `build` 和 `dev`，比如 `resolve`。还有 `DevEnvironmentOptions` 和 `BuildEnvironmentOptions` 用于开发和构建特定的选项（比如 `dev.optimizeDeps` 或 `build.outDir`）。

```ts
interface EnvironmentOptions extends SharedEnvironmentOptions {
  dev: DevOptions
  build: BuildOptions
}
```

如我们所解释的，用户配置的根级别定义的环境特定选项用于默认的客户端环境（`UserConfig` 接口继承自 `EnvironmentOptions` 接口）。并且可以使用 `environments` 记录显式配置环境。`client` 和 `ssr` 环境在开发过程中总是存在的，即使将空对象设置为 `environments`。这允许与 `server.ssrLoadModule(url)` 和 `server.moduleGraph` 的向后兼容性。在构建过程中，`client` 环境总是存在的，而 `ssr` 环境只有在显式配置（使用 `environments.ssr` 或为了向后兼容 `build.ssr`）时才存在。

```ts
interface UserConfig extends EnvironmentOptions {
  environments: Record<string, EnvironmentOptions>
  // other options
}
```

::: info

顶层属性 `ssr` 与 `EnvironmentOptions` 有许多相同的选项。这个选项是为了与 `environments` 相同的使用场景创建的，但只允许配置少数几个选项。我们将弃用它，以支持统一定义环境配置的方式。

:::

## 自定义环境实例 {#custom-environment-instances}

<<<<<<< HEAD
要创建自定义的开发或构建环境实例，你可以使用 `dev.createEnvironment` 或 `build.createEnvironment` 函数。

```js
export default {
  environments: {
    rsc: {
      dev: {
        createEnvironment(name, config, { watcher }) {
          // Called with 'rsc' and the resolved config during dev
          return createRunnableDevEnvironment(name, config, {
            hot: customHotChannel(),
            watcher
          })
        }
      },
      build: {
        createEnvironment(name, config) {
          // Called with 'rsc' and the resolved config during build
          return createNodeBuildEnvironment(name, config)
        }
        outDir: '/dist/rsc',
      },
    },
  },
}
```

环境将通过 `server.environments` 在中间件或插件钩子中可访问。在插件钩子中，环境实例被传递给选项，所以它们可以根据配置的方式做条件判断。

像 Workerd 这样的环境提供者，可以为使用相同运行时的开发和构建环境的最常见场景提供环境提供者。也可以设置默认的环境选项，这样用户就不需要这样做了。

```js
function createWorkedEnvironment(userConfig) {
  return mergeConfig(
    {
      resolve: {
        conditions: [
          /*...*/
        ],
      },
      dev: {
        createEnvironment(name, config, { watcher }) {
          return createWorkerdDevEnvironment(name, config, {
            hot: customHotChannel(),
            watcher,
          })
        },
      },
      build: {
        createEnvironment(name, config) {
          return createWorkerdBuildEnvironment(name, config)
        },
      },
    },
    userConfig,
  )
}
```

然后配置文件可以写成

```js
import { createWorkerdEnvironment } from 'vite-environment-workerd'
=======
Low level configuration APIs are available so runtime providers can provide environments for their runtimes.

```js
import { createCustomEnvironment } from 'vite-environment-provider'
>>>>>>> 7ee571b4721ec5095cd05d438fb0532a3e064507

export default {
  environments: {
    client: {
      build: {
        outDir: '/dist/client',
      },
    }
    ssr: createCustomEnvironment({
      build: {
        outDir: '/dist/ssr',
      },
    }),
<<<<<<< HEAD
    rsc: createWorkerdEnvironment({
      build: {
        outDir: '/dist/rsc',
      },
    }),
  ],
}
```

在这种情况下，我们看到如何将 `ssr` 环境配置为使用 workerd 作为其运行时。此外，还定义了一个新的自定义 RSC 环境，由一个单独的 workerd 运行时实例支持。

## 插件和环境 {#plugins-and-environments}

### 在钩子中访问当前环境 {#accessing-the-current-environment-in-hooks}

Vite 服务器有一个共享的插件管道，但是当一个模块被处理时，它总是在给定环境的上下文中完成的。`environment` 实例在 `resolveId`、`load` 和 `transform` 的插件上下文中可用。

插件可以使用 `environment` 实例来：

- 仅对特定环境应用逻辑。
- 根据环境的配置改变它们的工作方式，可以使用 `environment.config` 访问。例如，vite 核心解析插件会根据 `environment.config.resolve.conditions` 修改它解析 ids 的方式。

```ts
  transform(code, id) {
    console.log(this.environment.config.resolve.conditions)
  }
```

### 使用钩子注册新环境 {#registering-new-environments-using-hooks}

插件可以在 `config` 钩子中添加新的环境：

```ts
  config(config: UserConfig) {
    config.environments.rsc ??= {}
  }
```

一个空对象就足够注册环境，其默认值来自根级别的环境配置。

### 使用钩子配置环境 {#configuring-environment-using-hooks}

当 `config` 钩子运行时，尚未知道完整的环境列表，环境可以受到来自根级别环境配置的默认值的影响，也可以通过 `config.environments` 记录显式影响。
插件应使用 `config` 钩子设置默认值。要配置每个环境，它们可以使用新的 `configEnvironment` 钩子。这个钩子对每个环境调用，其部分解析的配置包括最终默认值的解析。

```ts
  configEnvironment(name: string, options: EnvironmentOptions) {
    if (name === 'rsc') {
      options.resolve.conditions = // ...
```

### `hotUpdate` 钩子 {#the-hot-update-hook}

- **类型：** `(this: { environment: DevEnvironment }, options: HotUpdateOptions) => Array<EnvironmentModuleNode> | void | Promise<Array<EnvironmentModuleNode> | void>`
- **相关链接：** [HMR API](./api-hmr)

`hotUpdate` 钩子允许插件为特定环境执行自定义的热模块替换（HMR）更新处理。当一个文件发生变化时，HMR 算法将按照 `server.environments` 中的顺序依次为每个环境运行，因此 `hotUpdate` 钩子将被多次调用。该钩子接收一个具有以下签名的上下文对象：

```ts
interface HotUpdateContext {
  type: 'create' | 'update' | 'delete'
  file: string
  timestamp: number
  modules: Array<EnvironmentModuleNode>
  read: () => string | Promise<string>
  server: ViteDevServer
}
```

- `this.environment` 是当前正在处理文件更新的模块执行环境。

- `modules` 是由于文件更改而受影响的此环境中的模块的数组。它是一个数组，因为一个文件可能映射到多个服务的模块（例如 Vue SFCs）。

- `read` 是一个异步读取函数，返回文件的内容。这是因为，在某些系统上，文件更改回调可能在编辑器完成文件更新之前触发得太快，直接的 `fs.readFile` 将返回空内容。传入的读取函数规范化了这种行为。

钩子可以选择：

- 过滤和缩小受影响的模块列表，使模块热替换（HMR）更准确。

- 返回一个空数组并执行完全重载：

  ```js
  hotUpdate({ modules, timestamp }) {
    if (this.environment.name !== 'client')
      return

    // Invalidate modules manually
    const invalidatedModules = new Set()
    for (const mod of modules) {
      this.environment.moduleGraph.invalidateModule(
        mod,
        invalidatedModules,
        timestamp,
        true
      )
    }
    this.environment.hot.send({ type: 'full-reload' })
    return []
  }
  ```

- 返回一个空数组并通过向客户端发送自定义事件来执行完全自定义的模块热替换（HMR）处理：

  ```js
  hotUpdate() {
    if (this.environment.name !== 'client')
      return

    this.environment.hot.send({
      type: 'custom',
      event: 'special-update',
      data: {}
    })
    return []
  }
  ```

  客户端代码应使用 [HMR API](./api-hmr) 注册相应的处理程序（这可以通过相同插件的 `transform` 钩子注入）：

  ```js
  if (import.meta.hot) {
    import.meta.hot.on('special-update', (data) => {
      // perform custom update
    })
  }
  ```

### 针对每个环境的插件 {#per-environment-plugins}

插件可以通过 `applyToEnvironment` 函数定义它应该适用于哪些环境。

```js
const UnoCssPlugin = () => {
  // shared global state
  return {
    buildStart() {
      // init per environment state with WeakMap<Environment,Data>, this.environment
    },
    configureServer() {
      // use global hooks normally
    },
    applyToEnvironment(environment) {
      // return true if this plugin should be active in this environment
      // if the function isn't provided, the plugin is active in all environments
    },
    resolveId(id, importer) {
      // only called for environments this plugin apply to
    },
  }
}
```

## `ModuleRunner`

在目标运行时实例化一个模块运行器（module runner）。除非特别说明，否则下一节中的所有 API 都从 `vite/module-runner` 导入。这个导出入口点尽可能保持轻量，只导出创建模块运行器所需的最小内容。

**类型签名：**

```ts
export class ModuleRunner {
  constructor(
    public options: ModuleRunnerOptions,
    public evaluator: ModuleEvaluator,
    private debug?: ModuleRunnerDebugger,
  ) {}
  /**
   * URL to execute. Accepts file path, server path, or id relative to the root.
   */
  public async import<T = any>(url: string): Promise<T>
  /**
   * Clear all caches including HMR listeners.
   */
  public clearCache(): void
  /**
   * Clears all caches, removes all HMR listeners, and resets source map support.
   * This method doesn't stop the HMR connection.
   */
  public async close(): Promise<void>
  /**
   * Returns `true` if the runner has been closed by calling `close()` method.
   */
  public isClosed(): boolean
}
```

`ModuleRunner` 中的模块评估器负责执行代码。Vite 默认导出 `ESModulesEvaluator`，它使用 `new AsyncFunction` 来评估代码。如果你的 JavaScript 运行时不支持不安全的评估，你可以提供你自己的实现。

模块运行器暴露了 `import` 方法。当 Vite 服务器触发 `full-reload` 热模块替换（HMR）事件时，所有受影响的模块将被重新执行。请注意，当这种情况发生时，模块运行器不更新 `exports` 对象（它覆盖了它），如果你依赖于拥有最新的 `exports` 对象，你需要再次运行 `import` 或从 `evaluatedModules` 中获取模块。

**使用示例：**

```js
import { ModuleRunner, ESModulesEvaluator } from 'vite/module-runner'
import { root, fetchModule } from './rpc-implementation.js'

const moduleRunner = new ModuleRunner(
  {
    root,
    fetchModule,
    // you can also provide hmr.connection to support HMR
  },
  new ESModulesEvaluator(),
)

await moduleRunner.import('/src/entry-point.js')
```

## `ModuleRunnerOptions`

```ts
export interface ModuleRunnerOptions {
  /**
   * Root of the project
   */
  root: string
  /**
   * A set of methods to communicate with the server.
   */
  transport: RunnerTransport
  /**
   * Configure how source maps are resolved. Prefers `node` if `process.setSourceMapsEnabled` is available.
   * Otherwise it will use `prepareStackTrace` by default which overrides `Error.prepareStackTrace` method.
   * You can provide an object to configure how file contents and source maps are resolved for files that were not processed by Vite.
   */
  sourcemapInterceptor?:
    | false
    | 'node'
    | 'prepareStackTrace'
    | InterceptorOptions
  /**
   * Disable HMR or configure HMR options.
   */
  hmr?:
    | false
    | {
        /**
         * Configure how HMR communicates between the client and the server.
         */
        connection: ModuleRunnerHMRConnection
        /**
         * Configure HMR logger.
         */
        logger?: false | HMRLogger
      }
  /**
   * Custom module cache. If not provided, it creates a separate module cache for each module runner instance.
   */
  evaluatedModules?: EvaluatedModules
}
```

## `ModuleEvaluator`

**使用示例：**

```ts
export interface ModuleEvaluator {
  /**
   * Number of prefixed lines in the transformed code.
   */
  startOffset?: number
  /**
   * Evaluate code that was transformed by Vite.
   * @param context Function context
   * @param code Transformed code
   * @param id ID that was used to fetch the module
   */
  runInlinedModule(
    context: ModuleRunnerContext,
    code: string,
    id: string,
  ): Promise<any>
  /**
   * evaluate externalized module.
   * @param file File URL to the external module
   */
  runExternalModule(file: string): Promise<any>
}
```

Vite 默认导出实现此接口的 `ESModulesEvaluator`。它使用 `new AsyncFunction` 来评估代码，因此如果代码有内联源映射，它应该包含 [2 行的偏移](https://tc39.es/ecma262/#sec-createdynamicfunction) 来适应新添加的行。这是由 `ESModulesEvaluator` 自动完成的。自定义评估器不会添加额外的行。

## RunnerTransport

**使用示例：**

```ts
interface RunnerTransport {
  /**
   * A method to get the information about the module.
   */
  fetchModule: FetchFunction
}
```

通过 RPC 或直接调用函数与环境通信的传输对象。默认情况下，你需要传递一个带有 `fetchModule` 方法的对象 - 它可以在其中使用任何类型的 RPC，但 Vite 也通过 `RemoteRunnerTransport` 类公开双向传输接口以使配置更容易。你需要将它与服务器上的 `RemoteEnvironmentTransport` 实例配对，就像在这个例子中，模块运行器在工作线程中创建：

::: code-group

```ts [worker.js]
import { parentPort } from 'node:worker_threads'
import { fileURLToPath } from 'node:url'
import {
  ESModulesEvaluator,
  ModuleRunner,
  RemoteRunnerTransport,
} from 'vite/module-runner'

const runner = new ModuleRunner(
  {
    root: fileURLToPath(new URL('./', import.meta.url)),
    transport: new RemoteRunnerTransport({
      send: (data) => parentPort.postMessage(data),
      onMessage: (listener) => parentPort.on('message', listener),
      timeout: 5000,
    }),
  },
  new ESModulesEvaluator(),
)
```

```ts [server.js]
import { BroadcastChannel } from 'node:worker_threads'
import { createServer, RemoteEnvironmentTransport, DevEnvironment } from 'vite'

function createWorkerEnvironment(name, config, context) {
  const worker = new Worker('./worker.js')
  return new DevEnvironment(name, config, {
    hot: /* custom hot channel */,
    remoteRunner: {
      transport: new RemoteEnvironmentTransport({
        send: (data) => worker.postMessage(data),
        onMessage: (listener) => worker.on('message', listener),
      }),
    },
  })
}

await createServer({
  environments: {
    worker: {
      dev: {
        createEnvironment: createWorkerEnvironment,
      },
    },
  },
})
```

:::

`RemoteRunnerTransport` 和 `RemoteEnvironmentTransport` 是设计为一起使用的，但你完全不必使用它们。你可以定义你自己的函数在运行器和服务器之间进行通信。例如，如果你通过 HTTP 请求连接到环境，你可以在 `fetchModule` 函数中调用 `fetch().json()`：

```ts
import { ESModulesEvaluator, ModuleRunner } from 'vite/module-runner'

export const runner = new ModuleRunner(
  {
    root: fileURLToPath(new URL('./', import.meta.url)),
    transport: {
      async fetchModule(id, importer) {
        const response = await fetch(
          `http://my-vite-server/fetch?id=${id}&importer=${importer}`,
        )
        return response.json()
      },
    },
  },
  new ESModulesEvaluator(),
)

await runner.import('/entry.js')
```

::: warning 在服务器上访问模块
我们不希望鼓励服务器和运行器之间的通信。`vite.ssrLoadModule` 揭示的问题之一是对处理模块内的服务器状态的过度依赖。这使得实现与运行时无关的服务端渲染（SSR）变得更困难，因为用户环境可能无法访问服务器 API。例如，这段代码假设 Vite 服务器和用户代码可以在同一上下文中运行：

```ts
const vite = createServer()
const routes = collectRoutes()

const { processRoutes } = await vite.ssrLoadModule('internal:routes-processor')
processRoutes(routes)
```

这使得无法以可能在生产环境中运行的相同方式运行用户代码（例如，在边缘），因为服务器状态和用户状态是耦合的。因此，我们建议使用虚拟模块来导入状态并在用户模块内部处理它：

```ts
// this code runs on another machine or in another thread

import { runner } from './ssr-module-runner.js'
import { processRoutes } from './routes-processor.js'

const { routes } = await runner.import('virtual:ssr-routes')
processRoutes(routes)
```

像 [服务端渲染指南](/guide/ssr) 中的简单设置仍然可以直接使用 `server.transformIndexHtml`，如果预期服务器在生产中不会在不同的进程中运行。然而，如果服务器将在边缘环境或单独的进程中运行，我们建议创建一个虚拟模块来加载 HTML：

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

然后在服务端渲染（SSR）入口文件，你可以调用 `import('virtual:index-html')` 来检索处理过的 HTML：

```ts
import { render } from 'framework'

// this example uses cloudflare syntax
export default {
  async fetch() {
    // during dev, it will return transformed HTML
    // during build, it will bundle the basic index.html into a string
    const { default: html } = await import('virtual:index-html')
    return new Response(render(html), {
      headers: { 'content-type': 'text/html' },
    })
  },
}
```

这使得 HTML 处理与服务器无关。

:::

## ModuleRunnerHMRConnection

**使用示例：**

```ts
export interface ModuleRunnerHMRConnection {
  /**
   * Checked before sending messages to the server.
   */
  isReady(): boolean
  /**
   * Send a message to the server.
   */
  send(payload: HotPayload): void
  /**
   * Configure how HMR is handled when this connection triggers an update.
   * This method expects that the connection will start listening for HMR updates and call this callback when it's received.
   */
  onUpdate(callback: (payload: HotPayload) => void): void
}
```

此接口定义了如何建立模块热替换（HMR）通信。Vite 从主入口文件导出 `ServerHMRConnector` 来支持 Vite 服务端渲染（SSR）期间的 HMR。当触发自定义事件时（如，`import.meta.hot.send("my-event")`），通常会调用 `isReady` 和 `send` 方法。

当新的模块运行器被启动时，只调用一次 `onUpdate`。它传递了一个在连接触发 HMR 事件时应该调用的方法。实现取决于连接的类型（例如，它可以是 `WebSocket`/`EventEmitter`/`MessageChannel`），但通常看起来像这样：

```js
function onUpdate(callback) {
  this.connection.on('hmr', (event) => callback(event.data))
}
```

回调会排队，它会等待当前更新被解决后再处理下一个更新。与浏览器实现不同，模块运行器中的模块热替换（HMR）更新会等待所有监听器（如，`vite:beforeUpdate`/`vite:beforeFullReload`）完成后再更新模块。

## 构建过程中的环境 {#environments-during-build}

在命令行界面中，调用 `vite build` 和 `vite build --ssr` 仍将只构建客户端和仅服务端渲染（ssr）环境以向后兼容。

当 `builder.entireApp` 为 `true`（或当调用 `vite build --app` 时），`vite build` 将选择构建整个应用程序。在未来的主要版本中，这将成为默认设置。将创建一个 `ViteBuilder` 实例（构建时间等同于 `ViteDevServer`）来为生产环境构建所有配置的环境。默认情况下，环境的构建按照 `environments` 记录的顺序依次运行。框架或用户可以进一步配置如何构建环境，方法如下：

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

### 构建钩子中的环境 {#environment-in-build-hooks}

与开发时一样，插件钩子在构建期间也会接收环境实例，替换 `ssr` 布尔值。
这也适用于 `renderChunk`、`generateBundle` 和其他仅构建钩子。

### 在构建期间共享插件 {#shared-plugins-during-build}

在 Vite 6 之前，插件管道在开发和构建期间的工作方式不同：

- **在开发期间：** 插件是共享的
- **在构建期间：** 插件对于每个环境是隔离的（在不同的进程中：`vite build` 然后 `vite build --ssr`）。

这迫使框架通过写入文件系统的清单文件在 `client` 构建和 `ssr` 构建之间共享状态。在 Vite 6 中，我们现在在一个单独的进程中构建所有环境，所以插件管道和环境间通信的方式可以与开发对齐。

在未来的主要版本（Vite 7 或 8）中，我们的目标是完全对齐：

- **在开发和构建期间：** 插件是共享的，具有 [每个环境过滤](#per-environment-plugins)

在构建期间也将共享一个 `ResolvedConfig` 实例，允许在整个应用构建过程级别进行缓存，就像我们在开发期间使用 `WeakMap<ResolvedConfig, CachedData>` 一样。

对于 Vite 6，我们需要做一个较小的步骤来保持向后兼容性。生态系统插件当前使用 `config.build` 而不是 `environment.config.build` 来访问配置，所以我们需要默认为每个环境创建一个新的 `ResolvedConfig`。一个项目可以选择共享完整的配置和插件管道，将 `builder.sharedConfigBuild` 设置为 `true`。

这个选项最初只能适用于一小部分项目，所以插件作者可以选择让特定插件通过设置 `sharedDuringBuild` 标志为 `true` 来共享。这允许轻松共享常规插件的状态：

```js
function myPlugin() {
  // Share state among all environments in dev and build
  const sharedState = ...
  return {
    name: 'shared-plugin',
    transform(code, id) { ... },

    // Opt-in into a single instance for all environments
    sharedDuringBuild: true,
  }
=======
  },
>>>>>>> 7ee571b4721ec5095cd05d438fb0532a3e064507
}
```

## 向后兼容性 {#backward-compatibility}

当前的 Vite 服务器 API 尚未被弃用，并且与 Vite 5 向后兼容。新的环境 API 是实验性的。

`server.moduleGraph` 返回客户端和服务器端渲染（ssr）模块图的混合视图。所有其方法都将返回向后兼容的混合模块节点。对于传递给 `handleHotUpdate` 的模块节点，也使用相同的方案。

我们不建议现在就切换到环境 API。我们的目标是在插件不需要维护两个版本之前，让大部分用户基础采用 Vite 6。查看未来破坏性更改部分以获取未来弃用和升级路径的信息：

<<<<<<< HEAD
- [钩子函数中的 `this.environment`](/changes/this-environment-in-hooks)
- [HMR `hotUpdate` 插件钩子](/changes/hotupdate-hook)
- [迁移到按环境划分的 API](/changes/per-environment-apis)
- [使用 `ModuleRunner` API 进行服务端渲染](/changes/ssr-using-modulerunner)
- [构建过程中的共享插件](/changes/shared-plugins-during-build)
=======
- [`this.environment` in Hooks](/changes/this-environment-in-hooks)
- [HMR `hotUpdate` Plugin Hook](/changes/hotupdate-hook)
- [Move to per-environment APIs](/changes/per-environment-apis)
- [SSR using `ModuleRunner` API](/changes/ssr-using-modulerunner)
- [Shared plugins during build](/changes/shared-plugins-during-build)

## Target users

This guide provides the basic concepts about environments for end users.

Plugin authors have a more consistent API available to interact with the current environment configuration. If you're building on top of Vite, the [Environment API Plugins Guide](./api-environment-plugins.md) guide describes the way extended plugin APIs available to support multiple custom environments.

Frameworks could decide to expose environments at different levels. If you're a framework author, continue reading the [Environment API Frameworks Guide](./api-environment-frameworks) to learn about the Environment API programmatic side.

For Runtime providers, the [Environment API Runtimes Guide](./api-environment-runtimes.md) explains how to offer custom environment to be consumed by frameworks and users.
>>>>>>> 7ee571b4721ec5095cd05d438fb0532a3e064507
