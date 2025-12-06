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

摘要：由 [Rolldown](https://rolldown.rs/) 驱动的 Vite 8 首个测试版现已发布。Vite 8 提供了显著更快的生产构建速度，并开启了未来的改进可能性。你可以通过将 `vite` 升级到 `8.0.0-beta.0` 版本并阅读[迁移指南](/guide/migration)来试用这个新版本。

---

我们很高兴发布 Vite 8 的首个测试版。这个版本统一了底层工具链，带来了更好的一致性行为，以及显著的构建性能提升。Vite 现在使用 [Rolldown](https://rolldown.rs/) 作为其打包器，取代了之前 esbuild 和 Rollup 的组合。

## 面向 Web 的全新打包器 {#a-new-bundler-for-the-web}

Vite 之前依赖两个打包器来满足开发和生产构建的不同需求：

1. 开发期间使用 esbuild 进行快速编译
2. 生产构建使用 Rollup 进行打包、分块和优化

这种方法让 Vite 能够专注于开发者体验和协调，而无需重新发明解析和打包功能。然而，维护两个独立的打包流水线引入了不一致性：独立的转换流水线、不同的插件系统，以及越来越多的粘合代码来保持开发和生产之间打包行为的一致性。

为了解决这个问题，[VoidZero 团队](https://voidzero.dev) 构建了 **Rolldown**，这是一个下一代打包器，目标是在 Vite 中使用。它的设计特点包括：

- **性能**：Rolldown 使用 Rust 编写，以原生速度运行。它的性能水平与 esbuild 相匹配，并且比 Rollup [快 10-30 倍](https://github.com/rolldown/benchmarks)。
- **兼容性**：Rolldown 支持与 Rollup 和 Vite 相同的插件 API。大多数 Vite 插件在 Vite 8 中可以开箱即用。
- **更多功能**：Rolldown 为 Vite 解锁了更多高级功能，包括完整打包模式、更灵活的分块控制、模块级持久缓存、模块联邦等。

## 统一工具链 {#unifying-the-toolchain}

Vite 打包器更换的影响超越了性能范畴。打包器利用解析器、解析器、转换器和压缩器。Rolldown 为此目的使用了由 VoidZero 团队主导的另一个项目 Oxc。

**这使得 Vite 成为由同一团队维护的端到端工具链的入口：构建工具（Vite）、打包器（Rolldown）和编译器（Oxc）。**

这种一致性确保了整个堆栈中的行为一致性，并且随着 JavaScript 的不断发展，使我们能够快速采用并与新的语言规范保持一致。这也解锁了以前仅凭 Vite 无法实现的广泛改进。例如，我们可以利用 Oxc 的语义分析在 Rolldown 中实现更好的 tree-shaking。

## Vite 如何迁移到 Rolldown {#how-vite-migrated-to-rolldown}

迁移到由 Rolldown 驱动的 Vite 是一项基础性变革。因此，我们的团队采取了深思熟虑的步骤来实施这一变革，同时不牺牲稳定性和生态系统兼容性。

首先，我们发布了独立的 `rolldown-vite` 包作为[技术预览版](https://voidzero.dev/posts/announcing-rolldown-vite)。这让我们能够在不影响 Vite 稳定版本的情况下与早期采用者合作。早期采用者从 Rolldown 的性能提升中受益，同时提供了宝贵的反馈。亮点包括：

- Linear 的生产构建时间从 46 秒减少到 6 秒
- Ramp 将它们的建造时间缩短了 57%
- Mercedes-Benz.io 将构建时间减少了高达 38%
- Beehiiv 将构建时间减少了 64%

接下来，我们建立了一套测试套件，用于验证关键的 Vite 插件与 `rolldown-vite` 的兼容性。这项 CI 任务帮助我们及早发现回归问题和兼容性问题，特别是对于 SvelteKit、react-router 和 Storybook 等框架和元框架。

最后，我们构建了一个兼容层，帮助开发者从 Rollup 和 esbuild 选项迁移到相应的 Rolldown 选项。

因此，每个人都能顺利迁移到 Vite 8。

## 迁移到 Vite 8 Beta {#migrating-to-vite-8-beta}

由于 Vite 8 涉及核心构建行为，我们专注于保持配置 API 和插件钩子不变。我们创建了[迁移指南](/guide/migration)来帮助您升级。

有两种可用的升级路径：

1. **直接升级**：更新 `package.json` 并运行常规的开发和构建命令。
2. **渐进式迁移**：从 Vite 7 迁移到 `rolldown-vite` 包，然后再到 Vite 8。这样您可以识别出与 Rolldown 相关的不兼容性或问题，而不会对 Vite 造成其他更改。（推荐用于较大或复杂的项目）

> [!IMPORTANT]
> 如果你依赖特定的 Rollup 或 esbuild 选项，你可能需要对 Vite 配置进行一些调整。请参考[迁移指南](/guide/migration)获取详细的说明和示例。
> 与所有非稳定的主版本一样，升级后建议进行全面测试以确保一切按预期工作。请务必报告任何[问题](https://github.com/vitejs/rolldown-vite/issues)。

如果你使用的框架或工具将 Vite 作为依赖项，例如 Astro、Nuxt 或 Vitest，你必须在 `package.json` 中覆盖 `vite` 依赖项，这根据你使用的包管理器略有不同：

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

添加这些覆盖后，重新安装你的依赖项，然后像往常一样启动开发服务器或构建你的项目。

## Vite 8 的附加功能 {#additional-features-in-vite-8}

除了搭载 Rolldown 之外，Vite 8 还带来了以下功能：

- **内置 tsconfig `paths` 支持**：开发者可以通过将 [`resolve.tsconfigPaths`](/config/shared-options.md#resolve-tsconfigpaths) 设置为 `true` 来启用此功能。此功能会带来轻微的性能成本，默认情况下未启用。
- **`emitDecoratorMetadata` 支持**：Vite 8 现在内置了对 TypeScript [`emitDecoratorMetadata` 选项](https://www.typescriptlang.org/tsconfig/#emitDecoratorMetadata)的自动支持。更多详情请参见[功能](/guide/features.md#emitdecoratormetadata)页面。

## 展望未来 {#looking-ahead}

速度一直是 Vite 的标志性特性。与 Rolldown 的集成，以及延伸至 Oxc，意味着 JavaScript 开发者可以从 Rust 的速度中获益。升级到 Vite 8 应该会仅仅因为使用 Rust 而带来性能提升。

我们也即将推出 Vite 的完整打包模式，这将大幅提高大型项目的开发服务器速度。初步结果显示，开发服务器启动速度快了 3 倍，完全重新加载快了 40%，网络请求减少了 10 倍。

另一个标志性的 Vite 特性是插件生态系统。我们希望 JavaScript 开发者能够继续使用他们熟悉的 JavaScript 语言来扩展和定制 Vite，同时从 Rust 的性能提升中受益。我们的团队正在与 VoidZero 团队合作，以加速这些基于 Rust 系统中的 JavaScript 插件使用。

目前正在试验的即将到来的优化包括：

- [**原始 AST 传输**](https://github.com/oxc-project/oxc/issues/2409)。允许 JavaScript 插件以最小的开销访问 Rust 生成的 AST。
- [**原生 MagicString 转换**](https://rolldown.rs/in-depth/native-magic-string#native-magicstring)。简单的自定义转换，逻辑在 JavaScript 中但计算在 Rust 中进行。

## **联系我们** {#connect-with-us}

如果你已经尝试过 Vite 8 测试版，我们很希望听到你的反馈！请报告任何问题或分享你的使用体验：

- **Discord**：加入我们的[社区服务器](https://chat.vite.dev/)进行实时讨论
- **GitHub**：在 [GitHub 讨论区](https://github.com/vitejs/vite/discussions)分享反馈
- **问题报告**：在 [rolldown-vite 仓库](https://github.com/vitejs/rolldown-vite/issues)报告 bug 和回归问题
- **成果分享**：在 [rolldown-vite-perf-wins 仓库](https://github.com/vitejs/rolldown-vite-perf-wins)分享你改善的构建时间

我们感谢所有的报告和复现案例。它们帮助我们朝着发布稳定版 8.0.0 的目标前进。
