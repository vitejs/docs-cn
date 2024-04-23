---
layout: home

title: Vite
titleTemplate: 下一代的前端工具链

hero:
  name: Vite
  text: 下一代的前端工具链
  tagline: 为开发提供极速响应
  image:
    src: /logo-with-shadow.png
    alt: Vite
  actions:
    - theme: brand
      text: 开始
      link: /guide/
    - theme: alt
      text: 为什么选 Vite？
      link: /guide/why
    - theme: alt
      text: 在 GitHub 上查看
      link: https://github.com/vitejs/vite
    - theme: alt
      text: 📅 Vite Meetup SF
      link: https://lu.ma/vite

features:
  - icon: 💡
    title: 极速的服务启动
    details: 使用原生 ESM 文件，无需打包!
  - icon: ⚡️
    title: 轻量快速的热重载
    details: 无论应用程序大小如何，都始终极快的模块热替换（HMR）
  - icon: 🛠️
    title: 丰富的功能
    details: 对 TypeScript、JSX、CSS 等支持开箱即用。
  - icon: 📦
    title: 优化的构建
    details: 可选 “多页应用” 或 “库” 模式的预配置 Rollup 构建
  - icon: 🔩
    title: 通用的插件
    details: 在开发和构建之间共享 Rollup-superset 插件接口。
  - icon: 🔑
    title: 完全类型化的API
    details: 灵活的 API 和完整的 TypeScript 类型。
---

<<<<<<< HEAD
<script setup>
import { onMounted } from 'vue'
import { fetchReleaseTag } from './.vitepress/utils/fetchReleaseTag.js'

onMounted(() => {
  fetchReleaseTag()
})
</script>
=======
<style>
.VPButton.alt[href="https://lu.ma/vite"] {
  background: var(--vp-home-hero-name-background);
  border: none;
  padding: 1px 21px;
  color: #fff !important;
}
</style>
>>>>>>> ebfa5935341a0787f39d6c6275758734edee32dd
