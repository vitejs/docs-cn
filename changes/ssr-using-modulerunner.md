# 使用 ModuleRunner API 进行服务端渲染 {#ssr-using-modulerunner-api}

::: tip 反馈
可以在 [环境 API 讨论](https://github.com/vitejs/vite/discussions/16358) 中向我们提供反馈
:::

<<<<<<< HEAD
`server.ssrLoadModule` 已经被 [Module Runner](/guide/api-environment#modulerunner) 取代。
=======
`server.ssrLoadModule` has been replaced by importing from a [Module Runner](/guide/api-environment#modulerunner).
>>>>>>> db0517b83d2535549c9c929b32afa3ae005d20ed

影响范围：`Vite 插件作者`

<<<<<<< HEAD
::: warning 即将废弃
`ModuleRunner` 最初在 `v6.0` 版本中被引入。我们计划在未来的主要版本中废弃 `server.ssrLoadModule`。如果想识别你的使用情况，可以在你的 vite 配置文件中将 `future.removeSrLoadModule` 设置为 `"warn"`。
=======
::: warning Future Deprecation
`ModuleRunner` was first introduce in `v6.0`. The deprecation of `server.ssrLoadModule` is planned for a future major. To identify your usage, set `future.removeSsrLoadModule` to `"warn"` in your vite config.
>>>>>>> db0517b83d2535549c9c929b32afa3ae005d20ed
:::

## 动机 {#motivation}

<<<<<<< HEAD
// TODO: （保持原文）
=======
The `server.ssrLoadModule(url)` only allows importing modules in the `ssr` environment and can only execute the modules in the same process as the Vite dev server. For apps with custom environments, each is associated with a `ModuleRunner` that may be running in a separate thread or process. To import modules, we now have `moduleRunner.import(url)`.
>>>>>>> db0517b83d2535549c9c929b32afa3ae005d20ed

## 迁移指南 {#migration-guide}

<<<<<<< HEAD
// TODO: （保持原文）
=======
Check out the [Environment API for Frameworks Guide](../guide/api-environment-frameworks.md).
>>>>>>> db0517b83d2535549c9c929b32afa3ae005d20ed
