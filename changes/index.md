# 破坏性变更 {#breaking-changes}

Vite 中的破坏性变更列表，包括 API 废弃、移除和变更。在你的 Vite 配置中，大多数下面的变更可以使用 [`future` 选项](/config/shared-options.html#future) 进行选择。

## 计划中 {#planned}

这些变更计划在 Vite 的下一个主要版本中进行。我们会通过废弃或使用警告来尽可能地引导你，同时我们也正在联系框架、插件的作者以及用户来实施这些变更。

- _目前还没有计划中的变更_

## 考虑中 {#considering}

这些变更正在考虑中，通常是希望改进当前使用模式的实验性 API。由于这里并未列出所有的变更，所以请访问 [Vite GitHub Discussions 中的 Experimental 标签](https://github.com/vitejs/vite/discussions/categories/feedback?discussions_q=label%3Aexperimental+category%3AFeedback) 来查看完整的列表。

我们目前还不建议你切换到这些 API。我们将它们包含在 Vite 中是为了帮助我们收集反馈。请查看这些提案，并在每个提案相关联的 GitHub Discussions 中告诉我们它们在你的使用场景中的表现如何。

- [钩子函数中的 `this.environment`](/changes/this-environment-in-hooks)
- [HMR `hotUpdate` 插件钩子](/changes/hotupdate-hook)
- [迁移到按环境划分的 API](/changes/per-environment-apis)
- [使用 `ModuleRunner` API 进行服务端渲染](/changes/ssr-using-modulerunner)
- [构建过程中的共享插件](/changes/shared-plugins-during-build)

## 历史 {#past}

以下的变更已经被实施或者撤销。在当前的主要版本中，它们已经不再相关。

- _目前还没有历史的变更_
