---
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
    details: 灵活的 API 和完整 TypeScript 类型。
footer: MIT Licensed | Copyright © 2019-present Evan You & Vite Contributors
---

<<<<<<< HEAD
<div class="frontpage sponsors">
  <h2>赞助</h2>
  <div class="platinum-sponsors">
    <a v-for="{ href, src, name, id } of sponsors.filter(s => s.tier === 'platinum')" :href="href" target="_blank" rel="noopener" aria-label="sponsor-img">
      <img :src="src" :alt="name" :id="`sponsor-${id}`">
    </a>
  </div>
  <div class="gold-sponsors">
    <a v-for="{ href, src, name, id } of sponsors.filter(s => s.tier !== 'platinum')" :href="href" target="_blank" rel="noopener" aria-label="sponsor-img">
      <img :src="src" :alt="name" :id="`sponsor-${id}`">
    </a>
  </div>
  <a href="https://github.com/sponsors/yyx990803" target="_blank" rel="noopener">在 GitHub 上赞助我们</a>
</div>

<script setup>
import sponsors from './.vitepress/theme/sponsors.json'
import fetchReleaseTag from './.vitepress/theme/fetchReleaseTag.js'

fetchReleaseTag()
=======
<script setup>
import SponsorsGroup from './.vitepress/theme/SponsorsGroup.vue'
>>>>>>> d96df4c2ea369cddfcfffbbec157db8c2580e0bb
</script>

<h3 style="text-align:center;color:#999">Sponsors</h3>

<SponsorsGroup tier="platinum" placement="landing" />

<SponsorsGroup tier="gold" placement="landing" />

<p style="text-align:center;margin-bottom:3em">
  <a style="color: #999;font-size:.9em;" href="https://github.com/sponsors/yyx990803" target="_blank" rel="noopener">Become a sponsor on GitHub</a>
</p>
