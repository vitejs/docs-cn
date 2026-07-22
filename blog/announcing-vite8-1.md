---
title: Vite 8.1 is out!
author:
  name: The Vite Team
date: 2026-06-23
sidebar: false
head:
  - - meta
    - property: og:type
      content: website
  - - meta
    - property: og:title
      content: Announcing Vite 8.1
  - - meta
    - property: og:image
      content: https://vite.dev/og-image-announcing-vite8-1.webp
  - - meta
    - property: og:url
      content: https://vite.dev/blog/announcing-vite8-1
  - - meta
    - property: og:description
      content: Vite 8.1 Release Announcement

  - - meta
    - name: twitter:card
      content: summary_large_image
---

# Vite 8.1 发布了！{#vite-8-1-is-out}

_2026年6月23日_

![Vite 8.1 发布公告封面图](/og-image-announcing-vite8-1.webp)

Vite 8 已于今年 3 月 [正式发布](./announcing-vite8.md)，它采用由 [Rolldown](https://rolldown.rs/) 驱动的单一统一打包工具，为后续改进打开了大门。Vite 目前每周下载量已达到 4160 万次，几乎追平 Vite 7 的总下载量。在解决升级回归问题的同时，我们也一直致力于开发新功能。现在，我们很高兴地宣布 Vite 8.1 正式发布。

快速链接：

- [英文文档](https://vite.dev/)
- 翻译版本：[简体中文](/)、[日本語](https://ja.vite.dev/)、[Español](https://es.vite.dev/)、[Português](https://pt.vite.dev/)、[한국어](https://ko.vite.dev/)、[Deutsch](https://de.vite.dev/)、[فارسی](https://fa.vite.dev/)
- [GitHub 更新日志](https://github.com/vitejs/vite/blob/main/packages/vite/CHANGELOG.md)

可通过 [vite.new](https://vite.new) 在线体验 Vite 8.1，或运行 `pnpm create vite`，使用你喜欢的框架在本地搭建 Vite 应用。更多信息请参阅 [入门指南](/guide/)。

我们诚邀你帮助我们改进 Vite（加入超过 [1.2K 位 Vite Core 贡献者](https://github.com/vitejs/vite/graphs/contributors)）、我们的依赖项、插件以及生态系统中的项目。更多信息请参阅 [贡献指南](https://github.com/vitejs/vite/blob/main/CONTRIBUTING.md)。你可以从 [整理 issue](https://github.com/vitejs/vite/issues)、[审阅 PR](https://github.com/vitejs/vite/pulls)、针对未解决的 issue 提交测试 PR，以及在 [Discussions](https://github.com/vitejs/vite/discussions) 或 Vite Land 的 [帮助论坛](https://discord.com/channels/804011606160703521/1019670660856942652) 中帮助他人开始参与。如有疑问，欢迎加入我们的 [Discord 社区](https://chat.vite.dev)，并在 [#contributing 频道](https://discord.com/channels/804011606160703521/804439875226173480) 与我们交流。

欢迎在 [Bluesky](https://bsky.app/profile/vite.dev)、[X](https://twitter.com/vite_js) 或 [Mastodon](https://webtoo.ls/@vite) 上关注我们，及时了解最新动态，并与其他基于 Vite 构建项目的开发者保持联系。

## 功能 {#features}

### 实验性的打包开发模式 {#experimental-bundled-dev-mode}

现在已经可以使用实验性的打包开发模式。该模式此前称为“全量打包模式”（Full Bundle Mode），旨在提升因模块数量过多而出现性能问题的大型应用的开发性能。

在初步测试中，一个加载 10,000 个 React 组件的应用使用打包开发模式后，启动速度约为非打包开发服务器的 15 倍，整页重新加载速度约为 10 倍，同时无论应用规模多大，HMR 都能保持即时响应。真实应用的早期测试也展现了类似的提升：Linear 团队观察到冷启动渲染速度最高提升 3 倍，整页重新加载速度提升约 40%，网络请求数量减少到原来的十分之一。

::: details 为什么需要打包开发模式？

Vite 以非打包开发服务器方案而闻名，这也是 Vite 刚推出时速度出众并广受欢迎的主要原因之一。该方案最初是一项实验，旨在探索不采用传统打包方式时，开发服务器的性能极限究竟能推进到什么程度。

然而，随着项目规模和复杂度不断增长，Vite 的非打包开发方案在开发期间可能出现性能下降。由于每个模块都需要单独获取，浏览器必须处理大量请求，从而增加启动和刷新开销。这一影响在大型应用中尤为明显；当开发者还需要经过网络代理时，问题会更加严重，导致刷新变慢，开发体验下降。

打包开发模式不仅会在生产环境中提供打包后的文件，也会在开发期间这样做，从而兼得两种方案的优势：

- 即使是大型应用也能快速启动
- 降低页面刷新时的网络开销
- 在 ESM 输出之上保持高效的 HMR

:::

目前，该模式主要支持浏览器端、基础插件和核心功能。第三方插件或部分次要功能可能尚无法在此模式下工作。我们正在扩大支持范围，并准备一份文档来说明插件端可能需要的改动。有关路线图的更多详情，请参阅 [设计文档](https://github.com/vitejs/vite/discussions/22746)。

要启用此模式，可以传入 `--experimental-bundle`，或在 `vite.config.js` 中添加 `experimental.bundledDev: true`：

```ts [vite.config.js]
import { defineConfig } from 'vite'

export default defineConfig({
  experimental: {
    bundledDev: true,
  },
})
```

欢迎在 [讨论帖](https://github.com/vitejs/vite/discussions/22747) 中分享反馈。

### 实验性的代码块导入映射 {#experimental-chunk-import-map}

在输出产物中，代码块的导入语句会包含该代码块的哈希，以确保代码块内容发生变化时加载新版本。但这也会导致导入已更改代码块的其他代码块随之改变哈希，并将变化级联到所有传递导入该代码块的代码块。

```dot
digraph chunk_hash_cascade {
  rankdir=TB
  node [shape=box style="rounded,filled" fontname="Arial" fontsize=11 margin="0.25,0.12" fontcolor="${#3c3c43|#ffffff}" color="${#c2c2c4|#3c3f44}"]
  edge [color="${#67676c|#98989f}" fontname="Arial" fontsize=10 fontcolor="${#67676c|#98989f}"]
  bgcolor="transparent"

  utils [label="utils.[e5f6 → 88xx].js\n内容已编辑" fillcolor="${#fcf4dc|#38301a}" color="${#e0a800|#d4a72c}"]
  page  [label="page.[c3d4 → 77yy].js\n因级联重新计算哈希" fillcolor="${#fde8e8|#3a1f22}" color="${#d5393e|#f66f81}"]
  entry [label="entry.[a1b2 → 99zz].js\n因级联重新计算哈希" fillcolor="${#fde8e8|#3a1f22}" color="${#d5393e|#f66f81}"]

  entry -> page  [label="  导入（嵌入哈希）\l" color="${#d5393e|#f66f81}" fontcolor="${#d5393e|#f66f81}"]
  page  -> utils [label="  导入（嵌入哈希）\l" color="${#d5393e|#f66f81}" fontcolor="${#d5393e|#f66f81}"]
}
```

实验性的代码块导入映射功能利用导入映射解决了此问题，并提高缓存效率。该功能构建于 [Rolldown 的相应功能](https://rolldown.rs/reference/InputOptions.experimental#chunkimportmap) 之上，同时增加了对 Vite 特有功能的支持。衷心感谢 [Taisei Mima](https://github.com/bhbs) 对此功能的研究与初始实现！

请注意，`experimental.renderBuiltUrl` 目前无法与此选项同时使用。

更多详情请参阅 [功能指南](/guide/features#chunk-import-map-optimization) 和 [选项文档](/config/build-options#build-chunkimportmap)。欢迎在 [讨论帖](https://github.com/vitejs/vite/discussions/22703) 中分享反馈。

### 支持 Wasm ESM 集成 {#wasm-esm-integration-support}

Vite 现已支持 [Wasm ESM 集成提案](https://github.com/WebAssembly/esm-integration/blob/main/proposals/esm-integration/README.md)。现在可以直接导入 wasm 文件并使用其导出的函数：

```ts
import { add } from './add.wasm'

console.log(add(1, 2)) // 3
```

衷心感谢 [Menci](https://github.com/Menci) 在提案早期创建并维护 vite-plugin-wasm，以及将相关实现贡献到 Vite 核心！

更多详情请参阅 [功能指南](/guide/features#esm-integration)。

### 向默认使用 Lightning CSS 再进一步 {#one-step-closer-to-use-lightning-css-by-default}

我们与 Lightning CSS 团队合作，补充了 PostCSS 已支持但 Lightning CSS 尚缺少的功能。Vite 8.1 现在具备以下两项功能：

- 允许在 CSS 文件中导入外部 CSS 文件（[lightningcss#479](https://github.com/parcel-bundler/lightningcss/issues/479)）
- 允许插件注册文件依赖（[lightningcss#877](https://github.com/parcel-bundler/lightningcss/issues/877)）

我们正在考虑在下一个主要版本中将默认 CSS 转换器改为 Lightning CSS。请通过设置 [`css.transformer: 'lightningcss'`](/config/shared-options#css-transformer) 试用，并在 [讨论帖](https://github.com/vitejs/vite/discussions/13835) 中分享反馈。

### `import.meta.glob` 不区分大小写匹配 {#case-insensitive-matching-for-import-meta-glob}

`import.meta.glob` 现在支持通过 `caseSensitive` 选项以不区分大小写的方式匹配文件。

```ts
// 匹配 ./dir/Module1.js
const modules = import.meta.glob('./dir/module*.js', {
  caseSensitive: false,
})
```

### 发现自定义 HTML 元素和属性中的资源 {#asset-discovery-for-custom-html-elements-and-attributes}

此前，Vite 只能发现预定义元素和属性中的资源。现在，可以使用 [`html.additionalAssetSources`](/config/shared-options#html-additionalassetsources) 选项添加更多元素和属性。

```html
<html-import src="./some/other/file.html"></html-import>
<img
  src="/layout-default.png"
  data-src-dark="/layout-dark.png"
  data-src-light="/layout-light.png"
/>
```

```ts [vite.config.js]
import { defineConfig } from 'vite'

export default defineConfig({
  html: {
    additionalAssetSources: {
      'html-import': {
        srcAttributes: ['src'],
      },
      img: {
        srcAttributes: ['data-src-dark', 'data-src-light'],
      },
    },
  },
})
```

## 其他变更 {#other-changes}

其他功能与问题修复请参阅 [更新日志](https://github.com/vitejs/vite/blob/v8.1.0/packages/vite/CHANGELOG.md)。

## 致谢 {#acknowledgments}

Vite 8.1 的发布离不开社区贡献者、生态系统维护者和 [Vite 团队](/team) 的共同努力。Vite 由 [VoidZero](https://voidzero.dev) 联合 [Bolt](https://bolt.new/) 与 [Nuxt Labs](https://nuxtlabs.com/) 为你带来。我们还要感谢通过 [Vite GitHub Sponsors](https://github.com/sponsors/vitejs) 和 [Vite Open Collective](https://opencollective.com/vite) 支持我们的赞助者。
