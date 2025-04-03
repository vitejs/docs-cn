# Rolldown 集成 {#rolldown-integration}

Vite 计划将由 Rust 驱动的 JavaScript 打包工具 [Rolldown](https://rolldown.rs) 集成进来，以提升构建的性能和功能。

## Rolldown 是什么？ {#what-is-rolldown}

Rolldown 是一个现代化、高性能的 JavaScript 打包工具，由 Rust 编写。它被设计为 Rollup 的替代品，旨在保持与现有生态系统兼容的同时，显著提升性能。

Rolldown 专注于三个主要原则：

- **速度**：利用 Rust 的高性能进行构建
- **兼容性**：能够与现有的 Rollup 插件一起工作
- **开发者体验**：为 Rollup 用户提供熟悉的 API

## 为什么 Vite 要迁移到 Rolldown {#why-vite-is-migrating-to-rolldown}

1. **统一**：Vite 目前使用 esbuild 进行依赖预打包，使用 Rollup 进行生产构建。Rolldown 的目标是将这两个过程统一到一个高性能的打包工具中，以降低复杂性。

2. **性能**：Rolldown 的 Rust 实现在性能上比基于 JavaScript 的打包工具有显著的提升。虽然具体的基准测试可能会因项目大小和复杂性而有所不同，但早期的测试显示，与 Rollup 相比，Rolldown 的速度提升是有希望的。

关于 Rolldown 的动机有更多的见解，可以参见 [为什么要构建 Rolldown 的原因](https://rolldown.rs/guide/#why-rolldown)。

## 尝试 `rolldown-vite` 的好处 {#benefits-of-trying-rolldown-vite}

- 对于大型项目，可以显著提升构建速度
- 提供有价值的反馈，帮助塑造 Vite 的打包体验的未来
- 为最终的官方 Rolldown 集成做好准备

## 如何尝试 Rolldown {#how-to-try-rolldown}

目前，由 Rolldown 驱动的 Vite 版本已经作为一个名为 `rolldown-vite` 的独立包发布。你可以通过在你的 `package.json` 中添加 package overrides 来试用它：

:::code-group

```json [npm]
{
  "overrides": {
    "vite": "npm:rolldown-vite@latest"
  }
}
```

```json [Yarn]
{
  "resolutions": {
    "vite": "npm:rolldown-vite@latest"
  }
}
```

```json [pnpm]
{
  "pnpm": {
    "overrides": {
      "vite": "npm:rolldown-vite@latest"
    }
  }
}
```

```json [Bun]
{
  "overrides": {
    "vite": "npm:rolldown-vite@latest"
  }
}
```

:::

在添加 overrides 之后，重新安装你的依赖并像往常一样启动你的开发服务器或构建你的项目即可，无需进一步的配置更改。

## 已知限制 {#known-limitations}

虽然 Rolldown 的目标是成为 Rollup 的替代品，但还有一些特性正在实现中，以及一些小的有意的行为差异。需要查看完整的列表，请参考 [这个 GitHub PR](https://github.com/vitejs/rolldown-vite/pull/84#issue-2903144667)，它会定期更新。

## 反馈问题 {#reporting-issues}

由于这是一个实验性的集成，你可能会遇到一些问题。如果你遇到问题，请在 [`vitejs/rolldown-vite`](https://github.com/vitejs/rolldown-vite) 仓库中反馈，**而不是主 Vite 仓库**。

在 [上报问题](https://github.com/vitejs/rolldown-vite/issues/new) 时，请按照问题模板提供：

- 问题的最小复现
- 你的环境详细信息（操作系统，Node 版本，包管理器）
- 任何相关的错误信息或日志

如果你想进行实时讨论和故障排除，请确保加入 [Rolldown Discord](https://chat.rolldown.rs/)。

## 未来计划 {#future-plans}

`rolldown-vite` 包是一个临时的解决方案，用于收集反馈和稳定 Rolldown 的集成。在未来，这个功能将被合并回主 Vite 仓库。

<<<<<<< HEAD
我们鼓励你尝试 `rolldown-vite` 并通过反馈和问题报告来参与其开发工作。
=======
We encourage you to try out `rolldown-vite` and contribute to its development through feedback and issue reports.

## Plugin / Framework authors guide

### The list of big changes

- Rolldown is used for build (Rollup was used before)
- Rolldown is used for the optimizer (esbuild was used before)
- CommonJS support is handled by Rolldown (@rollup/plugin-commonjs was used before)
- Oxc is used for syntax lowering (esbuild was used before)
- Lightning CSS is used for CSS minification by default (esbuild was used before)
- Oxc minifier is used for JS minification by default (esbuild was used before)
- Rolldown is used for bundling the config (esbuild was used before)

### Detecting rolldown-vite

You can detect by either

- checking the `this.meta.rolldownVersion` existence

```js
const plugin = {
  resolveId() {
    if (this.meta.rolldownVersion) {
      // logic for rolldown-vite
    } else {
      // logic for rollup-vite
    }
  },
}
```

- checking the `rolldownVersion` export existence

```js
import * as vite from 'vite'

if (vite.rolldownVersion) {
  // logic for rolldown-vite
} else {
  // logic for rollup-vite
}
```

If you have `vite` as a dependency (not a peer dependency), the `rolldownVersion` export is useful as it can be used from anywhere in your code.

### Ignoring option validation in Rolldown

Rolldown throws an error when unknown or invalid options are passed. Because some options available in Rollup are not supported by Rolldown, you may encounter errors. Below, you can find an an example of such an error message:

> Error: Failed validate input options.
>
> - For the "preserveEntrySignatures". Invalid key: Expected never but received "preserveEntrySignatures".

This can be fixed by conditionally passing the option by checking whether it's running with `rolldown-vite` as shown above.

If you would like to suppress this error for now, you can set the `ROLLDOWN_OPTIONS_VALIDATION=loose` environment variable. However, keep in mind that you will eventually need to stop passing the options not supported by Rolldown.

### `transformWithEsbuild` requires `esbuild` to be installed separately

A similar function called `transformWithOxc`, which uses Oxc instead of `esbuild`, is exported from `rolldown-vite`.

### Compatibility layer for `esbuild` options

Rolldown-Vite has a compatibility layer to convert options for `esbuild` to the respective Oxc or `rolldown` ones. As tested in [the ecosystem-ci](https://github.com/vitejs/vite-ecosystem-ci/blob/rolldown-vite/README-temp.md), this works in many cases, including simple `esbuild` plugins.
That said, **we'll be removing the `esbuild` options support in the future** and encourage you to try the corresponding Oxc or `rolldown` options.
You can get the options set by the compatibility layer from the `configResolved` hook.

```js
const plugin = {
  name: 'log-config',
  configResolved(config) {
    console.log('options', config.optimizeDeps, config.oxc)
  },
},
```

### Hook filter feature

Rolldown introduced a [hook filter feature](https://rolldown.rs/guide/plugin-development#plugin-hook-filters) to reduce the communication overhead the between Rust and JavaScript runtimes. By using this feature you can make your plugin more performant.
This is also supported by Rollup 4.38.0+ and Vite 6.3.0+. To make your plugin backward compatible with the older versions, make sure to also run the filter inside the hook handlers.

### Converting content to JavaScript in `load` or `transform` hooks

If you are converting the content to JavaScript from other types in `load` or `transform` hooks, you may need to add `moduleType: 'js'` to the returned value.

```js
const plugin = {
  name: 'txt-loader',
  load(id) {
    if (id.endsWith('.txt')) {
      const content = fs.readFile(id, 'utf-8')
      return {
        code: `export default ${JSON.stringify(content)}`,
        moduleType: 'js', // [!code ++]
      }
    }
  },
}
```

This is because [Rolldown supports non-JavaScript modules](https://rolldown.rs/guide/in-depth/module-types) and infers the module type from extensions unless specified. Note that `rolldown-vite` does not support ModuleTypes in dev.
>>>>>>> c75c0f5c737e1a4870b2b35930a27ab2dec4dab7
