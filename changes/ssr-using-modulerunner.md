# 使用 ModuleRunner API 进行服务端渲染 {#ssr-using-modulerunner-api}

::: tip 反馈
可以在 [环境 API 讨论](https://github.com/vitejs/vite/discussions/16358) 中向我们提供反馈
:::

`server.ssrLoadModule` 已被从 [Module Runner](/guide/api-environment#modulerunner) 导入所取代。

影响范围：`Vite 插件作者`

::: warning 即将废弃
`ModuleRunner` 最初在 `v6.0` 版本中被引入。我们计划在未来的主要版本中废弃 `server.ssrLoadModule`。如果想识别你的使用情况，可以在你的 vite 配置文件中将 `future.removeSsrLoadModule` 设置为 `"warn"`。
:::

## 动机 {#motivation}

`server.ssrLoadModule(url)` 仅允许在 `ssr` 环境中导入模块，并且只能在与 Vite 开发服务器相同的进程中执行这些模块。对于具有自定义环境的应用程序，每个环境都关联一个 `ModuleRunner`，该模块可能在单独的线程或进程中运行。为了导入模块，我们现在使用 `moduleRunner.import(url)`。

## 迁移指南 {#migration-guide}

请查看 [用于框架的环境 API 指南](../guide/api-environment-frameworks.md)。

当使用 Module Runner API 时，不再需要调用 `server.ssrFixStacktrace` 和 `server.ssrRewriteStacktrace`。除非 `sourcemapInterceptor` 被设置为 `false`，否则堆栈追踪信息将会自动更新。
