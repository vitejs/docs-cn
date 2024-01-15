# SSR 选项 {#ssr-options}

## ssr.external {#ssr-external}

<<<<<<< HEAD
- **类型:** `string[]`
- **相关：** [SSR 外部化](/guide/ssr#ssr-externals)

列出的是要为 SSR 强制外部化的依赖。
=======
- **Type:** `string[] | true`
- **Related:** [SSR Externals](/guide/ssr#ssr-externals)

Externalize the given dependencies and their transitive dependencies for SSR. By default, all dependencies are externalized except for linked dependencies (for HMR). If you prefer to externalize the linked dependency, you can pass its name to this option.

If `true`, all dependencies including linked dependencies are externalized.

Note that the explicitly listed dependencies (using `string[]` type) will always take priority if they're also listed in `ssr.noExternal` (using any type).
>>>>>>> f6e841f5aa887805a64e292645336cc7e99e618e

## ssr.noExternal {#ssr-noexternal}

- **类型：** `string | RegExp | (string | RegExp)[] | true`
- **相关：** [SSR 外部化](/guide/ssr#ssr-externals)

<<<<<<< HEAD
列出的是防止被 SSR 外部化依赖项。如果设为 `true`，将没有依赖被外部化。
=======
Prevent listed dependencies from being externalized for SSR, which they will get bundled in build. By default, only linked dependencies are not externalized (for HMR). If you prefer to externalize the linked dependency, you can pass its name to the `ssr.external` option.

If `true`, no dependencies are externalized. However, dependencies explicitly listed in `ssr.external` (using `string[]` type) can take priority and still be externalized.

Note that if both `ssr.noExternal: true` and `ssr.external: true` are configured, `ssr.noExternal` takes priority and no dependencies are externalized.
>>>>>>> f6e841f5aa887805a64e292645336cc7e99e618e

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
