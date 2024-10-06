# 钩子函数中的 this.environment {#this-environment-in-hooks}

::: tip 反馈
可以在 [环境 API 讨论](https://github.com/vitejs/vite/discussions/16358) 中向我们提供反馈
:::

在 Vite 6 版本之前，只有两个环境是可用的：`client` 和 `ssr`。在 `resolveId`、`load` 和 `transform` 中的 `options.ssr` 插件钩子参数，允许插件的作者在处理插件钩子中的模块时区分这两个环境。在 Vite 6 版本中，一个 Vite 应用可以根据需要定义任意数量的命名环境。我们在插件的上下文中引入了 `this.environment`，以便在钩子中与当前模块的环境进行交互。

影响范围：`Vite 插件作者`

::: warning 即将废弃
`this.environment` 最初在 `v6.0` 版本中被引入。我们计划在 `v7.0` 版本中废弃 `options.ssr`。到那时，我们会开始建议你将你的插件迁移到新的 API。如果想识别你的使用情况，可以在你的 vite 配置文件中将 `future.removePluginHookSsrArgument` 设置为 `"warn"`。
:::

## 动机 {#motivation}

`this.environment` 不仅可以让插件钩子实现知道当前的环境名称，还可以让它访问到环境配置选项、模块图信息和转换管道（`environment.config`、`environment.moduleGraph`、`environment.transformRequest()`）。在上下文中可以使用环境实例，这让插件的作者可以避免依赖整个开发服务器（通常是在通过 `configureServer` 钩子启动时进行缓存）。

## 迁移指南 {#migration-guide}

对于现有的插件，如果想要快速迁移，可以在 `resolveId`、`load` 和 `transform` 钩子中，将 `options.ssr` 参数替换为 `this.environment.name !== 'client'`：

```ts
import { Plugin } from 'vite'

export function myPlugin(): Plugin {
  return {
    name: 'my-plugin',
    resolveId(id, importer, options) {
      const isSSR = options.ssr // [!code --]
      const isSSR = this.environment.name !== 'client' // [!code ++]

      if (isSSR) {
        // SSR 特有逻辑
      } else {
        // 客户端特有逻辑
      }
    },
  }
}
```

对于更稳定、长期的实现，插件钩子应该处理 [多个环境](/guide/api-environment.html#accessing-the-current-environment-in-hooks)，并使用细粒度的环境选项，而不是依赖于环境的名称。
