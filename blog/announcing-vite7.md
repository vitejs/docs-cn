---
title: Vite 7.0 is out!
author:
  name: The Vite Team
date: 2025-06-24
sidebar: false
head:
  - - meta
    - property: og:type
      content: website
  - - meta
    - property: og:title
      content: Announcing Vite 7
  - - meta
    - property: og:image
      content: https://vite.dev/og-image-announcing-vite7.webp
  - - meta
    - property: og:url
      content: https://vite.dev/blog/announcing-vite7
  - - meta
    - property: og:description
      content: Vite 7 Release Announcement
  - - meta
    - name: twitter:card
      content: summary_large_image
---

# Vite 7.0 发布了！ {#vite-7-0-is-out}

_2025年6月24日_

![Vite 7 Announcement Cover Image](/og-image-announcing-vite7.webp)

我们很高兴与大家分享 Vite 7 的发布！从 Evan You 向 Vite 仓库提交第一次 commit 至今已经过去 5 年了，当时没有人能预料到前端生态会发生如此巨大的变化。如今，大多数现代前端框架和工具正在协同工作，构建在 Vite 共享的基础设施之上。通过更高层次的共享，它们能够以更快的速度进行创新。Vite 现在每周被下载 3100 万次，在上次重大版本发布后的七个月内增长了 1400 万次下载量。

