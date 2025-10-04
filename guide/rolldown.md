# Rolldown 集成 {#rolldown-integration}

Vite 计划将由 Rust 驱动的 JavaScript 打包工具 [Rolldown](https://rolldown.rs) 集成进来，以提升构建的性能和功能。

<YouTubeVideo videoId="RRjfm8cMveQ" />

## Rolldown 是什么？ {#what-is-rolldown}

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

基于 Rolldown 驱动的 Vite 目前以名为 `rolldown-vite` 的独立包提供。如果你的项目中直接依赖了 `vite`，可以在项目的 `package.json`文件里将 `vite` 包设置别名指向 `rolldown-vite`，这样就能实现无缝替换。

```json
{
  "dependencies": {
    "vite": "^7.0.0" // [!code --]
    "vite": "npm:rolldown-vite@latest" // [!code ++]
  }
}
```

::: tip 请固定版本!

虽然这些示例使用了 `@latest`，但我们建议使用特定的版本号，以避免意外的重大更改，因为 [`rolldown-vite` 被认为是实验性的](#versioning-policy)。

:::

如果你使用了 Vitepress 或其他以 Vite 作为同等依赖（peer dependency）的元框架，你需要在 `package.json` 文件中覆盖 `vite` 依赖，具体操作方式会因你使用的包管理器而略有不同。

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

如果你正在启动一个新项目，你也可以像平常一样使用 `create-vite` 来创建 rolldown-vite 项目。最新版本会询问你是否要使用 `rolldown-vite`。

## 已知限制 {#known-limitations}

虽然 Rolldown 的目标是成为 Rollup 的替代品，但还有一些特性正在实现中，以及一些小的有意的行为差异。需要查看完整的列表，请参考 [这个 GitHub PR](https://github.com/vitejs/rolldown-vite/pull/84#issue-2903144667)，它会定期更新。

### 验证选项警告 {#option-validation-warnings}

当传入未知或无效选项时，Rolldown 会输出警告。由于 Rolldown 不支持 Rollup 中的部分选项，根据您或所使用的元框架设置的选项，可能会遇到相关警告。下方展示了此类警告消息的示例：

> Warning validate output options.
>
> - For the "generatedCode". Invalid key: Expected never but received "generatedCode".

如果你自己没有传递这个选项，这个问题必须由使用的框架来解决。

### API 差异 {#api-differences}

#### `manualChunks` 改为 `advancedChunks` {#manualchunks-changed-to-advancedchunks}

虽然 Rolldown 支持与 Rollup 相同的 `manualChunks` 选项，但该选项已被标记为过时。作为替代，Rolldown 通过 [`advancedChunks` 选项](https://rolldown.rs/guide/in-depth/advanced-chunks#advanced-chunks) 提供更精细的设置，该选项与 webpack 的 `splitChunk` 功能更为相似：

```js
// 旧配置 (Rollup)
export default {
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (/\/react(?:-dom)?/.test(id)) {
            return 'vendor'
          }
        }
      }
    }
  }
}

// 新配置 (Rolldown)
export default {
  build: {
    rollupOptions: {
      output: {
        advancedChunks: {
          groups: [{ name: 'vendor', test: /\/react(?:-dom)?/ }]
        }
      }
    }
  }
}
```

## 性能 {#performance}

`rolldown-vite` 主要致力于确保与现有生态系统的兼容性，因此其默认配置旨在实现平滑过渡。如果你切换到更快的基于 Rust 的内部插件或进行其他自定义配置，还可以获得进一步的性能提升。

## 启用原生插件 {#enabling-native-plugins}

得益于 Rolldown 和 Oxc 的支持，各种 Vite 内部插件（例如 alias 或 resolve 插件）已转换为 Rust 语言。原生插件现在默认启用，默认值设置为 `'v1'`。

如果您遇到任何问题，可以将 Vite 配置中的 `experimental.enableNativePlugin` 选项更改为 `'resolver'` 或 `false` 以解决问题。请注意，此选项将来会被移除。

### 利用 Oxc 的 React 刷新转换 {#utilizing-oxc-s-react-refresh-transform}

`@vitejs/plugin-react` v5.0.0+ 版本使用 Oxc 的 React 刷新转换功能。如果你没有使用任何 Babel 插件（包括 React 编译器），现在整个转换过程将由 Oxc 完成，除了更新 `@vitejs/plugin-react` 外无需任何其他更改，就能提升构建性能。

如果你在使用 `@vitejs/plugin-react-swc` 时没有使用 SWC 插件和自定义 SWC 选项，你可以切换到 `@vitejs/plugin-react` 插件来利用 Oxc。

::: details `@vitejs/plugin-react-oxc` 插件已被弃用

此前，我们建议使用 `@vitejs/plugin-react-oxc` 来利用 Oxc 的 React 刷新转换功能。但是，我们已经将该实现合并到了 `@vitejs/plugin-react` 中，这样可以更轻松地切换到 `rolldown-vite`。`@vitejs/plugin-react-oxc` 现在已被弃用，将不再更新。

:::

### `withFilter` 包装器 {#withfilter-wrapper}

插件作者可以选择使用 [钩子过滤功能](#hook-filter-feature)，以减少 Rust 和 JavaScript 运行时之间的通信开销。
但如果你使用的某些插件还未采用该功能，而你又希望受益于它，可以使用 `withFilter` 包装器自行为插件添加过滤条件。

```js
// 在你的 vite.config.ts 中
import { withFilter, defineConfig } from 'vite'
import svgr from 'vite-plugin-svgr'

export default defineConfig({
  plugins: [
    // 仅对以 `.svg?react` 结尾的文件加载 `svgr` 插件
    withFilter(
      svgr({
        /*...*/
      }),
      { load: { id: /\.svg\?react$/ } },
    ),
  ],
})
```

## 反馈问题 {#reporting-issues}

由于这是一个实验性的集成，你可能会遇到一些问题。如果你遇到问题，请在 [`vitejs/rolldown-vite`](https://github.com/vitejs/rolldown-vite) 仓库中反馈，**而不是主 Vite 仓库**。

在 [上报问题](https://github.com/vitejs/rolldown-vite/issues/new) 时，请根据相应的问题模板进行操作，并提供模板中所需的信息，这通常包括：

- 问题的最小复现
- 你的环境详细信息（操作系统，Node 版本，包管理器）
- 任何相关的错误信息或日志

如果你想进行实时讨论和故障排除，请确保加入 [Rolldown Discord](https://chat.rolldown.rs/)。

## 版本管理策略 {#versioning-policy}

`rolldown-vite` 的版本管理策略与普通 Vite 包保持主版本号和次版本号的一致。这种同步确保了在某个特定的 Vite 次版本发布中包含的功能，也会出现在对应的 `rolldown-vite` 次版本发布中。但需要注意的是，补丁版本在两个项目之间并不同步。如果你想确认普通 Vite 包的某个具体变更是否已经包含在 `rolldown-vite` 中，可以随时查阅 [`rolldown-vite` 独立的更新日志](https://github.com/vitejs/rolldown-vite/blob/rolldown-vite/packages/vite/CHANGELOG.md) 以确认。

此外，请注意，`rolldown-vite` 本身仍处于实验阶段。由于其实验性质，即使在补丁版本中也可能引入破坏性变更。另外，`rolldown-vite` 仅对其最新的次版本进行更新。即使是重要的安全问题或 bug 修复，也不会为较早的主版本或次版本发布补丁。

## 未来计划 {#future-plans}

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

## 插件 / 框架作者指南 {#plugin-framework-authors-guide}

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

::: tip

自 Vite 7.0.0 起，`this.meta` 在所有钩子中都可用。在此版本之前，`this.meta` 在 Vite 特有的钩子（如 `config` 钩子）中不可用。

:::

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

如 [前文所述](#option-validation-errors)，当传入未知或无效选项时，Rolldown 会输出警告。

可通过条件式传递选项（通过 [如上所示](#detecting-rolldown-vite) 检测是否使用 `rolldown-vite`）来修复此问题。

### `transformWithEsbuild` 需要单独安装 `esbuild` {#transformwithesbuild-requires-installing-esbuild-separately}

由于 Vite 本身已不再使用 `esbuild`，`esbuild` 现在被作为可选的 peer dependency。如果你的插件使用了 `transformWithEsbuild`，则需要将 `esbuild` 添加到插件的依赖中，或者由用户手动安装。

推荐的迁移方式是使用新导出的 `transformWithOxc` 函数，它采用 Oxc 而不是 `esbuild` 来完成相应任务。

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

Rolldown 引入了[钩子过滤功能](https://rolldown.rs/plugins/hook-filters)，以减少 Rust 和 JavaScript 运行时之间的通信开销。此功能允许插件指定确定何时调用钩子的模式，从而通过避免不必要的钩子调用来提高性能。

请参阅 [Hook Filters 指南](/guide/api-plugin#hook-filters) 了解更多信息。

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

这是因为 [Rolldown 支持非 JavaScript 模块](https://rolldown.rs/guide/in-depth/module-types) 并且除非指定，否则从扩展名推断模块类型。
