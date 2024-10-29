# 用于运行时的环境 API {#environment-api-for-runtimes}

:::warning 实验性
这个 API 的初始版本在 Vite 5.1 中以 "Vite Runtime API" 的名字被引入。这份指南介绍了经过修订后的 API，被重新命名为环境 API（Environment API）。这个 API 将在 Vite 6 中作为实验性功能发布。你现在已经可以在最新的 `vite@6.0.0-beta.x` 版本中进行测试。

资料：

- [反馈讨论](https://github.com/vitejs/vite/discussions/16358) 我们在此处收集新 API 的反馈。
- [环境 API PR](https://github.com/vitejs/vite/pull/16471) 新 API 在此处被实现并进行了审查。

在参与测试这个提议的过程中，请与我们分享您的反馈。
:::

## 环境工厂 {#environment-factories}

环境工厂（Environments factory）旨在由环境提供者（如 Cloudflare）实现，而不是由终端用户实现。环境工厂返回一个 `EnvironmentOptions`，用于在开发和构建环境中使用目标运行时的最常见情况。默认环境选项也可以设置，因此用户无需手动配置。

```ts
function createWorkedEnvironment(
  userConfig: EnvironmentOptions,
): EnvironmentOptions {
  return mergeConfig(
    {
      resolve: {
        conditions: [
          /*...*/
        ],
      },
      dev: {
        createEnvironment(name, config) {
          return createWorkerdDevEnvironment(name, config, {
            hot: customHotChannel(),
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

配置文件可以写为：

```js
import { createWorkerdEnvironment } from 'vite-environment-workerd'

export default {
  environments: {
    ssr: createWorkerdEnvironment({
      build: {
        outDir: '/dist/ssr',
      },
    }),
    rsc: createWorkerdEnvironment({
      build: {
        outDir: '/dist/rsc',
      },
    }),
  },
}
```

并且框架可以使用带有 workerd 运行时的环境来执行以下操作：

```js
const ssrEnvironment = server.environments.ssr
```

## 创建新的环境工厂 {#creating-a-new-environment-factory}

Vite 开发服务器默认暴露两个环境：一个 `client` 环境和一个 `ssr` 环境。客户端环境默认是浏览器环境，模块运行器（module runner）通过将虚拟模块 `/@vite/client` 导入客户端应用来实现。SSR 环境默认在与 Vite 服务器相同的 Node 运行时中运行，允许应用服务器在开发期间使用完整的 HMR 支持来渲染请求。

转换后的源代码称为模块（module），在每个环境中处理的模块之间的关系保存在模块图中。这些模块的转换代码被发送到与每个环境关联的运行时以执行。当一个模块在运行时中被执行时，它的导入模块将被请求，从而触发模块图的一部分处理。

Vite 模块运行器允许首先使用 Vite 插件处理代码来运行任何代码。它不同于 `server.ssrLoadModule`，因为运行器实现与服务器解耦。这允许库和框架作者实现 Vite 服务器与运行器之间的通信层。浏览器通过服务器 Web Socket 和 HTTP 请求与其对应的环境通信。Node 模块运行器可以直接通过函数调用处理模块，因为它在同一进程中运行。其他环境可以通过连接到 JS 运行时（如 workerd）或 Worker 线程（如 Vitest）来运行模块。

此功能的目标之一是提供一个可定制的 API 来处理和运行代码。用户可以使用暴露的基础组件创建新的环境工厂。

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

## `ModuleRunner`

一个模块运行器在目标运行时中实例化。下一节中的所有 API 都从 `vite/module-runner` 导入，除非另有说明。这个导出入口文件尽可能保持轻量，仅导出创建模块运行器所需的最小部分。

**类型签名：**

```ts
export class ModuleRunner {
  constructor(
    public options: ModuleRunnerOptions,
    public evaluator: ModuleEvaluator,
    private debug?: ModuleRunnerDebugger,
  ) {}
  /**
   * 要执行的 URL。可以是文件路径，服务器路径，或者相对于根路径的 id
   */
  public async import<T = any>(url: string): Promise<T>
  /**
   * 清除所有缓存，包括 HMR 监听器
   */
  public clearCache(): void
  /**
   * 清除所有缓存，移除所有 HMR 监听器，并重置源映射支持
   * 此方法不会停止 HMR 连接
   */
  public async close(): Promise<void>
  /**
   * 如果通过调用 `close()` 方法关闭了运行器，则返回 `true`
   */
  public isClosed(): boolean
}
```

`ModuleRunner` 中的模块评估器负责执行代码。Vite 默认导出 `ESModulesEvaluator`，它使用 `new AsyncFunction` 来执行代码。如果你的 JavaScript 运行时不支持不安全的运行，你可以提供你自己的实现。

模块运行器暴露了 `import` 方法。当 Vite 服务器触发 `full-reload` HMR 事件时，所有受影响的模块将被重新执行。请注意，当这种情况发生时，模块运行器不会更新 `exports` 对象（会覆盖它），如果你依赖于拥有最新的 `exports` 对象，你需要再次运行 `import` 或从 `evaluatedModules` 中获取模块。

**使用示例：**

```js
import { ModuleRunner, ESModulesEvaluator } from 'vite/module-runner'
import { root, fetchModule } from './rpc-implementation.js'

const moduleRunner = new ModuleRunner(
  {
    root,
    fetchModule,
    // 你也可以提供 hmr.connection 来支持 HMR
  },
  new ESModulesEvaluator(),
)

await moduleRunner.import('/src/entry-point.js')
```

## `ModuleRunnerOptions`

```ts
export interface ModuleRunnerOptions {
  /**
   * 项目根目录
   */
  root: string
  /**
   * 一组与服务器通信的方法
   */
  transport: RunnerTransport
  /**
   * 配置如何解析源映射。如果 `process.setSourceMapsEnabled` 可用，首选 `node`
   * 否则，它将默认使用 `prepareStackTrace`，这将覆盖 `Error.prepareStackTrace` 方法
   * 你可以提供一个对象来配置如何解析未被 Vite 处理的文件的内容和其源映射
   */
  sourcemapInterceptor?:
    | false
    | 'node'
    | 'prepareStackTrace'
    | InterceptorOptions
  /**
   * 禁用 HMR 或配置 HMR 选项
   */
  hmr?:
    | false
    | {
        /**
         * 配置 HMR 如何在客户端和服务器之间通信
         */
        connection: ModuleRunnerHMRConnection
        /**
         * 配置 HMR 日志
         */
        logger?: false | HMRLogger
      }
  /**
   * 自定义模块缓存。如果未提供，它将为每个模块运行器实例创建一个单独的模块缓存
   */
  evaluatedModules?: EvaluatedModules
}
```

## `ModuleEvaluator`

**类型签名：**

```ts
export interface ModuleEvaluator {
  /**
   *  转换后代码中前缀行的数量。
   */
  startOffset?: number
  /**
   * 运行由 Vite 转换的代码。
   * @param context 函数上下文
   * @param code 转换后的代码
   * @param id 用于获取模块的 ID
   */
  runInlinedModule(
    context: ModuleRunnerContext,
    code: string,
    id: string,
  ): Promise<any>
  /**
   * 运行外部化的模块
   * @param file 外部模块的文件 URL
   */
  runExternalModule(file: string): Promise<any>
}
```

Vite 默认导出了实现此接口的 `ESModulesEvaluator`。它使用 `new AsyncFunction` 来执行代码，因此，如果代码有内联源映射，它应该包含 [2 行的偏移](https://tc39.es/ecma262/#sec-createdynamicfunction) 以适应新增的行。这是由 `ESModulesEvaluator` 自动完成的。自定义评估器不会添加额外的行。

## RunnerTransport

**类型签名：**

```ts
interface RunnerTransport {
  /**
   * 获取模块信息的方法
   */
  fetchModule: FetchFunction
}
```

通过 RPC 或直接调用函数与环境通信的传输对象。默认情况下，你需要传递一个带有 `fetchModule` 方法的对象 - 它可以在其中使用任何类型的 RPC，但 Vite 也通过 `RemoteRunnerTransport` 类暴露双向传输接口，以使配置更容易。你需要将它与服务器上的 `RemoteEnvironmentTransport` 实例配对，就像在这个例子中，模块运行器在工作线程中创建：

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
    hot: /* 自定义热更新通道 */,
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

`RemoteRunnerTransport` 和 `RemoteEnvironmentTransport` 旨在一起使用，但你完全不必使用它们。你可以定义你自己的函数在运行器和服务器之间进行通信。例如，如果你通过 HTTP 请求连接到环境，你可以在 `fetchModule` 函数中调用 `fetch().json()`：

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

## ModuleRunnerHMRConnection

**类型签名：**

```ts
export interface ModuleRunnerHMRConnection {
  /**
   * 是否在向服务器发送消息之前完成检查
   */
  isReady(): boolean
  /**
   * 向服务器发送消息
   */
  send(payload: HotPayload): void
  /**
   * 配置当此连接触发更新时如何处理 HMR
   * 此方法期望连接开始监听 HMR 更新，并在接收到更新时调用此回调
   */
  onUpdate(callback: (payload: HotPayload) => void): void
}
```

这个接口定义了如何建立 HMR 通信。Vite 从主入口文件导出 `ServerHMRConnector`，以支持在 Vite SSR 期间的 HMR。当触发自定义事件时（比如，`import.meta.hot.send("my-event")`），通常会调用 `isReady` 和 `send` 方法。

`onUpdate` 只在新的模块运行器启动时调用一次。它传递了一个方法，当连接触发 HMR 事件时应该调用这个方法。实现取决于连接类型（例如，它可以是 `WebSocket`/`EventEmitter`/`MessageChannel`），但通常看起来像这样：

```js
function onUpdate(callback) {
  this.connection.on('hmr', (event) => callback(event.data))
}
```

回调会排队，它将等待当前更新解决后再处理下一个更新。与浏览器实现不同，模块运行器中的 HMR 更新将等待所有监听器（如，`vite:beforeUpdate`/`vite:beforeFullReload`）完成后再更新模块。
