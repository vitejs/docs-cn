# 用于插件的环境 API {#environment-api-for-plugins}

:::info 发布候选版本
环境 API 目前处于发布候选阶段。我们将在主要版本发布之间保持 API 的稳定性，以便生态系统能够进行实验并在此基础上进行开发。然而，请注意，[某些特定的 API](/changes/#considering) 仍被视为实验性 API。

我们计划在未来主要版本发布时，待下游项目有足够时间对新功能进行实验并验证后，对这些新 API（可能包含兼容性变更）进行稳定化处理。

资料：

- [反馈讨论](https://github.com/vitejs/vite/discussions/16358) 我们在此处收集新 API 的反馈。
- [环境 API PR](https://github.com/vitejs/vite/pull/16471) 新 API 在此处被实现并进行了审查。

请与我们分享您的反馈。
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

插件可以在 `config` 钩子中添加新环境。例如，[RSC 支持](/plugins/#vitejs-plugin-rsc)使用一个额外的环境来拥有一个带有 `react-server` 条件的独立模块图：

```ts
  config(config: UserConfig) {
    return {
      environments: {
        rsc: {
          resolve: {
            conditions: ['react-server', ...defaultServerConditions],
          },
        },
      },
    }
  }
```

一个空对象就足以注册环境，默认值则来自于根级别的环境配置。

## 使用钩子配置环境 {#configuring-environment-using-hooks}

当 `config` 钩子正在运行时，我们还不知道完整的环境列表，而且环境可以受到来自根级别环境配置的默认值或通过 `config.environments` 记录明确影响。
插件应使用 `config` 钩子设置默认值。要配置每个环境，可以使用新的 `configEnvironment` 钩子。此钩子会为每个环境调用，并传入其部分解析的配置，包括最终默认值的解析。

```ts
  configEnvironment(name: string, options: EnvironmentOptions) {
    // add "workerd" condition to the rsc environment
    if (name === 'rsc') {
      return {
        resolve: {
          conditions: ['workerd'],
        },
      }
    }
  }
```

## `hotUpdate` 钩子 {#the-hotupdate-hook}

- **类型：** `(this: { environment: DevEnvironment }, options: HotUpdateOptions) => Array<EnvironmentModuleNode> | void | Promise<Array<EnvironmentModuleNode> | void>`
- **种类:** `async`, `sequential`
- **查看：** [HMR API](./api-hmr)

`hotUpdate` 钩子允许插件为特定环境执行自定义的 HMR 更新处理。当一个文件发生变化时，会按照 `server.environments` 中的顺序为每个环境依次运行 HMR 算法，因此 `hotUpdate` 钩子会被多次调用。这个钩子会接收一个带有以下签名的上下文对象：

```ts
interface HotUpdateOptions {
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

## 插件中的基于环境的状态 {#per-environment-state-in-plugins}

鉴于相同的插件实例会被用于不同的环境，插件的状态需要以 `this.environment` 作为键来存储。这与生态系统中已使用的模式相同，即使用 `ssr` 布尔值作为键来避免混合客户端和 SSR 模块状态的方式。可以使用 `Map<Environment, State>` 来分别为每个环境保存其对应的状态。注意：为了保持向后兼容性，在未设置 `perEnvironmentStartEndDuringDev: true` 标志时，`buildStart` 和 `buildEnd` 仅会针对客户端环境被调用。

```js
function PerEnvironmentCountTransformedModulesPlugin() {
  const state = new Map<Environment, { count: number }>()
  return {
    name: 'count-transformed-modules',
    perEnvironmentStartEndDuringDev: true,
    buildStart() {
      state.set(this.environment, { count: 0 })
    },
    transform(id) {
      state.get(this.environment).count++
    },
    buildEnd() {
      console.log(this.environment.name, state.get(this.environment).count)
    }
  }
}
```

## 基于环境的插件 {#per-environment-plugins}

插件可以使用 `applyToEnvironment` 函数来定义它适用的环境。

```js
const UnoCssPlugin = () => {
  // 共享的全局状态
  return {
    buildStart() {
      // 使用 Wea​​kMap<Environment,Data> 初始化每个环境状态
      // 使用 this.environment
    },
    configureServer() {
      // 正常使用全局钩子
    },
    applyToEnvironment(environment) {
      // 如果此插件应在此环境中激活，则返回 true
      // 或返回一个新插件来替代它。
      // 如果不使用这个 hook，则插件在所有环境中都是激活的
    },
    resolveId(id, importer) {
      // 只对此插件适用的环境进行调用
    },
  }
}
```

如果一个插件没有环境感知功能，并且其状态没有基于当前环境进行区分，`applyToEnvironment` 钩子可以轻松地将其设置为针对每个环境工作。

```js
import { nonShareablePlugin } from 'non-shareable-plugin'

export default defineConfig({
  plugins: [
    {
      name: 'per-environment-plugin',
      applyToEnvironment(environment) {
        return nonShareablePlugin({ outputName: environment.name })
      },
    },
  ],
})
```

Vite 输出了一个 `perEnvironmentPlugin` 助手，以简化这些不需要其他钩子的情况：

```js
import { nonShareablePlugin } from 'non-shareable-plugin'

export default defineConfig({
  plugins: [
    perEnvironmentPlugin('per-environment-plugin', (environment) =>
      nonShareablePlugin({ outputName: environment.name }),
    ),
  ],
})
```

`applyToEnvironment` 钩子在配置时调用，目前在 `configResolved` 之后调用，因为生态系统中的项目正在修改其中的插件。未来，环境插件解析可能会移至 `configResolved` 之前。

## 构建钩子中的环境 {#environment-in-build-hooks}

与开发期间一样，插件钩子在构建期间也接收环境实例，取代了 `ssr` 布尔值。
这同样适用于 `renderChunk`、`generateBundle` 和其他仅在构建时使用的钩子。

## 构建期间的共享插件 {#shared-plugins-during-build}

在 Vite 6 之前，插件管道在开发和构建期间的工作方式不同：

- **开发期间：** 插件是共享的
- **构建期间：** 插件对每个环境是隔离的（在不同的进程中：`vite build` 然后 `vite build --ssr`）。

这迫使框架通过写入文件系统的清单文件在 `client` 构建和 `ssr` 构建之间共享状态。在 Vite 6 中，我们现在在单个进程中构建所有环境，因此插件管道和环境间通信的方式可以与开发对齐。

在未来的主要版本，我们可以实现完全一致：

- **在开发和构建期间：** 插件是共享的，并可以 [根据环境进行过滤](#per-environment-plugins)

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
