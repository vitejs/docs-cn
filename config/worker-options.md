# Worker 选项 {#worker-options}

<<<<<<< HEAD
有关于 Web Worker 的选项。
=======
Unless noted, the options in this section are applied to all dev, build, and preview.
>>>>>>> 84ff10107ef932a2a3581a2502eb46d92f81b9e5

## worker.format

- **类型：** `'es' | 'iife'`
- **默认：** `'iife'`

worker 打包时的输出类型。

## worker.plugins

- **类型：** [`() => (Plugin | Plugin[])[]`](./shared-options#plugins)

应用于 worker 打包的 Vite 插件。注意 [config.plugins](./shared-options#plugins) 仅会在开发（dev）阶段应用于 worker，若要配置在构建（build）阶段应用于 worker 的插件则应该在本选项这里配置。
该函数应返回新的插件实例，因为它们在并行的 rollup worker 构建中使用。因此，在 `config` 钩子中修改 `config.worker` 选项将被忽略。

## worker.rollupOptions

- **类型：** [`RollupOptions`](https://rollupjs.org/configuration-options/)

用于打包 worker 的 Rollup 配置项。
