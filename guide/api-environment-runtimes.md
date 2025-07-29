# 用于运行时的环境 API {#environment-api-for-runtimes}

:::info 发布候选版本
环境 API 目前处于发布候选阶段。我们将在主要版本发布之间保持 API 的稳定性，以便生态系统能够进行实验并在此基础上进行开发。然而，请注意，[某些特定的 API](/changes/#considering) 仍被视为实验性 API。

我们计划在未来主要版本发布时，待下游项目有足够时间对新功能进行实验并验证后，对这些新 API（可能包含兼容性变更）进行稳定化处理。

资料：

- [反馈讨论](https://github.com/vitejs/vite/discussions/16358) 我们在此处收集新 API 的反馈。
- [环境 API PR](https://github.com/vitejs/vite/pull/16471) 新 API 在此处被实现并进行了审查。

请与我们分享您的反馈。
:::

## 环境工厂 {#environment-factories}

环境工厂（Environments factory）旨在由环境提供者（如 Cloudflare）实现，而不是由终端用户实现。环境工厂返回一个 `EnvironmentOptions`，用于在开发和构建环境中使用目标运行时的最常见情况。默认环境选项也可以设置，因此用户无需手动配置。

```ts
function createWorkerdEnvironment(
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
            hot: true,
            transport: customHotChannel(),
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
import { DevEnvironment, HotChannel } from 'vite'

function createWorkerdDevEnvironment(
  name: string,
  config: ResolvedConfig,
  context: DevEnvironmentContext
) {
  const connection = /* ... */
  const transport: HotChannel = {
    on: (listener) => { connection.on('message', listener) },
    send: (data) => connection.send(data),
  }

  const workerdDevEnvironment = new DevEnvironment(name, config, {
    options: {
      resolve: { conditions: ['custom'] },
      ...context.options,
    },
    hot: true,
    transport,
  })
  return workerdDevEnvironment
}
```

[`DevEnvironment` 具有多个通信级别](/guide/api-environment-frameworks#devenvironment-communication-levels)。为了便于框架编写与运行时无关的代码，我们建议实现尽可能灵活的通信级别。

## `ModuleRunner`

一个模块运行器在目标运行时中实例化。下一节中的所有 API 都从 `vite/module-runner` 导入，除非另有说明。这个导出入口文件尽可能保持轻量，仅导出创建模块运行器所需的最小部分。

**类型签名：**

```ts
export class ModuleRunner {
  constructor(
    public options: ModuleRunnerOptions,
    public evaluator: ModuleEvaluator = new ESModulesEvaluator(),
    private debug?: ModuleRunnerDebugger,
  ) {}
  /**
   * 要执行的 URL。
   * 可以是文件路径，服务器路径，或者相对于根路径的 id
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
   * 如果通过调用 `close()` 关闭了运行器，则返回 `true`
   */
  public isClosed(): boolean
}
```

`ModuleRunner` 中的模块评估器负责执行代码。Vite 默认导出 `ESModulesEvaluator`，它使用 `new AsyncFunction` 来执行代码。如果你的 JavaScript 运行时不支持不安全的运行，你可以提供你自己的实现。

模块运行器暴露了 `import` 方法。当 Vite 服务器触发 `full-reload` HMR 事件时，所有受影响的模块将被重新执行。请注意，当这种情况发生时，模块运行器不会更新 `exports` 对象（会覆盖它），如果你依赖于拥有最新的 `exports` 对象，你需要再次运行 `import` 或从 `evaluatedModules` 中获取模块。

**使用示例：**

```js
import {
  ModuleRunner,
  ESModulesEvaluator,
  createNodeImportMeta,
} from 'vite/module-runner'
import { transport } from './rpc-implementation.js'

const moduleRunner = new ModuleRunner(
  {
    transport,
    createImportMeta: createNodeImportMeta, // if the module runner runs in Node.js
  },
  new ESModulesEvaluator(),
)

await moduleRunner.import('/src/entry-point.js')
```

## `ModuleRunnerOptions`

```ts twoslash
import type {
  InterceptorOptions as InterceptorOptionsRaw,
  ModuleRunnerHmr as ModuleRunnerHmrRaw,
  EvaluatedModules,
} from 'vite/module-runner'
import type { Debug } from '@type-challenges/utils'

type InterceptorOptions = Debug<InterceptorOptionsRaw>
type ModuleRunnerHmr = Debug<ModuleRunnerHmrRaw>
/** 见下文 */
type ModuleRunnerTransport = unknown

// ---cut---
interface ModuleRunnerOptions {
  /**
   * 一组与服务器通信的方法
   */
  transport: ModuleRunnerTransport
  /**
   * 配置如何解析源映射。
   * 如果 `process.setSourceMapsEnabled` 可用，首选 `node`
   * 否则，它将默认使用 `prepareStackTrace`，这将
   * 覆盖 `Error.prepareStackTrace` 方法
   * 你可以提供一个对象来配置如何解析
   * 未被 Vite 处理的文件的内容和其源映射
   */
  sourcemapInterceptor?:
    | false
    | 'node'
    | 'prepareStackTrace'
    | InterceptorOptions
  /**
   * 禁用 HMR 或配置 HMR 选项
   *
   * @default true
   */
  hmr?: boolean | ModuleRunnerHmr
  /**
   * 自定义模块缓存。如果未提供，它将创建一个单独的模块缓存给
   * 每个模块运行器实例
   */
  evaluatedModules?: EvaluatedModules
}
```

## `ModuleEvaluator`

**类型签名：**

```ts twoslash
import type { ModuleRunnerContext as ModuleRunnerContextRaw } from 'vite/module-runner'
import type { Debug } from '@type-challenges/utils'

type ModuleRunnerContext = Debug<ModuleRunnerContextRaw>

// ---cut---
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

## `ModuleRunnerTransport` {#modulerunnertransport}

**类型签名：**

```ts twoslash
import type { ModuleRunnerTransportHandlers } from 'vite/module-runner'
/** 一个对象 */
type HotPayload = unknown
// ---cut---
interface ModuleRunnerTransport {
  connect?(handlers: ModuleRunnerTransportHandlers): Promise<void> | void
  disconnect?(): Promise<void> | void
  send?(data: HotPayload): Promise<void> | void
  invoke?(data: HotPayload): Promise<{ result: any } | { error: any }>
  timeout?: number
}
```

通过 RPC 或直接调用函数与环境通信的传输对象。如果未执行 `invoke` 方法，则必须执行 `send` 方法和 `connect` 方法。Vite 将在内部构建 `invoke` 方法。

你需要将它与服务器上的 `HotChannel` 实例结合起来，就像本例中在工作线程中创建模块运行程序一样：

::: code-group

```js [worker.js]
import { parentPort } from 'node:worker_threads'
import { fileURLToPath } from 'node:url'
import {
  ESModulesEvaluator,
  ModuleRunner,
  createNodeImportMeta,
} from 'vite/module-runner'

/** @type {import('vite/module-runner').ModuleRunnerTransport} */
const transport = {
  connect({ onMessage, onDisconnection }) {
    parentPort.on('message', onMessage)
    parentPort.on('close', onDisconnection)
  },
  send(data) {
    parentPort.postMessage(data)
  },
}

const runner = new ModuleRunner(
  {
    transport,
    createImportMeta: createNodeImportMeta,
  },
  new ESModulesEvaluator(),
)
```

```js [server.js]
import { BroadcastChannel } from 'node:worker_threads'
import { createServer, RemoteEnvironmentTransport, DevEnvironment } from 'vite'

function createWorkerEnvironment(name, config, context) {
  const worker = new Worker('./worker.js')
  const handlerToWorkerListener = new WeakMap()

  const workerHotChannel = {
    send: (data) => worker.postMessage(data),
    on: (event, handler) => {
      if (event === 'connection') return

      const listener = (value) => {
        if (value.type === 'custom' && value.event === event) {
          const client = {
            send(payload) {
              worker.postMessage(payload)
            },
          }
          handler(value.data, client)
        }
      }
      handlerToWorkerListener.set(handler, listener)
      worker.on('message', listener)
    },
    off: (event, handler) => {
      if (event === 'connection') return
      const listener = handlerToWorkerListener.get(handler)
      if (listener) {
        worker.off('message', listener)
        handlerToWorkerListener.delete(handler)
      }
    },
  }

  return new DevEnvironment(name, config, {
    transport: workerHotChannel,
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

使用 HTTP 请求在运行程序和服务器之间进行通信的另一个示例：

```ts
import { ESModulesEvaluator, ModuleRunner } from 'vite/module-runner'

export const runner = new ModuleRunner(
  {
    transport: {
      async invoke(data) {
        const response = await fetch(`http://my-vite-server/invoke`, {
          method: 'POST',
          body: JSON.stringify(data),
        })
        return response.json()
      },
    },
    hmr: false, // disable HMR as HMR requires transport.connect
  },
  new ESModulesEvaluator(),
)

await runner.import('/entry.js')
```

在这种情况下，可以使用 `NormalizedHotChannel` 中的 `handleInvoke` 方法：

```ts
const customEnvironment = new DevEnvironment(name, config, context)

server.onRequest((request: Request) => {
  const url = new URL(request.url)
  if (url.pathname === '/invoke') {
    const payload = (await request.json()) as HotPayload
    const result = customEnvironment.hot.handleInvoke(payload)
    return new Response(JSON.stringify(result))
  }
  return Response.error()
})
```

但请注意，要支持 HMR，必须使用 `send` 和 `connect` 方法。`send` 方法通常在触发自定义事件时调用（如`import.meta.hot.send("my-event")`）。

Vite 从主入口导出 `createServerHotChannel`，以支持 Vite SSR 期间的 HMR。
