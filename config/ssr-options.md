# SSR 选项 {#ssr-options}

<<<<<<< HEAD
- **相关：** [SSR 外部化](/guide/ssr#ssr-externals)

:::warning 实验性
SSR 选项可能会在未来版本中进行调整。
:::

## ssr.external {#ssr-external}

- **类型：** `string[]`
=======
## ssr.external

- **Type:** `string[]`
- **Related:** [SSR Externals](/guide/ssr#ssr-externals)
>>>>>>> fd8f050f1c4c992290fd835789e26ec62817d627

列出的是要为 SSR 强制外部化的依赖。

## ssr.noExternal {#ssr-noexternal}

<<<<<<< HEAD
- **类型：** `string | RegExp | (string | RegExp)[] | true`
=======
- **Type:** `string | RegExp | (string | RegExp)[] | true`
- **Related:** [SSR Externals](/guide/ssr#ssr-externals)
>>>>>>> fd8f050f1c4c992290fd835789e26ec62817d627

列出的是防止被 SSR 外部化依赖项。如果设为 `true`，将没有依赖被外部化。

## ssr.target

- **类型：** `'node' | 'webworker'`
- **默认：** `node`

SSR 服务器的构建目标。

## ssr.format

<<<<<<< HEAD
- **类型：** `'esm' | 'cjs'`
- **默认：** `esm`
- **实验性**
=======
- **Experimental**
- **Type:** `'esm' | 'cjs'`
- **Default:** `esm`
>>>>>>> fd8f050f1c4c992290fd835789e26ec62817d627

SSR 服务器的构建语法格式。从 Vite v3 开始，SSR 构建默认生成 ESM 格式。设置为 `'cjs'` 可以构建为 CJS 格式，但不推荐这样做。这个选项被标记为实验性的，以便给用户更多时间更新到 ESM。CJS 构建需要复杂的外部化启发式，但在ESM 格式中则不需要。
