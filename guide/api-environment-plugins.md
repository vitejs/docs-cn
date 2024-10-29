# 用于插件的环境 API {#environment-api-for-plugins}

:::warning 实验性
这个 API 的初始版本在 Vite 5.1 中以 "Vite Runtime API" 的名字被引入。这份指南介绍了经过修订后的 API，被重新命名为环境 API（Environment API）。这个 API 将在 Vite 6 中作为实验性功能发布。你现在已经可以在最新的 `vite@6.0.0-beta.x` 版本中进行测试。

资料：

- [反馈讨论](https://github.com/vitejs/vite/discussions/16358) 我们在此处收集新 API 的反馈。
- [环境 API PR](https://github.com/vitejs/vite/pull/16471) 新 API 在此处被实现并进行了审查。

在参与测试这个提议的过程中，请与我们分享您的反馈。
:::

## 在钩子中访问当前环境 {#accessing-the-current-environment-in-hooks}

在 Vite 6之前，由于只有两个环境（`client` 和 `ssr`），一个 `ssr` 布尔值足以在 Vite API 中识别当前环境。插件钩子在最后的选项参数中接收一个 `ssr` 布尔值，多个 API 也期望通过一个可选的 `ssr` 参数来正确地将模块关联到对应的环境（例如 `server.moduleGraph.getModuleByUrl(url, { ssr })`）。

随着可配置的环境出现，我们现在有了一种统一的方法来在插件中访问它们的选项和实例。插件钩子现在在其上下文中暴露 `this.environment`，以前期望 `ssr` 布尔值的 API 现在被限定到正确的环境（例如 `environment.moduleGraph.getModuleByUrl(url)`）。

Vite 服务器有一个共享的插件管道，但在处理模块时，它总是在给定环境的上下文中进行。`environment` 实例在插件上下文中可用。

插件可以使用 `environment` 实例根据环境的配置（可通过 `environment.config` 访问）来改变模块的处理方式。

```ts
  transform(code, id) {
    console.log(this.environment.config.resolve.conditions)
  }
```

## 使用钩子注册新环境 {#registering-new-environments-using-hooks}

插件可以在 `config` 钩子中添加新环境（例如，为了有一个专门用于 [RSC](https://react.dev/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023#react-server-components) 的模块图）：

```ts
  config(config: UserConfig) {
    config.environments.rsc ??= {}
  }
```

一个空对象就足以注册环境，默认值则来自于根级别的环境配置。

## 使用钩子配置环境 {#configuring-environment-using-hooks}

当 `config` 钩子正在运行时，我们还不知道完整的环境列表，而且环境可以受到来自根级别环境配置的默认值或通过 `config.environments` 记录明确影响。
插件应使用 `config` 钩子设置默认值。要配置每个环境，可以使用新的 `configEnvironment` 钩子。此钩子会为每个环境调用，并传入其部分解析的配置，包括最终默认值的解析。

```ts
  configEnvironment(name: string, options: EnvironmentOptions) {
    if (name === 'rsc') {
      options.resolve.conditions = // ...
```

## `hotUpdate` 钩子 {#the-hotupdate-hook}

- **类型：** `(this: { environment: DevEnvironment }, options: HotUpdateOptions) => Array<EnvironmentModuleNode> | void | Promise<Array<EnvironmentModuleNode> | void>`
- **查看：** [HMR API](./api-hmr)

`hotUpdate` 钩子允许插件为特定环境执行自定义的 HMR 更新处理。当一个文件发生变化时，会按照 `server.environments` 中的顺序为每个环境依次运行 HMR 算法，因此 `hotUpdate` 钩子会被多次调用。这个钩子会接收一个带有以下签名的上下文对象：

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

可以选择钩子用于：

- 过滤和缩小受影响的模块列表，使 HMR 更准确。

- 返回一个空数组并执行完全重载：

  ```js
  hotUpdate({ modules, timestamp }) {
    if (this.environment.name !== 'client')
      return

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

- 返回一个空数组并通过向客户端发送自定义事件来执行完全自定义的 HMR 处理：

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
      // 执行自定义更新
    })
  }
  ```

## 分环境的插件 {#per-environment-plugins}

插件可以使用 `applyToEnvironment` 函数定义其应适用于哪些环境。

```js
const UnoCssPlugin = () => {
  // 共享的全局状态
  return {
    buildStart() {
      // 使用 WeakMap<Environment, Data>，this.environment 初始化每个环境的状态
    },
    configureServer() {
      // 正常使用全局钩子
    },
    applyToEnvironment(environment) {
      // 如果这个插件应该在这个环境中激活，则返回 true
      // 如果没有提供这个函数，则插件在所有环境中都是激活的
    },
    resolveId(id, importer) {
      // 只对此插件适用的环境进行调用
    },
  }
}
```

## 构建钩子中的环境 {#environment-in-build-hooks}

与开发期间一样，插件钩子在构建期间也接收环境实例，取代了 `ssr` 布尔值。
这同样适用于 `renderChunk`、`generateBundle` 和其他仅在构建时使用的钩子。

## 构建期间的共享插件 {#shared-plugins-during-build}

在 Vite 6 之前，插件管道在开发和构建期间的工作方式不同：

- **开发期间：** 插件是共享的
- **构建期间：** 插件对每个环境是隔离的（在不同的进程中：`vite build` 然后 `vite build --ssr`）。

这迫使框架通过写入文件系统的清单文件在 `client` 构建和 `ssr` 构建之间共享状态。在 Vite 6 中，我们现在在单个进程中构建所有环境，因此插件管道和环境间通信的方式可以与开发对齐。

在未来的主要版本（Vite 7 或 8）中，我们的目标是完全对齐：

- **在开发和构建期间：** 插件是共享的，并具有[按环境的过滤](#per-environment-plugins)

在构建期间还会共享一个单一的 `ResolvedConfig` 实例，允许在整个应用构建过程中进行缓存，类似于我们在开发期间使用 `WeakMap<ResolvedConfig, CachedData>` 的方式。

对于 Vite 6，我们需要做一个较小的改动以保持向后兼容。生态系统插件当前使用 `config.build` 而不是 `environment.config.build` 来访问配置，因此我们需要默认为每个环境创建一个新的 `ResolvedConfig`。项目可以通过设置 `builder.sharedConfigBuild` 为 `true` 来选择共享完整的配置和插件管道。

此选项最初仅适用于一小部分项目，因此插件作者可以通过将 `sharedDuringBuild` 标志设置为 `true` 来选择特定插件在构建期间共享。这可以很容易地共享常规插件的状态：

```js
function myPlugin() {
  // 在开发和构建中的所有环境之间共享状态
  const sharedState = ...
  return {
    name: 'shared-plugin',
    transform(code, id) { ... },

    // 选择在所有环境中使用单个实例
    sharedDuringBuild: true,
  }
}
```
