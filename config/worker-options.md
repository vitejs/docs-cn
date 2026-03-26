# Worker 选项 {#worker-options}

除非另有说明，本节中的选项适用于所有开发、构建和预览。

## worker.format

- **类型：** `'es' | 'iife'`
- **默认：** `'iife'`

worker 打包时的输出类型。

## worker.plugins

- **类型：** [`() => (Plugin | Plugin[])[]`](./shared-options#plugins)

<<<<<<< HEAD
应用于 worker 打包的 Vite 插件。注意 [config.plugins](./shared-options#plugins) 仅会在开发（dev）阶段应用于 worker，若要配置在构建（build）阶段应用于 worker 的插件则应该在本选项这里配置。
该函数应返回新的插件实例，因为它们在并行的 rolldown worker 构建中使用。因此，在 `config` 钩子中修改 `config.worker` 选项将被忽略。
=======
Vite plugins that apply to the worker bundles. Note that [config.plugins](./shared-options#plugins) only applies to workers in dev, it should be configured here instead for build.
The function should return new plugin instances as they are used in parallel rolldown worker builds. As such, modifying `config.worker` options in the `config` hook will be ignored.
>>>>>>> 9fa3be92938ceef543cd488d6659c387db8ca6b4

## worker.rolldownOptions

- **类型：** [`RolldownOptions`](https://rolldown.rs/reference/)

<<<<<<< HEAD
用于打包 worker 的 Rolldown 配置项。
=======
Rolldown options to build worker bundle.
>>>>>>> 9fa3be92938ceef543cd488d6659c387db8ca6b4

## worker.rollupOptions

- **类型：** `RolldownOptions`
- **已弃用**

此选项是 `worker.rolldownOptions` 选项的别名。请使用 `worker.rolldownOptions` 选项代替。
