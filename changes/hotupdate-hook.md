# HMR `hotUpdate` 插件钩子 {#hmr-hotupdate-plugin-hook}

::: tip 反馈
可以在 [环境 API 讨论](https://github.com/vitejs/vite/discussions/16358) 中向我们提供反馈
:::

我们计划废弃 `handleHotUpdate` 插件钩子，转而使用能够感知 [环境 API](/guide/api-environment.md) 的 [`hotUpdate` 钩子](/guide/api-environment#the-hotupdate-hook)，并通过 `create` 和 `delete` 来处理额外的监听事件。

影响范围：`Vite 插件作者`

::: warning 即将废弃
`hotUpdate` 钩子最初在 `v6.0` 版本中引入。我们计划在 `v7.0` 版本中废弃 `handleHotUpdate` 钩子。我们目前还不建议你停止使用 `handleHotUpdate`。如果你想尝试并向我们提供反馈，你可以在你的 vite 配置文件中将 `future.removePluginHookHandleHotUpdate` 设置为 `"warn"`。
:::

## 动机 {#motivation}

[`handleHotUpdate` 钩子](/guide/api-plugin.md#handlehotupdate) 可以让你执行自定义的模块热替换（HMR）更新处理。在 `HmrContext` 中，可以传入一个需要更新的模块列表。

```ts
interface HmrContext {
  file: string
  timestamp: number
  modules: Array<ModuleNode>
  read: () => string | Promise<string>
  server: ViteDevServer
}
```

`handleHotUpdate` 钩子在所有环境中只调用一次，传入的模块只有来自客户端和 SSR 环境的混合信息。一旦框架开始使用自定义环境，就需要一个新的钩子为每个环境调用。

新的 `hotUpdate` 钩子的工作方式与 `handleHotUpdate` 一样，但是它会在每个环境中被调用，并且会接收一个新的 `HotUpdateContext` 实例：

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

你可以像在其他插件钩子中一样，通过 `this.environment` 来访问当前的开发环境。现在，`modules` 列表只包含来自当前环境的模块节点。每个环境更新都可以定义不同的更新策略。

这个钩子也会在处理额外的监听事件时被调用，而不仅仅是在 `'update'` 事件中。你可以使用 `type` 来区分这些事件。

## 迁移指南 {#migration-guide}

过滤并缩小受影响的模块列表，使 HMR 更加准确。

```js
handleHotUpdate({ modules }) {
  return modules.filter(condition)
}

// 迁移至：

hotUpdate({ modules }) {
  return modules.filter(condition)
}
```

返回一个空数组并执行完全重载：

```js
handleHotUpdate({ server, modules, timestamp }) {
  // 手动使模块失效
  const invalidatedModules = new Set()
  for (const mod of modules) {
    server.moduleGraph.invalidateModule(
      mod,
      invalidatedModules,
      timestamp,
      true
    )
  }
  server.ws.send({ type: 'full-reload' })
  return []
}

// 迁移至：

hotUpdate({ modules, timestamp }) {
  // 手动使模块失效
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

返回一个空数组并通过向客户端发送自定义事件来执行完全自定义的 HMR 处理：

```js
handleHotUpdate({ server }) {
  server.ws.send({
    type: 'custom',
    event: 'special-update',
    data: {}
  })
  return []
}

// 迁移至：

hotUpdate() {
  this.environment.hot.send({
    type: 'custom',
    event: 'special-update',
    data: {}
  })
  return []
}
```
