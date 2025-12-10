---
title: 'Vite 8 Beta: The Rolldown-powered Vite'
author:
  name: The Vite Team
date: 2025-12-03
sidebar: false
head:
  - - meta
    - property: og:type
      content: website
  - - meta
    - property: og:title
      content: Announcing Vite 8 Beta
  - - meta
    - property: og:image
      content: https://vite.dev/og-image-announcing-vite8-beta.webp
  - - meta
    - property: og:url
      content: https://vite.dev/blog/announcing-vite8-beta
  - - meta
    - property: og:description
      content: Vite 8 Beta Release Announcement
  - - meta
    - name: twitter:card
      content: summary_large_image
---

# Vite 8 Beta：由 Rolldown 驱动的 Vite {#vite-8-beta}

_2025年12月3日_

![Vite 8 Beta Announcement Cover Image](/og-image-announcing-vite8-beta.webp)

摘要：由 [Rolldown](https://rolldown.rs/) 驱动的 Vite 8 首个 beta 版本现已发布。Vite 8 显著提升了生产环境构建速度，并为未来的改进奠定了基础。你可以将 `vite` 升级到 `8.0.0-beta.0` 版本并阅读[迁移指南](/guide/migration)来体验新版本。

---

我们很高兴发布 Vite 8 的首个 beta 版本。此版本统一了底层工具链，带来了更一致性的行为，并显著提升了构建性能。Vite 现在使用 [Rolldown](https://rolldown.rs/) 作为其打包工具，取代了之前 esbuild 和 Rollup 的组合。

## 一款全新的 Web 打包工具 {#a-new-bundler-for-the-web}

Vite 之前依赖两个打包工具来满足开发和生产构建的不同需求：

1. 开发期间使用 esbuild 进行快速编译
2. 生产构建使用 Rollup 进行打包、分块和优化

这种方法让 Vite 能够专注于开发者体验和协调，而无需重新发明解析和打包功能。然而，维护两个独立的打包流水线引入了不一致性：独立的转换流水线、不同的插件系统，以及为了保持开发和生产环境打包行为的一致性而编写的大量粘合代码。

为了解决这个问题，[VoidZero 团队](https://voidzero.dev) 开发了 **Rolldown**，这是一款面向 Vite 的新一代打包工具。它的设计特点包括：

- **性能**：Rolldown 使用 Rust 编写，运行速度与原生应用相当。它的性能水平与 esbuild 相匹配，并且比 Rollup [快 10-30 倍](https://github.com/rolldown/benchmarks)。
- **兼容性**：Rolldown 支持与 Rollup 和 Vite 相同的插件 API。大多数 Vite 插件在 Vite 8 中可以开箱即用。
- **更多功能**：Rolldown 为 Vite 解锁了更多高级功能，包括完整打包模式、更灵活的分块控制、模块级持久缓存、模块联邦等。

## 统一工具链 {#unifying-the-toolchain}

Vite 的打包工具替换带来的影响远不止性能提升。打包工具利用语法解析器（parsers）、依赖解析器（resolvers）、转换器（transformers）和压缩器（minifiers）。Rolldown 为此目的使用了由 VoidZero 团队主导的另一个项目 Oxc。

**这使得 Vite 成为由同一团队维护的端到端工具链的入口：构建工具（Vite）、打包工具（Rolldown）和编译器（Oxc）。**

这种一致性确保了整个技术栈的行为一致性，并使我们能够随着 JavaScript 的不断发展快速采用并适应新的语言规范。它还带来了一系列以前仅靠 Vite 无法实现的改进。例如，我们可以利用 Oxc 的语义分析来改进 Rolldown 中的 tree-shaking 操作。

## Vite 如何迁移到 Rolldown {#how-vite-migrated-to-rolldown}

迁移到由 Rolldown 驱动的 Vite 是一项根本性的变革。因此，我们的团队采取了周密的措施来实现这一目标，同时确保稳定性和生态系统兼容性。

首先，我们发布了独立的 `rolldown-vite` 包作为[技术预览版](https://voidzero.dev/posts/announcing-rolldown-vite)。这让我们能够在不影响 Vite 稳定版本的情况下与早期用户进行合作。早期用户不仅受益于 Rolldown 带来的性能提升，还提供了宝贵的反馈意见。亮点包括：

- Linear 的生产构建时间从 46 秒减少到 6 秒
- Ramp 将它们的建造时间缩短了 57%
- Mercedes-Benz.io 将构建时间减少了高达 38%
- Beehiiv 将构建时间减少了 64%

接下来，我们搭建了一套测试套件，用于验证关键的 Vite 插件与 `rolldown-vite` 的兼容性。这项 CI 任务帮助我们及早发现回归问题和兼容性问题，特别是对于 SvelteKit、react-router 和 Storybook 等框架和元框架。

最后，我们构建了一个兼容层，以帮助开发者从 Rollup 和 esbuild 选项迁移到相应的 Rolldown 选项。

因此，每个人都能顺利迁移到 Vite 8。

## 迁移到 Vite 8 Beta {#migrating-to-vite-8-beta}

由于 Vite 8 涉及核心构建行为，我们着重保持配置 API 和插件钩子不变。我们创建了[迁移指南](/guide/migration)来帮助你进行升级。

有两种可用的升级路径：

1. **直接升级**：更新 `package.json` 并运行常规的开发和构建命令。
2. **渐进式迁移**：先从 Vite 7 迁移到 `rolldown-vite` 包，然后再到 Vite 8。这样你可以识别出与 Rolldown 相关的不兼容性或问题，而无需对 Vite 进行其他更改。（推荐用于较大或复杂的项目）

> [!重要的]
> 如果你依赖特定的 Rollup 或 esbuild 选项，你可能需要对 Vite 配置进行一些调整。请参考[迁移指南](/guide/migration)获取详细的说明和示例。
> 与所有非稳定的主版本一样，升级后建议进行全面测试以确保一切运行正常。如有任何[问题](https://github.com/vitejs/rolldown-vite/issues)，请务必报告。

如果你使用的框架或工具依赖于 Vite，例如 Astro、Nuxt 或 Vitest，你必须在 `package.json` 中覆盖 `vite` 依赖项，具体操作方式因包管理器而异：

:::code-group

```json [npm]
{
  "overrides": {
    "vite": "8.0.0-beta.0"
  }
}
```

```json [Yarn]
{
  "resolutions": {
    "vite": "8.0.0-beta.0"
  }
}
```

```json [pnpm]
{
  "pnpm": {
    "overrides": {
      "vite": "8.0.0-beta.0"
    }
  }
}
```

```json [Bun]
{
  "overrides": {
    "vite": "8.0.0-beta.0"
  }
}
```

:::

添加这些覆盖设置后，重新安装依赖项，然后像往常一样启动开发服务器或构建你的项目。

## Vite 8 的附加功能 {#additional-features-in-vite-8}

除了搭载 Rolldown 之外，Vite 8 还带来了以下功能：

- **内置 tsconfig `paths` 支持**：开发者可以通过将 [`resolve.tsconfigPaths`](/config/shared-options.md#resolve-tsconfigpaths) 设置为 `true` 来启用此功能。此功能会略微影响性能，因此默认情况下未启用。
- **`emitDecoratorMetadata` 支持**：Vite 8 现在内置了对 TypeScript [`emitDecoratorMetadata` 选项](https://www.typescriptlang.org/tsconfig/#emitDecoratorMetadata)的自动支持。更多详情请参见[功能](/guide/features.md#emitdecoratormetadata)页面。

## 展望未来 {#looking-ahead}

速度一直是 Vite 的一大特色。与 Rolldown 以及 Oxc 的集成意味着 JavaScript 开发者可以充分利用 Rust 的速度优势。升级到 Vite 8 后，仅使用 Rust 本身就能带来性能提升。

我们也即将推出 Vite 的完整打包模式，该模式将大幅提升 Vite 开发服务器在大型项目中的速度。初步测试结果显示，开发服务器启动速度提升 3 倍，完全重新加载速度提升 40%，网络请求次数减少 10 倍。

Vite 的另一大特色是其插件生态系统。我们希望 JavaScript 开发者能够继续使用他们熟悉的 JavaScript 语言来扩展和定制 Vite，同时又能受益于 Rust 的性能优势。我们的团队正在与 VoidZero 团队合作，以加速这些基于 Rust 系统中 JavaScript 插件的使用。

即将推出的优化功能目前处于实验阶段：

- [**原始 AST 传输**](https://github.com/oxc-project/oxc/issues/2409)。允许 JavaScript 插件以最小的开销访问 Rust 生成的 AST。
- [**原生 MagicString 转换**](https://rolldown.rs/in-depth/native-magic-string#native-magicstring)。简单的自定义转换，逻辑用 JavaScript 编写，但计算用 Rust 完成。

## **联系我们** {#connect-with-us}

如果你已经尝试过 Vite 8 测试版，我们非常希望听到你的反馈！请报告任何问题或分享你的使用体验：

- **Discord**：加入我们的[社区服务器](https://chat.vite.dev/)进行实时讨论
- **GitHub**：在 [GitHub 讨论区](https://github.com/vitejs/vite/discussions)分享反馈
- **问题报告**：在 [rolldown-vite 仓库](https://github.com/vitejs/rolldown-vite/issues)报告 bug 和回归问题
- **成果分享**：在 [rolldown-vite-perf-wins 仓库](https://github.com/vitejs/rolldown-vite-perf-wins)分享你改善的构建时间

我们感谢所有提交的报告和复现案例。它们有助于我们发布稳定的 8.0.0 版本。
