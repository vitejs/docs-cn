# 发布策略

Vite 的发布遵循[语义化版本](https://semver.org/lang/zh-CN/)。你可以在 [Vite npm 软件包页面](https://www.npmjs.com/package/vite)查看 Vite 的最新稳定版本。

过往版本的完整更新日志可以在 [GitHub](https://github.com/vitejs/vite/blob/v4/packages/vite/CHANGELOG.md) 上查看。

::: tip 注意
下一个 Vite 主版本将在 Node.js 16 于 9 月结束生命周期后发布。

更多信息请参阅 [Vite 5 讨论](https://github.com/vitejs/vite/discussions/12466)。
:::

## 发布周期

Vite 没有固定的发布周期。

- **补丁版本**按需发布。
- **次版本**始终包含新功能，也会按需发布。次版本发布前一定会经历 Beta 预发布阶段。
- **主版本**通常与 [Node.js 的生命周期终止时间](https://endoflife.date/nodejs)保持一致，并会提前公告。这类版本会经过早期讨论阶段以及 Alpha、Beta 预发布阶段。

前一个 Vite 主版本会继续获得重要修复和安全补丁。再早的版本只有在出现安全问题时才会更新。建议定期更新 Vite。升级每个主版本时，请查看相应的[迁移指南](/guide/migration)。

Vite 团队与生态系统中的主要项目合作，通过 [vite-ecosystem-ci 项目](https://github.com/vitejs/vite-ecosystem-ci)在发布前测试新的 Vite 版本。大多数使用 Vite 的项目应该都能在新版本发布后快速提供支持或完成迁移。

## 语义化版本的边缘情况

### TypeScript 类型定义

我们可能会在次版本之间发布不兼容的 TypeScript 类型定义变更，原因如下：

- TypeScript 本身有时会在次版本之间发布不兼容的变更，我们可能必须调整类型以支持较新的 TypeScript 版本。
- 我们偶尔需要采用仅在较新 TypeScript 版本中提供的功能，从而提高最低 TypeScript 版本要求。
- 如果你使用 TypeScript，可以通过语义化版本范围锁定当前次版本，并在 Vite 发布新次版本时手动升级。

### esbuild

[esbuild](https://esbuild.github.io/) 尚未达到 1.0.0，有时会出现破坏性变更。为了使用新功能和性能改进，我们可能需要在 Vite 的次版本中升级 esbuild。

### Node.js 非 LTS 版本

Vite 的 CI 不会测试非 LTS 的 Node.js 版本（奇数版本），但这些版本在其[生命周期结束](https://endoflife.date/nodejs)前通常仍可正常工作。

## 预发布版本

次版本通常会经历数量不固定的 Beta 版本，主版本则会经历 Alpha 和 Beta 阶段。

预发布版本让早期采用者和生态系统维护者能够进行集成及稳定性测试并提供反馈。请勿在生产环境中使用预发布版本。所有预发布版本都被视为不稳定版本，其间可能包含破坏性变更。使用预发布版本时，请始终锁定确切版本。

## 弃用

我们会在次版本中定期弃用已被更好方案取代的功能。弃用功能仍可继续使用，但会产生类型警告或日志警告。功能进入弃用状态后，将在下一个主版本中移除。每个主版本的[迁移指南](/guide/migration)都会列出这些移除项并说明升级方式。

## 实验性功能

稳定版 Vite 中的部分功能会被标记为实验性功能。通过这些功能，我们可以收集实际使用经验，并据此完善最终设计；用户也可以在生产环境中测试它们并提供反馈。实验性功能本身并不稳定，只应在受控环境中使用。它们可能在次版本之间发生变化，因此依赖这些功能时必须锁定 Vite 版本。
