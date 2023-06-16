# HMR API {#hmr-api}

:::tip 注意
这里是客户端 HMR API。若要在插件中处理 HMR 更新，详见 [handleHotUpdate](./api-plugin#handlehotupdate)。

手动 HMR API 主要用于框架和工具作者。作为最终用户，HMR 可能已经在特定于框架的启动器模板中为你处理过了。
:::

Vite 通过特殊的 `import.meta.hot` 对象暴露手动 HMR API。

```ts
interface ImportMeta {
  readonly hot?: ViteHotContext
}

type ModuleNamespace = Record<string, any> & {
  [Symbol.toStringTag]: 'Module'
}

interface ViteHotContext {
  readonly data: any

  accept(): void
  accept(cb: (mod: ModuleNamespace | undefined) => void): void
  accept(dep: string, cb: (mod: ModuleNamespace | undefined) => void): void
  accept(
    deps: readonly string[],
    cb: (mods: Array<ModuleNamespace | undefined>) => void,
  ): void

  dispose(cb: (data: any) => void): void
  prune(cb: (data: any) => void): void
  invalidate(message?: string): void

  // `InferCustomEventPayload` provides types for built-in Vite events
  on<T extends string>(
    event: T,
    cb: (payload: InferCustomEventPayload<T>) => void,
  ): void
  send<T extends string>(event: T, data?: InferCustomEventPayload<T>): void
}
```

## 必需的条件守卫 {#required-conditional-guard}

首先，请确保用一个条件语句守护所有 HMR API 的使用，这样代码就可以在生产环境中被 tree-shaking 优化：

```js
if (import.meta.hot) {
  // HMR 代码
}
```

## TypeScript 的智能提示 {#intellisense-for-typescript}
Vite 在 [`vite/client.d.ts`](https://github.com/vitejs/vite/blob/main/packages/vite/client.d.ts) 中为 `import.meta.hot` 提供了类型定义。你可以在 `src` 目录中创建一个 `env.d.ts`，以便 TypeScript 获取类型定义：

```ts
/// <reference types="vite/client" />
```

## `hot.accept(cb)` {#hot-accept-cb}

要接收模块自身，应使用 `import.meta.hot.accept`，参数为接收已更新模块的回调函数：

```js
export const count = 1

if (import.meta.hot) {
  import.meta.hot.accept((newModule) => {
    if (newModule) {
      // newModule is undefined when SyntaxError happened
      console.log('updated: count is now ', newModule.count)
    }
  })
}
```

“接受” 热更新的模块被认为是 **HMR 边界**。

Vite 的 HMR 实际上并不替换最初导入的模块：如果 HMR 边界模块从某个依赖重新导出其导入，则它应负责更新这些重新导出的模块（这些导出必须使用 `let`）。此外，从边界模块向上的导入者将不会收到更新。这种简化的 HMR 实现对于大多数开发用例来说已经足够了，同时允许我们跳过生成代理模块的昂贵工作。

Vite 要求这个函数的调用在源代码中显示为 `import.meta.hot.accept(`（对空格敏感），这样模块才能接受更新。这是 Vite 为使模块支持 HMR 而进行的静态分析的一个要求。

## `hot.accept(deps, cb)` {#hot-accept-deps-cb}

模块也可以接受直接依赖项的更新，而无需重新加载自身：

```js
import { foo } from './foo.js'

foo()

if (import.meta.hot) {
  import.meta.hot.accept('./foo.js', (newFoo) => {
    // 回调函数接收到更新后的'./foo.js' 模块
    newFoo?.foo()
  })

  // 也可以接受一个依赖模块的数组：
  import.meta.hot.accept(
    ['./foo.js', './bar.js'],
    ([newFooModule, newBarModule]) => {
      // 只有当所更新的模块非空时，回调函数接收一个数组
      // 如果更新不成功（例如语法错误），则该数组为空
    }
  )
}
```

## `hot.dispose(cb)` {#hot-dispose-cb}

一个接收自身的模块或一个期望被其他模块接收的模块可以使用 `hot.dispose` 来清除任何由其更新副本产生的持久副作用：

```js
function setupSideEffect() {}

setupSideEffect()

if (import.meta.hot) {
  import.meta.hot.dispose((data) => {
    // 清理副作用
  })
}
```

## `hot.prune(cb)` {#hot-prune-cb}

注册一个回调，当模块在页面上不再被导入时调用。与 `hot.dispose` 相比，如果源代码更新时自行清理了副作用，你只需要在模块从页面上被删除时，使用此方法进行清理。Vite 目前在 `.css` 导入上使用此方法。

```js
function setupOrReuseSideEffect() {}

setupOrReuseSideEffect()

if (import.meta.hot) {
  import.meta.hot.prune((data) => {
    // 清理副作用
  })
}
```

## `hot.data` {#hot-data}

`import.meta.hot.data` 对象在同一个更新模块的不同实例之间持久化。它可以用于将信息从模块的前一个版本传递到下一个版本。

## `hot.decline()` {#hot-decline}

目前是一个空操作并暂留用于向后兼容。若有新的用途设计可能在未来会发生变更。要指明某模块是不可热更新的，请使用 `hot.invalidate()`。

## `hot.invalidate(message?: string)` {#hot-invalidate}

一个接收自身的模块可以在运行时意识到它不能处理 HMR 更新，因此需要将更新强制传递给导入者。通过调用 `import.meta.hot.invalidate()`，HMR 服务将使调用方的导入失效，就像调用方不是接收自身的一样。这会同时在浏览器控制台和命令行中打印出一条信息，你可以传入这条信息，对发生失效的原因给予一些上下文。

请注意，你应该总是调用 `import.meta.hot.accept`，即使你打算随后立即调用 `invalidate`，否则 HMR 客户端将不会监听未来对接收自身模块的更改。为了清楚地表达你的意图，我们建议在 `accept` 回调中调用 `invalidate`，例如：

```js
import.meta.hot.accept((module) => {
  // 你可以使用新的模块实例来决定是否使其失效。
  if (cannotHandleUpdate(module)) {
    import.meta.hot.invalidate()
  }
})
```

## `hot.on(event, cb)` {#hot-onevent-cb}

监听自定义 HMR 事件。

以下 HMR 事件由 Vite 自动触发：

- `'vite:beforeUpdate'` 当更新即将被应用时（例如，一个模块将被替换）
- `'vite:afterUpdate'` 当更新已经被应用时（例如，一个模块已被替换）
- `'vite:beforeFullReload'` 当完整的重载即将发生时
- `'vite:beforePrune'` 当不再需要的模块即将被剔除时
- `'vite:invalidate'` 当使用 `import.meta.hot.invalidate()` 使一个模块失效时
- `'vite:error'` 当发生错误时（例如，语法错误）
- `'vite:ws:disconnect'` 当 WebSocket 链接丢失时
- `'vite:ws:connect'` 当 WebSocket 链接重修建立时

自定义 HMR 事件可以由插件发送。更多细节详见 [handleHotUpdate](./api-plugin#handleHotUpdate)。

## `hot.send(event, data)` {##hot-send-event-data}

发送自定义事件到 Vite 开发服务器。

如果在连接前调用，数据会先被缓存、等到连接建立好后再发送。

查看 [客户端与服务器的数据交互](/guide/api-plugin.html#client-server-communication) 一节获取更多细节。
