---
title: Vite 4.3 is out!
author:
  name: The Vite Team
date: 2023-04-20
sidebar: false
head:
  - - meta
    - property: og:type
      content: website
  - - meta
    - property: og:title
      content: Vite 4.3 发布公告
  - - meta
    - property: og:image
      content: https://vite.dev/og-image-announcing-vite4-3.webp
  - - meta
    - property: og:url
      content: https://vite.dev/blog/announcing-vite4-3
  - - meta
    - property: og:description
      content: Vite 4.3 Release Announcement
  - - meta
    - name: twitter:card
      content: summary_large_image
---

# Vite 4.3 发布了！{#vite-4-3-is-out}

_2023年4月20日_

![Vite 4.3 发布公告封面](/og-image-announcing-vite4-3.webp)

快速链接：

- [英文文档](https://vite.dev/)
- 翻译版本：[简体中文](/)、[日本語](https://ja.vite.dev/)、[Español](https://es.vite.dev/)、[Português](https://pt.vite.dev/)
- [更新日志](https://github.com/vitejs/vite/blob/main/packages/vite/CHANGELOG.md#430-2023-04-20)

## 性能改进 {#performance-improvements}

本次更新专注于提升开发服务器性能。我们精简了解析逻辑，优化了高频路径，并为查找 `package.json`、TS 配置文件以及常规 URL 解析实现了更智能的缓存。

你可以阅读 Vite 贡献者撰写的这篇博客，详细了解相关性能工作：[我们如何让 Vite 4.3 快得飞起 🚀](https://sun0day.github.io/blog/vite/why-vite4_3-is-faster.html)。

与 Vite 4.2 相比，这轮优化全面提升了速度。

以下结果来自 [sapphi-red/performance-compare](https://github.com/sapphi-red/performance-compare)。该基准使用一个包含 1000 个 React 组件的应用，测试冷启动和热启动耗时，以及根组件和叶子组件的 HMR 耗时：

| **Vite (Babel)** | Vite 4.2 | Vite 4.3 | 改进 |
| :--------------- | -------: | -------: | ---: |
| **开发冷启动**   | 17249.0ms | 5132.4ms | -70.2% |
| **开发热启动**   | 6027.8ms | 4536.1ms | -24.7% |
| **根组件 HMR**   | 46.8ms | 26.7ms | -42.9% |
| **叶子组件 HMR** | 27.0ms | 12.9ms | -52.2% |

| **Vite (SWC)**   | Vite 4.2 | Vite 4.3 | 改进 |
| :--------------- | -------: | -------: | ---: |
| **开发冷启动**   | 13552.5ms | 3201.0ms | -76.4% |
| **开发热启动**   | 4625.5ms | 2834.4ms | -38.7% |
| **根组件 HMR**   | 30.5ms | 24.0ms | -21.3% |
| **叶子组件 HMR** | 16.9ms | 10.0ms | -40.8% |

![Vite 4.3 与 4.2 启动时间对比](../images/vite4-3-startup-time.webp)

![Vite 4.3 与 4.2 HMR 时间对比](../images/vite4-3-hmr-time.webp)

更多基准测试信息可在 [这里](https://gist.github.com/sapphi-red/25be97327ee64a3c1dce793444afdf6e) 查看。本次性能测试的硬件和版本如下：

- CPU：Ryzen 9 5900X；内存：DDR4-3600 32GB；SSD：WD Blue SN550 NVMe SSD
- Windows 10 Pro 21H2 19044.2846
- Node.js 18.16.0
- Vite 和 React 插件的版本
  - Vite 4.2 (Babel)：Vite 4.2.1 + plugin-react 3.1.0
  - Vite 4.3 (Babel)：Vite 4.3.0 + plugin-react 4.0.0-beta.1
  - Vite 4.2 (SWC)：Vite 4.2.1 + plugin-react-swc 3.2.0
  - Vite 4.3 (SWC)：Vite 4.3.0 + plugin-react-swc 3.3.0

测试 Vite 4.3 beta 的早期使用者也反馈，真实应用的开发启动速度提升至原来的 1.5 到 2 倍。我们也很想了解你的应用获得了怎样的结果。

## 性能分析 {#profiling}

我们会继续改进 Vite 的性能。目前正在开发官方的 [基准测试工具](https://github.com/vitejs/vite-benchmark)，以便获取每个 Pull Request 的性能指标。

[vite-plugin-inspect](https://github.com/antfu/vite-plugin-inspect) 现在也提供了更多性能相关功能，可帮助你找出应用中的插件或中间件瓶颈。

页面加载后运行 `vite --profile`（然后按 `p`）会保存开发服务器启动时的 CPU 性能分析文件。你可以在 [speedscope](https://www.speedscope.app/) 等应用中打开它来定位性能问题，并通过 [GitHub Discussions](https://github.com/vitejs/vite/discussions) 或 [Vite Discord 社区](https://chat.vite.dev) 与 Vite 团队分享发现。

## 后续计划 {#next-steps}

我们决定在这一年只发布一个 Vite 主版本，与 9 月 [Node.js 16 结束生命周期](https://endoflife.date/nodejs) 的时间保持一致，并在该版本中停止支持 Node.js 14 和 16。如果你希望参与其中，我们已经开启了 [Vite 5 讨论](https://github.com/vitejs/vite/discussions/12466) 来收集早期反馈。
