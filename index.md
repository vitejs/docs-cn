---
<<<<<<< HEAD
home: true
heroImage: /logo.svg
actionText: 开始
actionLink: /guide/

altActionText: 了解更多
altActionLink: /guide/why

features:
  - title: 💡 极速的服务启动
    details: 使用原生 ESM 文件，无需打包!
  - title: ⚡️ 轻量快速的热重载
    details: 无论应用程序大小如何，都始终极快的模块热重载（HMR）
  - title: 🛠️ 丰富的功能
    details: 对 TypeScript、JSX、CSS 等支持开箱即用。
  - title: 📦 优化的构建
    details: 可选 “多页应用” 或 “库” 模式的预配置 Rollup 构建
  - title: 🔩 通用的插件
    details: 在开发和构建之间共享 Rollup-superset 插件接口。
  - title: 🔑 完全类型化的API
    details: 灵活的 API 和完整的 TypeScript 类型。
footer: MIT Licensed | Copyright © 2019-present Evan You & Vite Contributors
---

<script setup>
import SponsorsGroup from './.vitepress/theme/SponsorsGroup.vue'
import fetchReleaseTag from './.vitepress/theme/fetchReleaseTag.js'

fetchReleaseTag();
</script>

<h3 style="text-align:center;color:#999">Sponsors</h3>

<SponsorsGroup tier="platinum" placement="landing" />

<SponsorsGroup tier="gold" placement="landing" />

<p style="text-align:center;margin-bottom:3em">
  <a style="color: #999;font-size:.9em;" href="https://github.com/sponsors/yyx990803" target="_blank" rel="noopener">Become a sponsor on GitHub</a>
</p>
=======
layout: home

hero:
  name: Vite
  text: Next Generation Frontend Tooling
  tagline: Get ready for a development environment that can finally catch up with you.
  actions:
    - theme: brand
      text: Get Started
      link: /guide/why
    - theme: alt
      text: Why Vite?
      link: /guide/
    - theme: alt
      text: View on GitHub
      link: https://github.com/vitejs/vite

features:
  - icon: 💡
    title: Instant Server Start
    details: On demand file serving over native ESM, no bundling required!
  - icon: ⚡️
    title: Lightning Fast HMR
    details: Hot Module Replacement (HMR) that stays fast regardless of app size.
  - icon: 🛠️
    title: Rich Features
    details: Out-of-the-box support for TypeScript, JSX, CSS and more.
  - icon: 📦
    title: Optimized Build
    details: Pre-configured Rollup build with multi-page and library mode support.
  - icon: 🔩
    title: Universal Plugins
    details: Rollup-superset plugin interface shared between dev and build.
  - icon: 🔑
    title: Fully Typed APIs
    details: Flexible programmatic APIs with full TypeScript typing.
---
>>>>>>> c0caf9ed4640e9085539ac5d9fd418f352ed291c
