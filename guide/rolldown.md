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

2. **性能**：Rolldown 的 Rust 实现在性能上比基于 JavaScript 的打包工具有显著的提升。虽然具体的基准测试可能会因项目大小和复杂性而有所不同，但早期测试表明，与 Rollup 相比，Rolldown 的速度有望得到提高。

欲深入了解 Rolldown 的设计动机，请参阅[构建 Rolldown 的原因](https://rolldown.rs/guide/#why-rolldown)。

## 尝试 `rolldown-vite` 的好处 {#benefits-of-trying-rolldown-vite}

- 对于大型项目，可以显著提升构建速度
- 提供有价值的反馈，参与塑造 Vite 的未来打包体验
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

我们鼓励你尝试 `rolldown-vite` 并通过反馈和问题报告来参与其开发工作。

## 插件/框架作者指南 {#plugin-framework-authors-guide}

### 主要变化列表 {#list-of-major-changes}

- Rolldown 用于构建（之前使用 Rollup）
- Rolldown 用于 optimizer（之前使用 esbuild）
- Rolldown 处理 CommonJS 支持（之前使用 @rollup/plugin-commonjs）
- Oxc 用于语法降级（之前使用 esbuild）
- Lightning CSS 默认用于 CSS 压缩（之前使用 esbuild）
- Oxc minifier 默认用于 JS 压缩（之前使用 esbuild）
- Rolldown 用于打包配置（之前使用 esbuild）

### 检测 rolldown-vite {#detecting-rolldown-vite}

你可以通过以下方式检测：

- 检查 `this.meta.rolldownVersion` 的存在

```js
const plugin = {
  resolveId() {
    if (this.meta.rolldownVersion) {
      // rolldown-vite 的逻辑
    } else {
      // rollup-vite 的逻辑
    }
  },
}
```

- 检查 `rolldownVersion` export 的存在

```js
import * as vite from 'vite'

if (vite.rolldownVersion) {
  // rolldown-vite 的逻辑
} else {
  // rollup-vite 的逻辑
}
```

如果你将 `vite` 作为依赖项（dependency），而不是同等依赖（peer dependency），那么 `rolldownVersion` export 非常有用，因为它可以在你代码的任何地方使用。

### 在 Rolldown 中忽略选项验证 {#ignoring-option-validation-in-rolldown}

Rolldown 在传递未知或无效选项时会抛出错误。由于 Rollup 中的某些选项在 Rolldown 中不受支持，你可能会遇到错误。以下是此类错误消息的示例：

> Error: Failed validate input options.
>
> - For the "preserveEntrySignatures". Invalid key: Expected never but received "preserveEntrySignatures".

这可以通过有条件地传递选项来修复，方法是检查是否正在使用上面所示的 `rolldown-vite` 运行。

如果你想暂时抑制此错误，可以设置 `ROLLDOWN_OPTIONS_VALIDATION=loose` 环境变量。但请记住，你最终需要停止传递 Rolldown 不支持的选项。

### `transformWithEsbuild` 需要单独安装 `esbuild` {#transformwithesbuild-requires-installing-esbuild-separately}

一个类似的函数，名为 `transformWithOxc`，它使用 Oxc 而非 `esbuild`，从 `rolldown-vite` 中导出。

### `esbuild` 选项的兼容层 {#compatibility-layer-for-esbuild-options}

Rolldown-Vite 有一个兼容层，用于将 `esbuild` 的选项转换为相应的 Oxc 或 `rolldown` 选项。正如 [生态系统 CI](https://github.com/vitejs/vite-ecosystem-ci/blob/rolldown-vite/README-temp.md) 中测试的那样，这在许多情况，包括简单的 `esbuild` 插件下都有效。
虽说如此，但**我们将在未来移除对 `esbuild` 选项的支持**，并鼓励你尝试使用相应的 Oxc 或 `rolldown` 选项。
你可以从 `configResolved` 钩子获取由兼容层设置的选项。

```js
const plugin = {
  name: 'log-config',
  configResolved(config) {
    console.log('options', config.optimizeDeps, config.oxc)
  },
},
```

### 钩子过滤功能 {#hook-filter-feature}

Rolldown 引入了[钩子过滤功能](https://rolldown.rs/guide/plugin-development#plugin-hook-filters)，以减少 Rust 和 JavaScript 运行时之间的通信开销。通过使用此功能，你可以使你的插件性能更高。
这也在 Rollup 4.38.0+ 和 Vite 6.3.0+ 被支持。为了使你的插件向后兼容较旧的版本，请确保也在钩子处理程序内运行过滤器。

### 在 `load` 或 `transform` 钩子中将内容转换为 JavaScript {#converting-content-to-javascript-in-load-or-transform-hooks}

如果你在 `load` 或 `transform` 钩子中将内容转换为 JavaScript，你可能需要添加 `moduleType: 'js'` 到返回值中。

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

这是因为 [Rolldown 支持非 JavaScript 模块](https://rolldown.rs/guide/in-depth/module-types) 并且除非指定，否则从扩展名推断模块类型。注意 `rolldown-vite` 不支持开发中的 ModuleTypes。
