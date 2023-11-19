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

## ssr.resolve.conditions {#ssr-resolve-conditions}

- **类型：** `string[]`
- **相关：** [解析情景](./shared-options.md#resolve-conditions)

在 SSR 构建中，包入口的解析条件。默认为 [`resolve.conditions`](./shared-options.md#resolve-conditions)。

这些条件会在插件管道中使用，并且只会影响 SSR 构建期间的非外部化依赖项。使用 `ssr.resolve.externalConditions` 来影响外部化导入。

## ssr.resolve.externalConditions {#ssr-resolve-externalconditions}

- **类型：** `string[]`
- **默认：** `[]`

在 SSR 导入（包括 `ssrLoadModule`）外部化依赖项时使用的条件。
