# Rolldown 集成 {#rolldown-integration}

Vite 计划将由 Rust 驱动的 JavaScript 打包工具 [Rolldown](https://rolldown.rs) 集成进来，以提升构建的性能和功能。

<YouTubeVideo videoId="RRjfm8cMveQ" />

## Rolldown 是什么？ {#what-is-rolldown}

## What is Rolldown?

Rolldown 是一个现代化、高性能的 JavaScript 打包工具，由 Rust 编写。它被设计为 Rollup 的替代品，旨在保持与现有生态系统兼容的同时，显著提升性能。

Rolldown 专注于三个主要原则：

- **速度**：利用 Rust 的高性能进行构建
- **兼容性**：能够与现有的 Rollup 插件一起工作
- **优化**：拥有比 esbuild 和 Rollup 更先进的特性

## 为什么 Vite 要迁移到 Rolldown {#why-vite-is-migrating-to-rolldown}

1. **统一**：Vite 目前使用 esbuild 进行依赖预打包，使用 Rollup 进行生产构建。Rolldown 的目标是将这两个过程统一到一个高性能的打包工具中，以降低复杂性。

2. **性能**：Rolldown 的 Rust 实现在性能上比基于 JavaScript 的打包工具有显著的提升。虽然具体的基准测试可能会因项目大小和复杂性而有所不同，但早期测试表明，与 Rollup 相比，Rolldown 的速度有望得到提高。

1. **额外特性**：Rolldown 提供了 Rollup 或 esbuild 中没有的功能，例如高级的分块控制，内置的模块热替换（HMR），以及模块联邦（Module Federation）。

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

### 验证选项错误 {#option-validation-errors}

当传入未知或无效选项时，Rolldown 会抛出错误。由于 Rolldown 不支持 Rollup 中的部分选项，根据您或所使用的元框架设置的选项，可能会遇到相关错误。下方展示了此类错误消息的示例：

> Error: Failed validate input options.
>
> - For the "preserveEntrySignatures". Invalid key: Expected never but received "preserveEntrySignatures".

如果你自己没有传递这个选项，这个问题必须由使用的框架来解决。你可以通过设置 `ROLLDOWN_OPTIONS_VALIDATION=loose` 环境变量来暂时忽略这个错误。

## 启用原生插件 {#enabling-native-plugins}

感谢 Rolldown 和 Oxc，各种内部的 Vite 插件，如别名或解析插件，已被转换为 Rust。在撰写本文时，这些插件默认并未启用，因为它们的行为可能与 JavaScript 版本不同。

要测试它们，你可以在你的 Vite 配置中将 `experimental.enableNativePlugin` 选项设置为 `true`。

## 反馈问题 {#reporting-issues}

由于这是一个实验性的集成，你可能会遇到一些问题。如果你遇到问题，请在 [`vitejs/rolldown-vite`](https://github.com/vitejs/rolldown-vite) 仓库中反馈，**而不是主 Vite 仓库**。

在 [上报问题](https://github.com/vitejs/rolldown-vite/issues/new) 时，请根据相应的问题模板进行操作，并提供模板中所需的信息，这通常包括：

- 问题的最小复现
- 你的环境详细信息（操作系统，Node 版本，包管理器）
- 任何相关的错误信息或日志

如果你想进行实时讨论和故障排除，请确保加入 [Rolldown Discord](https://chat.rolldown.rs/)。

<<<<<<< HEAD
## 未来计划 {#future-plans}
=======
## Versioning Policy

The versioning policy for `rolldown-vite` aligns its major and minor versions with those of the normal Vite package. This synchronization ensures that features present in a specific normal Vite minor release are also included in the corresponding `rolldown-vite` minor release. However, it's important to note that patch versions are not synchronized between the two projects. If you're wondering whether a specific change from normal Vite has been included in `rolldown-vite`, you can always check [`rolldown-vite`'s separate changelog](https://github.com/vitejs/rolldown-vite/blob/rolldown-vite/packages/vite/CHANGELOG.md) for confirmation.

Furthermore, please be aware that `rolldown-vite` itself is considered experimental. Due to its experimental nature, breaking changes might be introduced even within its patch versions. Additionally, please note that `rolldown-vite` only receives updates for its most recent minor version. Even for important security or bug fixes, patches are not created for older major or minor versions.

## Future Plans
>>>>>>> dced02c810c5a39bb9e5e98318ae19d57315ef39

`rolldown-vite` 包是一个临时的解决方案，用于收集反馈和稳定 Rolldown 的集成。在未来，这个功能将被合并回主 Vite 仓库。

我们鼓励你尝试 `rolldown-vite` 并通过反馈和问题报告来参与其开发工作。

未来我们将为 Vite 引入全量打包模式（Full Bundle Mode），该模式将在生产环境 _和开发模式_ 下提供打包后的文件。

### 为何引入全量打包模式？ {#why-introducing-full-bundle-mode}

Vite 以其非打包开发服务器方案著称，这正是其早期凭借速度优势迅速流行的关键原因。这种方案最初是尝试探索在不进行传统打包的情况下，开发服务器性能能达到何种极限。

但随着项目规模和复杂度的增长，两大挑战逐渐显现：

1. **开发/生产环境不一致性**：开发环境提供的非打包 JavaScript 与生产环境打包构建产物存在运行时行为差异，可能导致仅在生产环境暴露的问题，增加调试难度。

2. **开发阶段性能衰减**：非打包方案导致每个模块需单独请求，产生大量网络请求。虽然 _对生产环境无影响_，但会造成开发服务器启动和页面刷新时的显著开销。在大型应用中（需处理数百甚至数千独立请求）该问题尤为突出，若开发者使用网络代理，刷新延迟和开发体验下降将更加严重。

通过 Rolldown 的整合，我们有机会在保持 Vite 标志性性能的同时统一开发与生产体验。全量打包模式将实现：

- 大型应用仍保持快速启动
- 开发与生产环境行为一致性
- 降低页面刷新的网络开销
- 在 ESM 输出基础上维持高效 HMR

该模式初期将作为可选特性提供（类似 Rolldown 整合方案），我们计划在收集反馈并确保稳定性后将其设为默认模式。

## 插件/框架作者指南 {#plugin-framework-authors-guide}

::: tip
这部分内容主要是针对插件和框架的开发者。如果你是一般用户，你可以忽略这部分内容。
:::

### 主要变更概述 {#overview-of-major-changes}

- Rolldown 用于构建（之前使用 Rollup）
- Rolldown 用于 optimizer（之前使用 esbuild）
- Rolldown 处理 CommonJS 支持（之前使用 @rollup/plugin-commonjs）
- Oxc 用于语法降级（之前使用 esbuild）
- Lightning CSS 默认用于 CSS 压缩（之前使用 esbuild）
- Oxc minifier 默认用于 JS 压缩（之前使用 esbuild）
- Rolldown 用于打包配置（之前使用 esbuild）

### 检测 `rolldown-vite` {#detecting-rolldown-vite}

::: warning
在大多数情况下，你不需要检测你的插件是运行在 `rolldown-vite` 还是 `vite` 上，你应该在两者之间寻求一致的行为，而不是采用条件分支。
:::

如果你需要 `rolldown-vite` 有不同的行为，你有两种方法可以检测是否使用了 `rolldown-vite`：

检查 `this.meta.rolldownVersion` 的存在：

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

<br>

检查 `rolldownVersion` export 的存在：

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

如 [前文所述](#option-validation-errors)，当传入未知或无效选项时，Rolldown 会抛出错误。

可通过条件式传递选项（通过 [如上所示](#detecting-rolldown-vite) 检测是否使用 `rolldown-vite`）来修复此问题。

在此场景中，设置环境变量 `ROLLDOWN_OPTIONS_VALIDATION=loose` 亦可抑制错误。
但需注意，**最终仍需停止传递 Rolldown 不支持的选项**。

### `transformWithEsbuild` 需要单独安装 `esbuild` {#transformwithesbuild-requires-installing-esbuild-separately}

一个类似的函数，名为 `transformWithOxc`，它使用 Oxc 而非 `esbuild`，从 `rolldown-vite` 中导出。

### `esbuild` 选项的兼容层 {#compatibility-layer-for-esbuild-options}

Rolldown-Vite 有一个兼容层，用于将 `esbuild` 的选项转换为相应的 Oxc 或 `rolldown` 选项。正如 [生态系统 CI](https://github.com/vitejs/vite-ecosystem-ci/blob/rolldown-vite/README-temp.md) 中测试的那样，这在许多情况，包括简单的 `esbuild` 插件下都有效。
虽说如此，但 **我们将在未来移除对 `esbuild` 选项的支持**，并鼓励你尝试使用相应的 Oxc 或 `rolldown` 选项。
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
