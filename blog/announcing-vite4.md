---
title: Vite 4.0 正式发布！
author:
  name: Vite 团队
date: 2022-12-09
sidebar: false
head:
  - - meta
    - property: og:type
      content: website
  - - meta
    - property: og:title
      content: Vite 4 正式发布
  - - meta
    - property: og:image
      content: https://v6.cn.vite.dev/og-image-announcing-vite4.png
  - - meta
    - property: og:url
      content: https://v6.cn.vite.dev/blog/announcing-vite4
  - - meta
    - property: og:description
      content: Vite 4 发布公告
  - - meta
    - name: twitter:card
      content: summary_large_image
---

# Vite 4.0 正式发布！

_2022 年 12 月 9 日_ - 查看 [Vite 5.0 发布公告](./announcing-vite5.md)

Vite 3 在五个月前[正式发布](./announcing-vite3.md)。此后，npm 每周下载量从 100 万增长到了 250 万。生态系统也日趋成熟并持续扩张。在今年的 [Jamstack Conf 调查](https://twitter.com/vite_js/status/1589665610119585793)中，Vite 在社区中的使用率从 14% 跃升至 32%，满意度则保持在 9.7 的高位。我们见证了 [Astro 1.0](https://astro.build/)、[Nuxt 3](https://v3.nuxtjs.org/) 等由 Vite 驱动的框架发布稳定版本，生态中的创新与协作也在继续：[SvelteKit](https://kit.svelte.dev/)、[Solid Start](https://www.solidjs.com/blog/introducing-solidstart)、[Qwik City](https://qwik.builder.io/qwikcity/overview/)。Storybook 宣布把 Vite 的一等支持作为 [Storybook 7.0](https://storybook.js.org/blog/first-class-vite-support-in-storybook/) 的核心功能之一。Deno 现在也[支持 Vite](https://www.youtube.com/watch?v=Zjojo9wdvmY)。[Vitest](https://vitest.dev) 的采用量快速增长，很快就会达到 Vite npm 下载量的一半。Nx 同样在投入 Vite 生态，并已[正式支持 Vite](https://nx.dev/packages/vite)。

[![Vite 4 生态系统](/ecosystem-vite4.png)](https://viteconf.org/2022/replay)

Vite 及相关项目的发展在 10 月 11 日的 [ViteConf 2022](https://viteconf.org/2022/replay) 得到了集中展示。主流 Web 框架和工具的代表齐聚一堂，分享创新与协作的故事。颇具象征意义的是，Rollup 团队也选择在当天发布 [Rollup 3](https://cn.rollupjs.org)。

今天，Vite [团队](/team)很高兴在生态合作伙伴的帮助下宣布 Vite 4 正式发布，其构建阶段由 Rollup 3 驱动。我们一直与生态系统协作，确保新的主版本拥有顺畅的升级路径。Vite 现在使用 [Rollup 3](https://github.com/vitejs/vite/issues/9870)，这让我们得以简化 Vite 内部的资源处理，并带来许多改进。详情可查看 [Rollup 3 发布说明](https://github.com/rollup/rollup/releases/tag/v3.0.0)。

![Vite 4 发布封面图](/og-image-announcing-vite4.png)

快速链接：

- [文档](/)
- [迁移指南](https://v4.vite.dev/guide/migration.html)
- [变更日志](https://github.com/vitejs/vite/blob/v6/packages/vite/CHANGELOG.md#400-2022-12-09)

其他语言的文档：

- [简体中文](/)
- [日本語](https://ja.vite.dev/)
- [Español](https://es.vite.dev/)

如果你刚开始使用 Vite，建议先阅读[为什么选择 Vite](/guide/why)、[开始](/guide/)和[功能](/guide/features)指南，了解 Vite 开箱即用的能力。如果你想参与贡献，欢迎前往 [GitHub](https://github.com/vitejs/vite)。已有近 [700 位贡献者](https://github.com/vitejs/vite/graphs/contributors)帮助改进 Vite。你可以在 [Twitter](https://twitter.com/vite_js) 和 [Mastodon](https://webtoo.ls/@vite) 上关注动态，或在 [Discord 社区](https://chat.vite.dev/)与其他开发者交流。

## 开始体验 Vite 4

运行 `pnpm create vite`，即可使用你偏好的框架搭建 Vite 项目；也可以通过 [vite.new](https://vite.new) 在线打开入门模板并体验 Vite 4。

你还可以运行 `pnpm create vite-extra`，获取其他框架和运行时的模板，包括 Solid、Deno、SSR 和库模板。在 `create vite` 中选择 `Others` 时，同样可以使用 `create vite-extra` 模板。

请注意，Vite 入门模板的定位是用于测试不同框架的最小化演练项目。构建正式项目时，我们建议采用各框架推荐的脚手架。一些框架也会从 `create vite` 跳转到自己的脚手架，例如 Vue 的 `create-vue` 和 Nuxt 3，以及 Svelte 的 SvelteKit。

## 开发阶段使用 SWC 的新 React 插件

[SWC](https://swc.rs/) 已经成为 [Babel](https://babeljs.io/) 的成熟替代方案，尤其适合 React 项目。SWC 的 React Fast Refresh 实现比 Babel 快得多，对部分项目而言已经是更好的选择。从 Vite 4 开始，React 项目可以使用两种权衡不同的插件。我们认为目前两种方案都值得支持，并会继续探索对它们的改进。

### @vitejs/plugin-react

[@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react) 使用 esbuild 和 Babel，在保持较小包体积和快速 HMR 的同时，也保留了使用 Babel 转换流水线的灵活性。

### @vitejs/plugin-react-swc（新增）

[@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) 在构建期间使用 esbuild，在开发期间则用 SWC 替代 Babel。对于不需要非标准 React 扩展的大型项目，它能显著缩短冷启动和模块热替换（HMR）时间。

## 浏览器兼容性

现代浏览器构建现在默认以 `safari14` 为目标，从而提供更广泛的 ES2020 兼容性。这意味着现代构建可以使用 [`BigInt`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/BigInt)，并且不再转译[空值合并运算符](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing)。如果需要支持更旧的浏览器，仍可照常添加 [`@vitejs/plugin-legacy`](https://github.com/vitejs/vite/tree/v6/packages/plugin-legacy)。

## 将 CSS 导入为字符串

在 Vite 3 中，导入 `.css` 文件的默认导出可能导致 CSS 被加载两次。

```ts
import cssString from './global.css'
```

这是因为构建会生成一个 `.css` 文件，而应用代码也可能使用对应的 CSS 字符串，例如由框架运行时将其注入页面。从 Vite 4 开始，`.css` 默认导出[已被弃用](https://github.com/vitejs/vite/issues/11094)。此时应使用 `?inline` 查询后缀，因为这种方式不会额外生成导入的 `.css` 样式文件。

```ts
import stuff from './global.css?inline'
```

更多信息请参阅[迁移指南](https://v4.vite.dev/guide/migration.html)。

## 环境变量

Vite 现在使用 `dotenv` 16 和 `dotenv-expand` 9，此前分别为 `dotenv` 14 和 `dotenv-expand` 5。如果值中包含 `#` 或 `` ` ``，需要用引号将其包裹起来。

```diff
-VITE_APP=ab#cd`ef
+VITE_APP="ab#cd`ef"
```

更多细节请参阅 [`dotenv`](https://github.com/motdotla/dotenv/blob/master/CHANGELOG.md) 和 [`dotenv-expand` 变更日志](https://github.com/motdotla/dotenv-expand/blob/master/CHANGELOG.md)。

## 其他功能

- CLI 快捷键，在开发服务器中按 `h` 可查看全部快捷键（[#11228](https://github.com/vitejs/vite/pull/11228)）
- 预构建依赖时支持 patch-package（[#10286](https://github.com/vitejs/vite/issues/10286)）
- 更清晰的构建日志（[#10895](https://github.com/vitejs/vite/issues/10895)），并改用 `kB` 以便与浏览器开发工具保持一致（[#10982](https://github.com/vitejs/vite/issues/10982)）
- 改进 SSR 期间的错误消息（[#11156](https://github.com/vitejs/vite/issues/11156)）

## 缩小包体积

Vite 很重视自身的体积，尤其希望加快文档演练项目和问题复现项目的安装速度。这个主版本再次减小了 Vite 的包体积：Vite 4 的安装体积比 Vite 3.2.5 小 23%，从 18.3 MB 降至 14.1 MB。

## Vite Core 的改进

[Vite Core](https://github.com/vitejs/vite) 和 [vite-ecosystem-ci](https://github.com/vitejs/vite-ecosystem-ci) 持续演进，为维护者和贡献者提供更好的体验，也让 Vite 的开发能力能够随生态系统共同扩展。

### 将框架插件移出核心仓库

从 Vite 的早期版本开始，[`@vitejs/plugin-vue`](https://github.com/vitejs/vite-plugin-vue) 和 [`@vitejs/plugin-react`](https://github.com/vitejs/vite-plugin-react) 就一直位于 Vite Core monorepo 中。这样，在修改 Vite 时可以同时测试并发布核心和插件，形成紧密的反馈循环。现在借助 [vite-ecosystem-ci](https://github.com/vitejs/vite-ecosystem-ci)，独立仓库中的插件也能提供这种反馈。因此从 Vite 4 开始，[这些插件已移出 Vite Core monorepo](https://github.com/vitejs/vite/pull/11158)。这一步强化了 Vite 与框架无关的定位，也让我们可以建立独立团队维护各个插件。今后若要报告 bug 或请求功能，请前往新的仓库提交 issue：[`vitejs/vite-plugin-vue`](https://github.com/vitejs/vite-plugin-vue) 和 [`vitejs/vite-plugin-react`](https://github.com/vitejs/vite-plugin-react)。

### vite-ecosystem-ci 改进

[vite-ecosystem-ci](https://github.com/vitejs/vite-ecosystem-ci) 扩展了 Vite 的 CI，可按需报告[大多数重要下游项目](https://github.com/vitejs/vite-ecosystem-ci/tree/main/tests)的 CI 状态。我们每周三次针对 Vite 的 `main` 分支运行 vite-ecosystem-ci，以便在引入回归之前及时获得报告。大多数使用 Vite 的项目已准备好所需分支，并将在未来几天发布兼容版本。我们还可以在 PR 评论中使用 `/ecosystem-ci run` 按需运行它，在变更进入 `main` 之前了解其[影响](https://github.com/vitejs/vite/pull/11269#issuecomment-1343365064)。

## 致谢

没有 Vite 贡献者投入的无数时间，没有众多下游项目和插件维护者以及 [Vite 团队](/team)的努力，就不会有 Vite 4。大家共同协作，再次改善了所有使用 Vite 的框架和应用的开发体验。我们很高兴能够为这个充满活力的生态系统持续改进共同基础。

我们也感谢赞助 Vite 团队的个人与公司，以及直接投资 Vite 未来的企业：[@antfu7](https://twitter.com/antfu7) 在 Vite 及其生态中的部分工作由 [Nuxt Labs](https://nuxtlabs.com/) 支持；[Astro](https://astro.build) 资助 [@bluwyoo](https://twitter.com/bluwyoo) 在 Vite Core 上的工作；[StackBlitz](https://stackblitz.com/) 聘请 [@patak_dev](https://twitter.com/patak_dev) 全职参与 Vite。

## 后续计划

我们近期会专注于梳理新提交的 issue，避免潜在回归造成干扰。如果你想参与并帮助改进 Vite，建议从 issue 分类开始。加入[我们的 Discord](https://chat.vite.dev)，在 `#contributing` 频道联系我们，也可以完善 `#docs` 文档，并在 `#help` 中帮助其他人。随着 Vite 的采用继续增长，我们需要为下一批用户持续建设友好且乐于助人的社区。

为了继续改善所有选择 Vite 来驱动框架和开发应用的用户体验，还有许多方向值得推进。继续前进！
