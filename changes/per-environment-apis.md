# 迁移到基于环境的API {#move-to-per-environment-apis}

::: tip 反馈
可以在 [环境 API 讨论](https://github.com/vitejs/vite/discussions/16358) 中向我们提供反馈
:::

`ViteDevServer` 中与 module graph 和 modules transforms 相关的多个 API 已移至 `DevEnvironment` 实例。

影响范围：`Vite 插件作者`

::: warning 即将废弃
`环境`实例首次在 `v6.0` 中引入。计划在未来的 major 版本中废弃现在的 `server.moduleGraph` 和其他方法。我们不建议你现在就放弃 server 方法。要识别你的使用情况，请在你的 vite 配置中设置以下。

```ts
future: {
  removeServerModuleGraph: 'warn',
  removeServerReloadModule: 'warn',
  removeServerPluginContainer: 'warn',
  removeServerHot: 'warn',
  removeServerTransformRequest: 'warn',
  removeServerWarmupRequest: 'warn',
}
```

:::

## 动机 {#motivation}

在 Vite v5 及之前的版本中，一个 Vite 开发服务器总是有两个环境（`client` 和 `ssr`）。`server.moduleGraph` 混合了来自这两个环境的模块。节点通过 `clientImportedModules` 和 `ssrImportedModules` 列表连接（但每种环境只维护一个 `importers` 列表）。转换后的模块由一个 `id` 和一个 `ssr` 布尔值表示。该布尔值需要传递给 API，例如 `server.moduleGraph.getModuleByUrl(url, ssr)` 和 `server.transformRequest(url, { ssr })`。

在 Vite v6 中，现在可以创建任意数量的自定义环境（`client`, `ssr`, `edge`等）。单一的 `ssr` 布尔值已经不够用了。我们没有将 API 改为 `server.transformRequest(url, { environment })`，而是将这些方法移到了环境实例中，这样就可以在没有 Vite dev 服务器的情况下调用这些方法。

## 迁移指南 {#migration-guide}

- `server.moduleGraph` -> [`environment.moduleGraph`](/guide/api-environment-instances#separate-module-graphs)
- `server.reloadModule(module)` -> `environment.reloadModule(module)`
- `server.pluginContainer` -> `environment.pluginContainer`
- `server.transformRequest(url, ssr)` -> `environment.transformRequest(url)`
- `server.warmupRequest(url, ssr)` -> `environment.warmupRequest(url)`
- `server.hot` -> `server.client.environment.hot`
