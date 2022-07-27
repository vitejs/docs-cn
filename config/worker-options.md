# Worker 选项 {#worker-options}

## worker.format

- **类型：** `'es' | 'iife'`
- **默认：** `iife`

worker 打包时的输出类型。

## worker.plugins

- **类型：** [`(Plugin | Plugin[])[]`](./shared-options#plugins)

应用于 worker 打包的 Vite 插件。注意 [config.plugins](./shared-options#plugins) 不会应用于 worker，而是应该在这里配置所用到的插件。

## worker.rollupOptions

- **类型：** [`RollupOptions`](https://rollupjs.org/guide/en/#big-list-of-options)

用于打包 worker 的 Rollup 配置项。
