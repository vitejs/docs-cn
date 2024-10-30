# 迁移到按环境划分的 API {#move-to-per-environment-apis}

::: tip 反馈
可以在 [环境 API 讨论](https://github.com/vitejs/vite/discussions/16358) 中向我们提供反馈
:::

<<<<<<< HEAD
ViteDevServer 中与模块图相关的多个 API 已经被更加独立的环境 API 所替代。

- `server.moduleGraph` -> [`environment.moduleGraph`](/guide/api-environment#separate-module-graphs)
- `server.transformRequest` -> `environment.transformRequest`
- `server.warmupRequest` -> `environment.warmupRequest`
=======
Multiple APIs from `ViteDevServer` related to module graph and modules transforms have been moved to the `DevEnvironment` instances.
>>>>>>> d8c74e66bba83268fb86bc8aef187cf2a9f1be55

影响范围：`Vite 插件作者`

<<<<<<< HEAD
::: warning 即将废弃
环境实例首次在 `v6.0` 中引入。计划在 `v7.0` 中废弃现在的 `server.moduleGraph` 和其他方法。我们不建议你现在就放弃 server 方法。要识别你的使用情况，请在你的 vite 配置中设置以下。
=======
::: warning Future Deprecation
The `Environment` instance was first introduced at `v6.0`. The deprecation of `server.moduleGraph` and other methods that are now in environments is planned for `v7.0`. We don't recommend moving away from server methods yet. To identify your usage, set these in your vite config.
>>>>>>> d8c74e66bba83268fb86bc8aef187cf2a9f1be55

```ts
future: {
  removeServerModuleGraph: 'warn',
  removeServerTransformRequest: 'warn',
}
```

:::

## 动机 {#motivation}

<<<<<<< HEAD
// TODO: （保持原文）
=======
In Vite v5 and before, a single Vite dev server always had two environments (`client` and `ssr`). The `server.moduleGraph` had mixed modules from both of these environments. Nodes were connected through `clientImportedModules` and `ssrImportedModules` lists (but a single `importers` list was maintained for each). A transformed module was represented by an `id` and a `ssr` boolean. This boolean needed to be passed to APIs, for example `server.moduleGraph.getModuleByUrl(url, ssr)` and `server.transformRequest(url, { ssr })`.

In Vite v6, it is now possible to create any number of custom environments (`client`, `ssr`, `edge`, etc). A single `ssr` boolean isn't enough anymore. Instead of changing the APIs to be of the form `server.transformRequest(url, { environment })`, we moved these methods to the environment instance allowing them to be called without a Vite dev server.
>>>>>>> d8c74e66bba83268fb86bc8aef187cf2a9f1be55

## 迁移指南 {#migration-guide}

<<<<<<< HEAD
// TODO: （保持原文）
=======
- `server.moduleGraph` -> [`environment.moduleGraph`](/guide/api-environment#separate-module-graphs)
- `server.transformRequest(url, ssr)` -> `environment.transformRequest(url)`
- `server.warmupRequest(url, ssr)` -> `environment.warmupRequest(url)`
>>>>>>> d8c74e66bba83268fb86bc8aef187cf2a9f1be55
