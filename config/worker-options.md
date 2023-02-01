# Worker 选项 {#worker-options}

有关于 Web Worker 的选项。

## worker.format

- **类型：** `'es' | 'iife'`
- **默认：** `iife`

worker 打包时的输出类型。

## worker.plugins

- **类型：** [`(Plugin | Plugin[])[]`](./shared-options#plugins)

<<<<<<< HEAD
应用于 worker 打包的 Vite 插件。注意 [config.plugins](./shared-options#plugins) 不会应用于 worker，而是应该在这里配置所用到的插件。
=======
Vite plugins that apply to worker bundle. Note that [config.plugins](./shared-options#plugins) only applies to workers in dev, it should be configured here instead for build.
>>>>>>> d550a23a31b393f9fad0d2a4053adc1c65d4cc51

## worker.rollupOptions

- **类型：** [`RollupOptions`](https://rollupjs.org/configuration-options/)

用于打包 worker 的 Rollup 配置项。
