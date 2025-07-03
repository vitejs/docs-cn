# 发布 {#releases}

Vite 的发布遵循 [语义化版本控制](https://semver.org/)。你可以在 [Vite npm 包页面](https://www.npmjs.com/package/vite) 查看 Vite 的最新稳定版本。

过去版本的完整变更日志可以在 [GitHub](https://github.com/vitejs/vite/blob/main/packages/vite/CHANGELOG.md) 上找到。

## 发布周期 {#release-cycle}

Vite 没有固定的发布周期。

- **补丁版本** 根据需要发布（通常每周）。
- **次要版本** 总是包含新功能，并根据需要发布。且总会有一个 beta 预发布阶段（通常每两个月）。
- **主要版本** 通常与 [Node.js 生命周期终止计划](https://endoflife.date/nodejs) 保持一致，并会提前宣布。这些版本会经过与生态系统的长期讨论，并有 alpha 和 beta 预发布阶段（通常每年）。

Vite 团队支持的 Vite 版本范围是这样确定的：

- **当前次要版本** 会定期提供修复。
- **上一个主要版本** （仅限其最新的次要版本）和 **上一个次要版本** 会接收重要修复和安全补丁。
- **倒数第二个主要版本** （仅限其最新的次要版本）和 **倒数第二个次要版本** 会接收安全补丁。
- 这些之前的所有版本将不再支持。

例如，如果 Vite 最新版本为 5.3.10：

- `vite@5.3` 会定期发布补丁版本。
- 重要修复和安全补丁会回溯到 `vite@4` 和 `vite@5.2`。
- 安全补丁也会回溯到 `vite@3` 和 `vite@5.1`。
- `vite@2` 和 `vite@5.0` 不再支持更新。用户应升级以接收更新。

我们建议定期更新 Vite。在每次主要版本更新时，请查看 [迁移指南](/guide/migration)。Vite 团队与生态系统中的主要项目紧密合作，以确保新版本的质量。我们通过 [vite-ecosystem-ci 项目](https://github.com/vitejs/vite-ecosystem-ci) 在发布新版本前测试它们。大多数使用 Vite 的项目应该能够快速提供支持或迁移到新版本。

## 语义化版本控制的特殊情况 {#semantic-versioning-edge-cases}

### TypeScript 定义 {#type-script-definitions}

我们可能会在次要版本之间对 TypeScript 定义进行不兼容的更改。这是因为：

- 有时 TypeScript 本身会在次要版本之间进行不兼容的更改，我们可能需要调整类型以支持更新所需的 TypeScript 版本。
- 偶尔我们可能需要采用仅在更新版本的 TypeScript 中可用的功能，这会提高最低要求的 TypeScript 版本。
- 如果你使用 TypeScript，可以使用一个锁定当前次要版本的 semver 范围，并在 Vite 发布新次要版本时手动升级。

### esbuild

[esbuild](https://esbuild.github.io/) 目前是 pre-1.0.0，有时它会有主要版本更新，我们可能需要包含这些变化以使用新的功能和性能改进，并可能会在 Vite 次要版本中提升 esbuild 的版本。

### Node.js 非 LTS 版本 {#node-js-non-lts-versions}

非 LTS 的 Node.js 版本（奇数版本）不在 Vite 的 CI 测试范围内，但在其 [生命周期终止](https://endoflife.date/nodejs) 之前应该仍然可以工作。

## 预发布 {#pre-releases}

次要版本通常会经历不固定数量的 beta 发布。主要版本会经历 alpha 和 beta 阶段。

预发布允许早期采用者和生态系统中的维护者进行集成和稳定性测试，并提供反馈。不要在生产环境中使用预发布版本。所有预发布版本都被认为是不稳定的，并且可能会在其中发布破坏性更改。在使用预发布版本时，请始终锁定到确切的版本。

## 弃用 {#deprecations}

我们定期在次要版本中弃用已被更好替代方案取代的功能。弃用的功能将继续工作，但会有类型或日志警告。在进入弃用状态后的下一个主要版本中将移除这些功能。每个主要版本的 [迁移指南](/guide/migration) 将列出这些移除，并记录升级路径。

## 实验性功能 {#experimental-features}

某些功能在 Vite 的稳定版本中发布时被标记为实验性功能。实验性功能允许我们收集实际使用经验，以影响其最终设计。目的是让用户通过在生产环境中测试它们来提供反馈。实验性功能本身被认为是不稳定的，应该仅在受控环境中使用。这些功能可能会在小版本之间发生变化，因此当依赖它们时，用户必须锁定 Vite 版本。我们将为每个实验性功能创建一个 [GitHub 讨论](https://github.com/vitejs/vite/discussions/categories/feedback?discussions_q=is%3Aopen+label%3Aexperimental+category%3AFeedback)。
