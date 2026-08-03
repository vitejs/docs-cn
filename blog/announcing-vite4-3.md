---
title: Vite 4.3 正式发布！
author:
  name: Vite 团队
date: 2023-04-20
sidebar: false
head:
  - - meta
    - property: og:type
      content: website
  - - meta
    - property: og:title
      content: Vite 4.3 正式发布
  - - meta
    - property: og:image
      content: https://v6.cn.vite.dev/og-image-announcing-vite4-3.png
  - - meta
    - property: og:url
      content: https://v6.cn.vite.dev/blog/announcing-vite4-3
  - - meta
    - property: og:description
      content: Vite 4.3 发布公告
  - - meta
    - name: twitter:card
      content: summary_large_image
---

# Vite 4.3 正式发布！

_2023 年 4 月 20 日_

![Vite 4.3 发布封面图](/og-image-announcing-vite4-3.png)

快速链接：

- 文档：[English](https://v4.vite.dev/)、[简体中文](/)、[日本語](https://ja.vite.dev/)、[Español](https://es.vite.dev/)、[Português](https://pt.vite.dev/)
- [Vite 4.3 变更日志](https://github.com/vitejs/vite/blob/v6/packages/vite/CHANGELOG.md#430-2023-04-20)

## 性能改进

在这个次要版本中，我们专注于提升开发服务器的性能。解析逻辑得到精简，热点路径更快，并且在查找 `package.json`、TS 配置文件和一般的已解析 URL 时使用了更智能的缓存。

Vite 贡献者在这篇博文中详细介绍了相关性能工作：[我们如何让 Vite 4.3 变得更快 🚀](https://sun0day.github.io/blog/vite/why-vite4_3-is-faster.html)。

与 Vite 4.2 相比，这一轮工作带来了全面的速度提升。

以下结果由 [sapphi-red/performance-compare](https://github.com/sapphi-red/performance-compare) 测得。它使用一个包含 1000 个 React 组件的应用，测试开发服务器的冷启动与热启动时间，以及根组件和叶子组件的 HMR 时间：

| **Vite（Babel）** | Vite 4.2 | Vite 4.3 | 改进幅度 |
| :---------------- | -------: | -------: | -------: |
| **开发冷启动**    | 17249.0ms | 5132.4ms |   -70.2% |
| **开发热启动**    |  6027.8ms | 4536.1ms |   -24.7% |
| **根组件 HMR**    |    46.8ms |   26.7ms |   -42.9% |
| **叶子组件 HMR**  |    27.0ms |   12.9ms |   -52.2% |

| **Vite（SWC）** | Vite 4.2 | Vite 4.3 | 改进幅度 |
| :-------------- | -------: | -------: | -------: |
| **开发冷启动**  | 13552.5ms | 3201.0ms |   -76.4% |
| **开发热启动**  |  4625.5ms | 2834.4ms |   -38.7% |
| **根组件 HMR**  |    30.5ms |   24.0ms |   -21.3% |
| **叶子组件 HMR** |    16.9ms |   10.0ms |   -40.8% |

![Vite 4.3 与 4.2 启动时间对比](/vite4-3-startup-time.png)

![Vite 4.3 与 4.2 HMR 时间对比](/vite4-3-hmr-time.png)

你可以在[这里](https://gist.github.com/sapphi-red/25be97327ee64a3c1dce793444afdf6e)了解基准测试的更多信息。本次性能测试所用规格和版本如下：

- CPU：Ryzen 9 5900X，内存：DDR4-3600 32GB，SSD：WD Blue SN550 NVME SSD
- Windows 10 Pro 21H2 19044.2846
- Node.js 18.16.0
- Vite 和 React 插件版本
  - Vite 4.2（Babel）：Vite 4.2.1 + plugin-react 3.1.0
  - Vite 4.3（Babel）：Vite 4.3.0 + plugin-react 4.0.0-beta.1
  - Vite 4.2（SWC）：Vite 4.2.1 + plugin-react-swc 3.2.0
  - Vite 4.3（SWC）：Vite 4.3.0 + plugin-react-swc 3.3.0

早期采用者还报告，在真实应用中测试 Vite 4.3 beta 时，开发启动速度提升了 1.5 至 2 倍。我们很期待了解它在你的应用中的表现。

## 性能分析

我们会继续改进 Vite 的性能，并正在开发官方的 [Benchmark 工具](https://github.com/vitejs/vite-benchmark)，用于获取每个 Pull Request 的性能指标。

[vite-plugin-inspect](https://github.com/antfu/vite-plugin-inspect) 现在也提供了更多性能相关功能，帮助你识别应用中构成瓶颈的插件或中间件。

页面加载完成后，使用 `vite --profile`（然后按 `p`）会保存开发服务器启动过程的 CPU profile。你可以用 [speedscope](https://www.speedscope.app/) 打开它来定位性能问题，也可以在 [Discussion](https://github.com/vitejs/vite/discussions) 或 [Vite Discord](https://chat.vite.dev) 中与 Vite 团队分享发现。

## 后续计划

为了配合 Node.js 16 在 9 月结束生命周期，我们决定今年只发布一个 Vite 主版本，并在其中同时停止支持 Node.js 14 和 16。如果你愿意参与，我们已经开启了 [Vite 5 Discussion](https://github.com/vitejs/vite/discussions/12466) 来收集早期反馈。
