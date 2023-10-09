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

<<<<<<< HEAD
SSR 服务器的构建目标。
=======
Build target for the SSR server.

## ssr.resolve.conditions

- **Type:** `string[]`
- **Related:** [Resolve Conditions](./shared-options.md#resolve-conditions)

Defaults to the the root [`resolve.conditions`](./shared-options.md#resolve-conditions).

These conditions are used in the plugin pipeline, and only affect non-externalized dependencies during the SSR build. Use `ssr.resolve.externalConditions` to affect externalized imports.

## ssr.resolve.externalConditions

- **Type:** `string[]`
- **Default:** `[]`

Conditions that are used during ssr import (including `ssrLoadModule`) of externalized dependencies.
>>>>>>> 111201f2b2de4cf5aeac38b7b2b587f45e2fa06d
