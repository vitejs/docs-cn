# SSR 选项 {#ssr-options}

## ssr.external {#ssr-external}

- **类型:** `string[]`
- **相关：** [SSR 外部化](/guide/ssr#ssr-externals)

列出的是要为 SSR 强制外部化的依赖。

## ssr.noExternal {#ssr-noexternal}

- **类型：** `string | RegExp | (string | RegExp)[] | true`
- **相关：** [SSR 外部化](/guide/ssr#ssr-externals)

列出的是防止被 SSR 外部化依赖项。如果设为 `true`，将没有依赖被外部化。

## ssr.target

- **类型：** `'node' | 'webworker'`
- **默认：** `node`

SSR 服务器的构建目标。

## ssr.format

<<<<<<< HEAD
- **实验性**
- **类型：** `'esm' | 'cjs'`
- **默认：** `esm`
=======
- **Experimental:** [CJS support to be removed in Vite 5](https://github.com/vitejs/vite/discussions/13816)
- **Deprecated** Only ESM output will be supported in Vite 5.
- **Type:** `'esm' | 'cjs'`
- **Default:** `esm`
>>>>>>> 024ad119e53fb63ad36dc1b79401dccc80871120

SSR 服务器的构建语法格式。从 Vite v3 开始，SSR 构建默认生成 ESM 格式。设置为 `'cjs'` 可以构建为 CJS 格式，但不推荐这样做。这个选项被标记为实验性的，以便给用户更多时间更新到 ESM。CJS 构建需要复杂的外部化启发式，但在 ESM 格式中则不需要。
