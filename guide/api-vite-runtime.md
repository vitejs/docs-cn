# Vite 运行时 API {#vite-runtime-api}

:::warning 低级别 API
这个 API 在 Vite 5.1 中作为一个实验性特性引入。它被添加以 [收集反馈](https://github.com/vitejs/vite/discussions/15774)。在Vite 5.2 中，它可能会有破坏性的变化，所以在使用它时，请确保将 Vite 版本固定在 `~5.1.0`。这是一个面向库和框架作者的低级别 API。如果你的目标是开发应用，请确保首先查看 [Vite SSR 精选板块](https://github.com/vitejs/awesome-vite#ssr) 的高级 SSR 插件和工具。
:::

"Vite 运行时" 是一个工具，它允许首先用 Vite 插件处理任何代码后运行。它与 `server.ssrLoadModule` 不同，因为运行时实现是从服务器解耦的。这允许库和框架作者实现他们自己的服务器和运行时之间的通信层。

这个特性的一个目标是提供一个可定制的API来处理和运行代码。Vite 提供了足够的工具来开箱即用 Vite 运行时，但如果用户的需求与 Vite 的内置实现不一致，他们可以在其基础上进行构建。

除非另有说明，所有API都可以从 `vite/runtime` 导入。

## `ViteRuntime`

**类型签名：**

```ts
export class ViteRuntime {
  constructor(
    public options: ViteRuntimeOptions,
    public runner: ViteModuleRunner,
    private debug?: ViteRuntimeDebugger,
  ) {}
  /**
   * URL to execute. Accepts file path, server path, or id relative to the root.
   */
  public async executeUrl<T = any>(url: string): Promise<T>
  /**
   * Entry point URL to execute. Accepts file path, server path or id relative to the root.
   * In the case of a full reload triggered by HMR, this is the module that will be reloaded.
   * If this method is called multiple times, all entry points will be reloaded one at a time.
   */
  public async executeEntrypoint<T = any>(url: string): Promise<T>
  /**
   * Clear all caches including HMR listeners.
   */
  public clearCache(): void
  /**
   * Clears all caches, removes all HMR listeners, and resets source map support.
   * This method doesn't stop the HMR connection.
   */
  public async destroy(): Promise<void>
  /**
   * Returns `true` if the runtime has been destroyed by calling `destroy()` method.
   */
  public isDestroyed(): boolean
}
```

::: tip 进阶用法
如果你是从 `server.ssrLoadModule` 迁移过来，并且想要支持热模块替换（HMR），你可以考虑用 [`createViteRuntime`](#createviteruntime) 替代。
:::

当你初始化 `ViteRuntime` 类时，需要 `root` 和 `fetchModule` 这两个选项。Vite 在 [`server`](/guide/api-javascript) 实例中公开了 `ssrFetchModule`，以便更方便地与 Vite SSR 集成。Vite 主入口也导出了 `fetchModule` - 它不会假设代码的运行方式，这与期望代码通过 `new Function` 运行的 `ssrFetchModule` 是不同的，这一点可以从这些函数返回的 sourcemap 中看出。

`ViteRuntime` 中的 Runner 负责执行代码。Vite 开箱即用地提供了 `ESModulesRunner`，它使用 `new AsyncFunction` 来运行代码。如果你的 JavaScript 运行环境不支持不安全的执行，你可以提供你自己的实现。

运行时公开的两个主要方法是 `executeUrl` 和 `executeEntrypoint`。它们之间唯一的区别是，如果热模块替换（HMR）触发了 `full-reload` 事件，那么 `executeEntrypoint` 执行的所有模块都将重新执行。但请注意，当这种情况发生时，Vite 运行时不会更新 `exports` 对象（它会被覆盖），如果你需要最新的 `exports` 对象，你需要重新运行 `executeUrl` 或从 `moduleCache` 再次获取模块。

**使用示例：**

```js
import { ViteRuntime, ESModulesRunner } from 'vite/runtime'
import { root, fetchModule } from './rpc-implementation.js'

const runtime = new ViteRuntime(
  {
    root,
    fetchModule,
    // you can also provide hmr.connection to support HMR
  },
  new ESModulesRunner(),
)

await runtime.executeEntrypoint('/src/entry-point.js')
```

## `ViteRuntimeOptions`

```ts
export interface ViteRuntimeOptions {
  /**
   * Root of the project
   */
  root: string
  /**
   * A method to get the information about the module.
   * For SSR, Vite exposes `server.ssrFetchModule` function that you can use here.
   * For other runtime use cases, Vite also exposes `fetchModule` from its main entry point.
   */
  fetchModule: FetchFunction
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
        connection: HMRRuntimeConnection
        /**
         * Configure HMR logger.
         */
        logger?: false | HMRLogger
      }
  /**
   * Custom module cache. If not provided, it creates a separate module cache for each ViteRuntime instance.
   */
  moduleCache?: ModuleCacheMap
}
```

## `ViteModuleRunner`

**类型签名：**

```ts
export interface ViteModuleRunner {
  /**
   * Run code that was transformed by Vite.
   * @param context Function context
   * @param code Transformed code
   * @param id ID that was used to fetch the module
   */
  runViteModule(
    context: ViteRuntimeModuleContext,
    code: string,
    id: string,
  ): Promise<any>
  /**
   * Run externalized module.
   * @param file File URL to the external module
   */
  runExternalModule(file: string): Promise<any>
}
```

Vite 默认导出了实现了这个接口的 `ESModulesRunner`。它使用 `new AsyncFunction` 来执行代码，所以如果代码中有内联的源代码映射（sourcemap），它应该包含 [2行的偏移](https://tc39.es/ecma262/#sec-createdynamicfunction) 以适应新添加的行。这是由 `server.ssrFetchModule` 自动完成的。如果你的 runner 实现没有这个限制，你应该直接使用 `fetchModule`（从 `vite` 导出）。

## HMRRuntimeConnection

**类型签名：**

```ts
export interface HMRRuntimeConnection {
  /**
   * Checked before sending messages to the client.
   */
  isReady(): boolean
  /**
   * Send message to the client.
   */
  send(message: string): void
  /**
   * Configure how HMR is handled when this connection triggers an update.
   * This method expects that connection will start listening for HMR updates and call this callback when it's received.
   */
  onUpdate(callback: (payload: HMRPayload) => void): void
}
```

这个接口定义了如何建立热模块替换（HMR）的通信。Vite 从主入口处导出 `ServerHMRConnector`，以在 Vite SSR 期间支持 HMR。当自定义事件被触发时（例如，`import.meta.hot.send("my-event")`），通常会调用 `isReady` 和 `send` 方法。

只有在新的运行环境启动时，才会调用 `onUpdate`。它传递下来一个在连接触发 HMR 事件时应该调用的方法。实现方式取决于连接的类型（例如，它可以是 `WebSocket`/`EventEmitter`/`MessageChannel`），但通常看起来像这样：

```js
function onUpdate(callback) {
  this.connection.on('hmr', (event) => callback(event.data))
}
```

回调会被放入队列中，它会等待当前的更新完成后才处理下一个更新。与浏览器的实现不同，Vite 运行环境中的 HMR 更新会等到所有的监听器（例如，`vite:beforeUpdate`/`vite:beforeFullReload`）都完成后才更新模块。

## `createViteRuntime`

**类型签名：**

```ts
async function createViteRuntime(
  server: ViteDevServer,
  options?: MainThreadRuntimeOptions,
): Promise<ViteRuntime>
```

**Example Usage:**

```js
import { createServer } from 'vite'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

;(async () => {
  const server = await createServer({
    root: __dirname,
  })
  await server.listen()

  const runtime = await createViteRuntime(server)
  await runtime.executeEntrypoint('/src/entry-point.js')
})()
```

这个方法可以作为 `server.ssrLoadModule` 的简单替代。不同于 `ssrLoadModule`，`createViteRuntime` 默认就支持 HMR。你可以传递 [`options`](#mainthreadruntimeoptions) 来定制 SSR 运行环境的行为，以满足你的需求。

## `MainThreadRuntimeOptions`

```ts
export interface MainThreadRuntimeOptions
  extends Omit<ViteRuntimeOptions, 'root' | 'fetchModule' | 'hmr'> {
  /**
   * Disable HMR or configure HMR logger.
   */
  hmr?:
    | false
    | {
        logger?: false | HMRLogger
      }
  /**
   * Provide a custom module runner. This controls how the code is executed.
   */
  runner?: ViteModuleRunner
}
```
