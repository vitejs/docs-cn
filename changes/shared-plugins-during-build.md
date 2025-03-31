# 构建过程中的共享插件 {#shared-plugins-during-build}

::: tip 反馈
可以在 [环境 API 讨论](https://github.com/vitejs/vite/discussions/16358) 中向我们提供反馈
:::

查看 [构建过程中的共享插件](/guide/api-environment-plugins.md#shared-plugins-during-build).

影响范围：`Vite 插件作者`

::: warning 未来默认值更改
`builder.sharedConfigBuild` 最初在 `v6.0` 版本中被引入。你可以将它设置为 `true`，以此来检查你的插件与共享配置是如何配合工作的。一旦插件生态系统准备就绪，我们希望能得到关于在未来的主要版本中改变默认设置的反馈。
:::

## 动机 {#motivation}

调整开发和构建插件管道。

## 迁移指南 {#migration-guide}

为实现跨环境共享插件，插件状态必须以当前环境为关键。以下形式的插件将计算所有环境中已转换模块的数量。

```js
function CountTransformedModulesPlugin() {
  let transformedModules
  return {
    name: 'count-transformed-modules',
    buildStart() {
      transformedModules = 0
    },
    transform(id) {
      transformedModules++
    },
    buildEnd() {
      console.log(transformedModules)
    },
  }
}
```

如果我们想要计算每个环境中已转换模块的数量，我们需要维护一个映射表。

```js
function PerEnvironmentCountTransformedModulesPlugin() {
  const state = new Map<Environment, { count: number }>()
  return {
    name: 'count-transformed-modules',
    perEnvironmentStartEndDuringDev: true,
    buildStart() {
      state.set(this.environment, { count: 0 })
    }
    transform(id) {
      state.get(this.environment).count++
    },
    buildEnd() {
      console.log(this.environment.name, state.get(this.environment).count)
    }
  }
}
```

为了简化这种模式，Vite 导出了一个 `perEnvironmentState` 助手：

```js
function PerEnvironmentCountTransformedModulesPlugin() {
  const state = perEnvironmentState<{ count: number }>(() => ({ count: 0 }))
  return {
    name: 'count-transformed-modules',
    perEnvironmentStartEndDuringDev: true,
    buildStart() {
      state(this).count = 0
    }
    transform(id) {
      state(this).count++
    },
    buildEnd() {
      console.log(this.environment.name, state(this).count)
    }
  }
}
```
