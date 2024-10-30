# 构建过程中的共享插件 {#shared-plugins-during-build}

::: tip 反馈
可以在 [环境 API 讨论](https://github.com/vitejs/vite/discussions/16358) 中向我们提供反馈
:::

<<<<<<< HEAD
// TODO:（保持原文）
查看 [构建过程中的共享插件](/guide/api-environment.md#shared-plugins-during-build).
=======
See [Shared plugins during build](/guide/api-environment.md#shared-plugins-during-build).
>>>>>>> d8c74e66bba83268fb86bc8aef187cf2a9f1be55

影响范围：`Vite 插件作者`

::: warning 未来默认值更改
`builder.sharedConfigBuild` 最初在 `v6.0` 版本中被引入。你可以将它设置为 `true`，以此来检查你的插件与共享配置是如何配合工作的。一旦插件生态系统准备就绪，我们希望能得到关于在未来的主要版本中改变默认设置的反馈。
:::

## 动机 {#motivation}

<<<<<<< HEAD
// TODO: （保持原文）
=======
Align dev and build plugin pipelines.
>>>>>>> d8c74e66bba83268fb86bc8aef187cf2a9f1be55

## 迁移指南 {#migration-guide}

<<<<<<< HEAD
// TODO: （保持原文）
=======
To be able to share plugins across environments, plugin state must be keyed by the current environment. A plugin of the following form will count the number of transformed modules across all environments.

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

If we instead want to count the number of transformed modules for each environment, we need to keep a map:

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

To simplify this pattern, internally in Vite, we use a `usePerEnvironmentState` helper:

```js
function PerEnvironmentCountTransformedModulesPlugin() {
  const state = usePerEnvironmentState<{ count: number }>(() => ({ count: 0 }))
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
>>>>>>> d8c74e66bba83268fb86bc8aef187cf2a9f1be55
