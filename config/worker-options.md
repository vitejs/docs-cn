# Worker 选项 {#worker-options}

有关于 Web Worker 的选项。

## worker.format

- **类型：** `'es' | 'iife'`
- **默认：** `'iife'`

worker 打包时的输出类型。

## worker.plugins

<<<<<<< HEAD
- **类型：** [`(Plugin | Plugin[])[]`](./shared-options#plugins)

应用于 worker 打包的 Vite 插件。注意 [config.plugins](./shared-options#plugins) 仅会在开发（dev）阶段应用于 worker，若要配置在构建（build）阶段应用于 worker 的插件则应该在本选项这里配置。
=======
- **Type:** [`() => (Plugin | Plugin[])[]`](./shared-options#plugins)

Vite plugins that apply to the worker bundles. Note that [config.plugins](./shared-options#plugins) only applies to workers in dev, it should be configured here instead for build.
The function should return new plugin instances as they are used in parallel rollup worker builds. As such, modifying `config.worker` options in the `config` hook will be ignored.
>>>>>>> 09e3b8e842c138c9304185f8c11bfe96fb024b3d

## worker.rollupOptions

- **类型：** [`RollupOptions`](https://rollupjs.org/configuration-options/)

用于打包 worker 的 Rollup 配置项。
