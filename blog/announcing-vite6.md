---
title: Vite 6.0 is out!
author:
  name: The Vite Team
date: 2024-11-26
sidebar: false
head:
  - - meta
    - property: og:type
      content: website
  - - meta
    - property: og:title
      content: Announcing Vite 6
  - - meta
    - property: og:image
      content: https://vite.dev/og-image-announcing-vite6.webp
  - - meta
    - property: og:url
      content: https://vite.dev/blog/announcing-vite6
  - - meta
    - property: og:description
      content: Vite 6 Release Announcement
  - - meta
    - name: twitter:card
      content: summary_large_image
---

# Vite 6.0 发布了！ {#vite-6-0-is-out}

_2024年11月26日_

![Vite 6 Announcement Cover Image](/og-image-announcing-vite6.webp)

今天，Vite 迎来了发展历程中的重要里程碑。我们很高兴地宣布，Vite 6 正式发布了！这一重大版本的发布离不开 Vite [团队](/team)、[贡献者](https://github.com/vitejs/vite/graphs/contributors) 以及整个生态系统合作伙伴的共同努力。

过去一年中，Vite 的采用率持续增长，自 Vite 5 发布以来，npm 每周下载量从 750 万次跃升至 1700 万次。[Vitest](https://vitest.dev) 不仅越来越受用户欢迎，还开始形成自己的生态系统。例如，[Storybook](https://storybook.js.org) 推出了由 Vitest 支持的全新测试功能。

Vite 生态系统也迎来了一批新成员，包括 [TanStack Start](https://tanstack.com/start)、[One](https://onestack.dev/)、[Ember](https://emberjs.com/) 等框架。Web 开发领域的创新速度日益加快，[Astro](https://astro.build/)、[Nuxt](https://nuxt.com/)、[SvelteKit](https://kit.svelte.dev/)、[Solid Start](https://www.solidjs.com/blog/introducing-solidstart)、[Qwik City](https://qwik.builder.io/qwikcity/overview)、[RedwoodJS](https://redwoodjs.com/)、[React Router](https://reactrouter.com/) 等项目都在不断推陈出新。

Vite 已被 OpenAI、Google、Apple、Microsoft、NASA、Shopify、Cloudflare、GitLab、Reddit 和 Linear 等众多知名公司采用。两个月前，我们创建了一份 [使用 Vite 的公司列表](https://github.com/vitejs/companies-using-vite)。令人欣喜的是，许多开发者提交 PR 将他们的公司添加到列表中。回首 Vite 诞生至今，我们共同打造的生态系统增长速度之快，实在令人难以置信。

![Vite weekly npm downloads](../images/vite6-npm-weekly-downloads.webp)

### 加速 Vite 生态系统 {#speeding-up-the-vite-ecosystem}

上个月，[StackBlitz](https://stackblitz.com) 再次主办了第三届 [ViteConf](https://viteconf.org/24/replay)，吸引了整个社区的广泛参与。这是迄今为止规模最大的 Vite 会议，生态系统中的各路开发者齐聚一堂。Evan You 正式宣布成立 [VoidZero](https://staging.voidzero.dev/posts/announcing-voidzero-inc)，这是一家致力于为 JavaScript 生态系统构建开源、高性能和统一开发工具链的公司。VoidZero 推出了 [Rolldown](https://rolldown.rs) 和 [Oxc](https://oxc.rs)，他们的团队正在加紧准备这些工具以供 Vite 采用。想了解 Vite 未来如何借助 Rust 实现更强大的性能，不妨观看 Evan 的主题演讲。

<YouTubeVideo videoId="EKvvptbTx6k?si=EZ-rFJn4pDW3tUvp" />

[Stackblitz](https://stackblitz.com) 推出了 [bolt.new](https://bolt.new)，这是一个结合了 Claude 和 WebContainers 的 Remix 应用，允许你使用提示语、编辑、运行和部署全栈应用。Nate Weiner 宣布了 [One](https://onestack.dev/)，一个新的 Vite 驱动的 Web 和原生 React 框架。Storybook 展示了他们最新由 Vitest 驱动的 [测试功能](https://youtu.be/8t5wxrFpCQY?si=PYZoWKf-45goQYDt)。还有更多精彩内容。我们建议你观看 [全部 43 场演讲](https://www.youtube.com/playlist?list=PLqGQbXn_GDmnObDzgjUF4Krsfl6OUKxtp)。演讲者们付出了巨大努力，分享了每个项目的最新进展。

Vite 还更新了主页和域名。请记得将你的链接更新为新的 [vite.dev](https://vite.dev) 域名。新设计和实现由 VoidZero 完成，正是他们制作了自己的网站。特别感谢 [Vicente Rodriguez](https://bento.me/rmoon) 和 [Simon Le Marchant](https://marchantweb.com/) 的贡献。

### Vite 6 的到来 {#the-next-vite-major-is-here}

Vite 6 是自 Vite 2 以来最重要的主要版本发布。我们渴望与生态系统合作，通过新的 API 继续扩展我们的共享资源，并一如既往地提供一个更完善的构建基础。

快速链接：

- [英文文档](https://vite.dev)
- 翻译版本：[简体中文](/)、[日本語](https://ja.vite.dev/)、[Español](https://es.vite.dev/)、[Português](https://pt.vite.dev/)、[한국어](https://ko.vite.dev/)、[Deutsch](https://de.vite.dev/)
- [迁移指南](/guide/migration)
- [GitHub 更新日志](https://github.com/vitejs/vite/blob/main/packages/vite/CHANGELOG.md#600-2024-11-26)

如果你是 Vite 的新用户，我们建议首先阅读 [入门指南](/guide/) 和 [功能介绍](/guide/features) 部分。

我们要感谢超过 [1000 位 Vite Core 贡献者](https://github.com/vitejs/vite/graphs/contributors) 以及 Vite 插件、集成、工具和翻译的维护者和贡献者，他们帮助我们打造了这个新的主要版本。我们也邀请你参与进来，帮助我们改进整个生态系统的 Vite。了解更多信息，请参阅我们的 [贡献指南](https://github.com/vitejs/vite/blob/main/CONTRIBUTING.md)。

如果准备开始的话，我们建议可以帮助 [分类问题](https://github.com/vitejs/vite/issues)、[审查 PR](https://github.com/vitejs/vite/pulls)、根据开放问题发送失败的测试 PR，并在[讨论](https://github.com/vitejs/vite/discussions) 和 Vite Land 的 [帮助论坛](https://discord.com/channels/804011606160703521/1019670660856942652) 中帮助他人。如果你想与我们交流，请加入我们的 [Discord 社区](http://chat.vite.dev/) 并在 [#贡献频道](https://discord.com/channels/804011606160703521/804439875226173480) 中打个招呼。

有关 Vite 生态系统和 Vite Core 的最新消息，请关注我们的 [Bluesky](https://bsky.app/profile/vite.dev)、[X](https://twitter.com/vite_js) 或 [Mastodon](https://webtoo.ls/@vite)。

### 开始使用 Vite 6 {#getting-started-with-vite-6}

你可以使用 `pnpm create vite` 快速搭建一个 Vite 应用，使用你喜欢的框架，或在线体验 Vite 6，访问 [vite.new](https://vite.new)。你还可以运行 `pnpm create vite-extra` 以获取其他框架和运行时（Solid、Deno、SSR 和库起始模板）的模板。当你在 `create vite` 下选择 `Others` 选项时，也可以使用 `create vite-extra` 模板。

Vite 启动模板旨在作为测试 Vite 与不同框架结合的演练场。在构建下一个项目时，你可以试着使用每个框架推荐的启动模板。`create vite` 还提供了一些框架的快捷设置，如 `create-vue`、`Nuxt 3`、`SvelteKit`、`Remix`、`Analog` 和 `Angular`。

### Node.js 支持 {#node-js-support}

Vite 6 与 Vite 5 类似，支持 Node.js 18、20 和 22+。Node.js 21 的支持已被移除。Vite 在旧版本的 Node.js [生命周期终止](https://endoflife.date/nodejs) （EOL）后停止支持。Node.js 18 EOL 在 2025 年 4 月底，届时我们可能会发布一个新主要版本以提高所需的 Node.js 版本。

### 实验性环境 API {#experimental-environment-api}

Vite 正在通过新的环境 API 变得更加灵活。这些新 API 将允许框架作者提供更接近生产环境的开发体验，并为生态系统共享新的构建模块。如果你正在构建一个 SPA，使用 Vite 的单一客户端环境，一切将如以往一样工作。即使对于自定义 SSR 应用，Vite 6 也向后兼容。环境 API 的主要目标受众是框架作者。

对于感兴趣的终端用户，[Sapphi](https://github.com/sapphi-red) 撰写了一篇很好的 [环境 API 介绍](https://green.sapphi.red/blog/increasing-vites-potential-with-the-environment-api) 指南。这是一个很好的起点，帮助你理解我们为何努力使 Vite 更加灵活。

如果你是框架作者或 Vite 插件维护者，并希望利用新 API，你可以在 [环境 API 指南](https://main.vite.dev/guide/api-environment) 中了解更多信息。

我们要感谢所有参与定义和实现新 API 的伙伴。这个故事始于 Vite 2 采用了由 [Rich Harris](https://github.com/Rich-Harris) 和 [SvelteKit](https://svelte.dev/docs/kit) 团队开创的无打包 SSR 开发方案。Vite 的 SSR 转换随后启发了 [Anthony Fu](https://github.com/antfu/) 和 [Pooya Parsa](https://github.com/pi0) 创建 vite-node 并改进 [Nuxt 的开发 SSR 方案](https://antfu.me/posts/dev-ssr-on-nuxt)。Anthony 之后使用 vite-node 为 [Vitest](https://vitest.dev) 提供支持，而 [Vladimir Sheremet](https://github.com/sheremet-va) 在维护 Vitest 的过程中也在不断改进它。2023 年初，Vladimir 开始将 vite-node 上游合并到 Vite Core 中，一年后我们在 Vite 5.1 中将其作为 Runtime API 发布。来自生态系统合作伙伴（特别感谢 Cloudflare 团队）的反馈推动我们对 Vite 的环境进行更雄心勃勃的重构。你可以在 [Patak 的 ViteConf 24 演讲](https://www.youtube.com/watch?v=WImor3HDyqU?si=EZ-rFJn4pDW3tUvp) 中了解更多关于这个故事的信息。

Vite 团队的每个人都参与了新 API 的定义，该 API 是与生态系统中许多项目的反馈共同设计的。感谢所有参与者！如果你正在基于 Vite 构建框架、插件或工具，我们鼓励你参与进来。新 API 是实验性的。我们将与生态系统合作，审查新 API 的使用方式，并在下一个主要版本中稳定它们。如果你想提问或反馈意见，这里有一个 [开放的 GitHub 讨论](https://github.com/vitejs/vite/discussions/16358)。

## 主要变化 {#main-changes}

- [`resolve.conditions` 默认值](/guide/migration#default-value-for-resolve-conditions)
- [JSON 序列化](/guide/migration#json-stringify)
- [在 HTML 元素中扩展对资源引用的支持](/guide/migration#extended-support-of-asset-references-in-html-elements)
- [postcss-load-config](/guide/migration#postcss-load-config)
- [Sass 现在默认使用现代 API](/guide/migration#sass-now-uses-modern-api-by-default)
- [在"库"模式下自定义 CSS 输出文件名](/guide/migration#customize-css-output-file-name-in-library-mode)
- [以及更多仅影响少数用户的更改](/guide/migration#advanced)

此外，还有一个新的 [破坏性变更](/changes/) 页面，列出了 Vite 中所有计划的、正在考虑的和过去的更改。

## 迁移到 Vite 6 {#migrating-to-vite-6}

对于大多数项目，升级到 Vite 6 应该是很直接的，但我们建议在升级前查看 [详细的迁移指南](/guide/migration)。

完整的更改列表请参见 [Vite 6 更新日志](https://github.com/vitejs/vite/blob/main/packages/vite/CHANGELOG.md#500-2024-11-26)。

## 致谢 {#acknowledgments}

Vite 6 的发布离不开我们社区贡献者、下游维护者、插件作者和 [Vite 团队](/team) 的辛勤工作。我们感谢所有支持 Vite 开发的个人和公司。Vite 由 [VoidZero](https://voidzero.dev) 与 [StackBlitz](https://stackblitz.com/)、[Nuxt Labs](https://nuxtlabs.com/) 和 [Astro](https://astro.build) 合作呈现。特别感谢 [Vite 的 GitHub 赞助者](https://github.com/sponsors/vitejs) 和 [Vite 的 Open Collective](https://opencollective.com/vite) 上的赞助者。
