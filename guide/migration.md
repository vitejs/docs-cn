# 从 v5 迁移

## 环境 API {#environment-api}

作为新的实验性 [环境 API](/guide/api-environment.md) 的一部分，我们进行了大规模的内部重构。Vite 6 努力避免引入破坏性的变更，以确保大多数项目能够快速升级到新的主要版本。我们会等待大部分的生态系统迁移并稳定后，再开始推荐使用新的 API。可能会有一些边缘情况，但这些应该只会影响到框架和工具的底层使用。我们已经与生态系统中的维护者合作，在发布前减轻了这些差异。如果你发现了回退性问题，请 [新建 issue](https://github.com/vitejs/vite/issues/new?assignees=&labels=pending+triage&projects=&template=bug_report.yml)。

由于 Vite 的实现发生了改变，一些内部的 API 已经被移除了。如果你依赖于其中的某一个，那么请创建一个 [feature request](https://github.com/vitejs/vite/issues/new?assignees=&labels=enhancement%3A+pending+triage&projects=&template=feature_request.yml)。

## Vite 运行时 API {#vite-runtime-api}

实验性的 Vite 运行时 API 已经演变为模块运行器 API（Module Runner API），这是作为新的实验性 [环境 API](/guide/api-environment) 的一部分，在 Vite 6 中发布。鉴于这个功能是实验性的，所以在 Vite 5.1 中引入的先前 API 的移除并不是一个破坏性的更改，但是用户在迁移到 Vite 6 的过程中，需要将他们的使用方式更新为与模块运行器相等的方式。

## 从 v4 迁移 {#migration-from-v4}

在 Vite v5 文档中查看 [从 v4 迁移指南](https://v4.vite.dev/guide/migration.html)（[中文版](/guide/migration-from-v4)），了解如何将你的应用迁移到 Vite v5，然后再处理本页中所提及的变化。