今年，我们将迈出几个重要的步伐。首先，[ViteConf](https://viteconf.org) 将首次以线下形式举办！Vite 生态系统将于 10 月 9-10 日在阿姆斯特丹齐聚一堂！本次活动由 [JSWorld](https://jsworldconference.com/) 联合 [Bolt](https://bolt.new)、[VoidZero](https://voidzero.dev) 和 Vite 核心团队共同组织！我们已经成功举办过三届精彩的[ViteConf 线上活动](https://www.youtube.com/@viteconf/playlists)，现在迫不及待地想要与大家面对面交流。欢迎查看演讲嘉宾名单并前往 [ViteConf 官网](https://viteconf.org) 获取门票信息。

此外，[VoidZero](https://voidzero.dev/posts/announcing-voidzero-inc) 继续在构建面向 JavaScript 生态系统的开源统一开发工具链的使命中取得重大进展。在过去一年里，VoidZero 团队一直在开发 [Rolldown](https://rolldown.rs/) —— 一个基于 Rust 的下一代打包工具（bundler），作为现代化 Vite 核心的更广泛努力的一部分。你现在就可以通过使用 `rolldown-vite` 包来体验基于 Rolldown 的 Vite，替代默认的 `vite` 包。它是一个即插即用的替代方案，未来 Rolldown 将成为 Vite 的默认打包工具。切换后可以显著减少你的构建时间，尤其是对于较大的项目而言。更多信息请参阅 [Rolldown-Vite 宣布博文](https://voidzero.dev/posts/announcing-rolldown-vite) 和我们的 [迁移指南](https://vite.dev/rolldown)。

通过 VoidZero 与 [NuxtLabs](https://nuxtlabs.com/) 的合作，Anthony Fu 正在致力于开发 Vite DevTools。它将为所有基于 Vite 的项目和框架提供更深入且富有洞察力的调试与分析功能。你可以阅读 [VoidZero 与 NuxtLabs 联手打造 Vite DevTools 的博客文章](https://voidzero.dev/posts/voidzero-nuxtlabs-vite-devtools) 了解更多信息。

快速链接：

- [英文文档](https://vite.dev)
- 新增翻译：[فارسی](https://fa.vite.dev/)
- 翻译版本：[简体中文](/)、[日本語](https://ja.vite.dev/)、[Español](https://es.vite.dev/)、[Português](https://pt.vite.dev/)、[한국어](https://ko.vite.dev/)、[Deutsch](https://de.vite.dev/)
- [迁移指南](/guide/migration)
- [GitHub 更新日志](https://github.com/vitejs/vite/blob/main/packages/vite/CHANGELOG.md)

使用 [vite.new](https://vite.new) 在线体验 Vite 7，或者通过运行 `pnpm create vite` 在本地使用你偏好的框架搭建 Vite 项目。更多信息请查看[入门指南](/guide/)。

我们诚邀你加入我们，帮助我们改进 Vite（加入超过 [1.1K 位 Vite Core 贡献者](https://github.com/vitejs/vite/graphs/contributors)）、我们的依赖项、插件以及生态系统中的项目。了解更多信息，请参阅我们的[贡献指南](https://github.com/vitejs/vite/blob/main/CONTRIBUTING.md)。

一个好的入门方法包括：[整理问题](https://github.com/vitejs/vite/issues)、[审阅 PR](https://github.com/vitejs/vite/pulls)、基于未解决问题提交测试 PR，或在 [讨论区](https://github.com/vitejs/vite/discussions) 以及 Vite Land 的 [帮助论坛](https://discord.com/channels/804011606160703521/1019670660856942652) 中为他人提供帮助。如有任何疑问，欢迎加入我们的 [Discord 社区](http://chat.vite.dev/)，并在 [#contributing 频道](https://discord.com/channels/804011606160703521/804439875226173480) 中与我们交流。

通过关注我们在 [Bluesky](https://bsky.app/profile/vite.dev)、[X（原 Twitter）](https://twitter.com/vite_js) 或 [Mastodon](https://webtoo.ls/@vite)，保持更新并与更多基于 Vite 构建的开发者建立联系。

## Node.js 支持 {#node-js-support}

Vite 现在要求使用 Node.js 20.19+ 或 22.12+。由于 Node.js 18 已于 2025 年 4 月底达到[生命周期终点（EOL）](https://endoflife.date/nodejs)，我们已不再支持该版本。

我们要求使用这些新的 Node.js 版本范围，以确保 Node.js 可以无需启用标志即可支持 `require(esm)`。这使我们能够仅以 ESM 格式发布 Vite 7.0，同时不会阻止 CJS 模块通过 `require` 调用 Vite 的 JavaScript API。有关当前 ESM 在生态系统中的发展状况的详细分析，请查看 Anthony Fu 的文章 [《迈向纯 ESM》](https://antfu.me/posts/move-on-to-esm-only)。

## 默认浏览器兼容性目标已更改为 Baseline Widely Available {#default-browser-target-changed-to-baseline-widely-available}

[Baseline](https://web-platform-dx.github.io/web-features/) 为我们提供了明确的信息，指出了哪些 Web 平台特性在当今主流浏览器中可用。Baseline Widely Available，表示该功能已经十分成熟，可在多种设备和浏览器版本中正常工作，并且在各浏览器中至少已支持 30 个月。

在 Vite 7 中，默认浏览器目标将从 `'modules'` 更改为新的默认值：`'baseline-widely-available'`。每当我们发布一个重大版本时，所支持的浏览器列表都会更新，以匹配与“Baseline Widely Available”特性兼容的最低浏览器版本。Vite 7.0 中 `build.target` 的默认浏览器值变化如下：

- Chrome 87 → 107
- Edge 88 → 107
- Firefox 78 → 104
- Safari 14.0 → 16.0

这一变化为未来版本的浏览器兼容性带来了更高的可预测性。

## Vitest {#vitest}

对于 Vitest 用户而言，Vite 7.0 从 Vitest 3.2 开始得到支持。你可以阅读 [Vitest 3.2 发布博客](https://vitest.dev/blog/vitest-3-2.html)，了解更多关于 Vitest 团队如何持续改进 Vite 测试功能的内容。

## Environment API {#environment-api}

Vite 6 是自 Vite 2 以来最具意义的一次重大发布，它通过 [全新的实验性 Environment API](https://vite.dev/blog/announcing-vite6.html#experimental-environment-api) 引入了多项新功能。我们暂时将这些新 API 保持为实验性状态，以便生态系统逐步评估它们在各类项目中的适用性并提供反馈。如果你正在基于 Vite 构建项目，我们鼓励你尝试使用这些新 API，并通过[此开放讨论话题](https://github.com/vitejs/vite/discussions/16358) 向我们提供你的使用反馈。

在 Vite 7 中，我们新增了一个 `buildApp` 钩子，使插件能够协调环境的构建过程。详情请参阅[面向框架的 Environment API 指南](/guide/api-environment-frameworks.html#environments-during-build)。

我们要感谢那些一直在测试新 API 并帮助我们稳定新功能的团队。例如，Cloudflare 团队宣布了其 Cloudflare Vite 插件的 1.0 版本发布，并正式支持 React Router v7。他们的插件展示了 Environment API 在运行时提供者方面的潜力。要了解更多关于他们的实现方式和未来计划，请查看文章 [“Just use Vite”… with the Workers runtime](https://blog.cloudflare.com/introducing-the-cloudflare-vite-plugin/)。

## 迁移到 Vite 7 {#migrating-to-vite-7}

从 Vite 6 升级到 Vite 7 应该是一次平滑的体验。我们移除了已弃用的功能，例如 Sass 的旧版 API 支持以及 `splitVendorChunkPlugin`，这些改动不会影响你的项目。我们仍然建议你在升级前查看[详细的迁移指南](/guide/migration)。

所有变更的完整列表请见 [Vite 7 更新日志](https://github.com/vitejs/vite/blob/main/packages/vite/CHANGELOG.md)。

## 致谢 {#acknowledgments}

Vite 7 由 [Vite 团队](/team) 在广大贡献者、下游维护者和插件开发者的帮助下精心打造而成。我们特别感谢 [sapphi-red](https://github.com/sapphi-red)，以表彰他在 `rolldown-vite` 和本次发布中做出的出色工作。Vite 由 [VoidZero](https://voidzero.dev) 打造，并得到了 [Bolt](https://bolt.new) 和 [Nuxt Labs](https://nuxtlabs.com) 的合作支持。我们还要感谢我们的赞助商，包括 [Vite 的 GitHub 赞助计划](https://github.com/sponsors/vitejs) 和 [Vite 的 Open Collective 页面](https://opencollective.com/vite) 上的支持者。
