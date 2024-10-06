# 迁移到按环境划分的 API {#move-to-per-environment-apis}

::: tip 反馈
可以在 [环境 API 讨论](https://github.com/vitejs/vite/discussions/16358) 中向我们提供反馈
:::

ViteDevServer 中与模块图相关的多个 API 已经被更加独立的环境 API 所替代。

- `server.moduleGraph` -> [`environment.moduleGraph`](/guide/api-environment#separate-module-graphs)
- `server.transformRequest` -> `environment.transformRequest`
- `server.warmupRequest` -> `environment.warmupRequest`

影响范围：`Vite 插件作者`

::: warning 即将废弃
环境实例首次在 `v6.0` 中引入。计划在 `v7.0` 中废弃现在的 `server.moduleGraph` 和其他方法。我们不建议你现在就放弃 server 方法。要识别你的使用情况，请在你的 vite 配置中设置以下。

```ts
future: {
  removeServerModuleGraph: 'warn',
  removeServerTransformRequest: 'warn',
}
```

:::

## 动机 {#motivation}

// TODO: （保持原文）

## 迁移指南 {#migration-guide}

// TODO: （保持原文）
