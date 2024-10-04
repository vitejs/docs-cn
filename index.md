---
title: Vite
<<<<<<< HEAD
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
    - theme: brand
      text: ⚡ ViteConf 24!
      link: https://viteconf.org/?utm=vite-homepage

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

<script setup>
import { onMounted } from 'vue'
import { fetchReleaseTag } from './.vitepress/utils/fetchReleaseTag.js'

onMounted(() => {
  const urlParams = new URLSearchParams(window.location.search)
  if (urlParams.get('uwu') != null) {
    const img = document.querySelector('.VPHero .VPImage.image-src')
    img.src = '/logo-uwu.png'
    img.alt = 'Vite Kawaii Logo by @icarusgkx'
  }

  fetchReleaseTag()
})
=======
titleTemplate: Next Generation Frontend Tooling
pageClass: landing dark

layout: home
aside: false
editLink: false
markdownStyles: false
---

<script setup>
import Hero from '.vitepress/theme/components/landing/1. hero-section/HeroSection.vue'
import FeatureSection from './.vitepress/theme/components/landing/2. feature-section/FeatureSection.vue'
import FrameworksSection from './.vitepress/theme/components/landing/3. frameworks-section/FrameworksSection.vue'
import CommunitySection from './.vitepress/theme/components/landing/4. community-section/CommunitySection.vue'
import SponsorSection from './.vitepress/theme/components/landing/5. sponsor-section/SponsorSection.vue'
import GetStartedSection from '.vitepress/theme/components/landing/6. get-started-section/GetStartedSection.vue'
import FeatureInstantServerStart from './.vitepress/theme/components/landing/2. feature-section/FeatureInstantServerStart.vue'
import FeatureHMR from './.vitepress/theme/components/landing/2. feature-section/FeatureHMR.vue'
import FeatureRichFeatures from './.vitepress/theme/components/landing/2. feature-section/FeatureRichFeatures.vue'
import FeatureOptimizedBuild from './.vitepress/theme/components/landing/2. feature-section/FeatureOptimizedBuild.vue'
import FeatureFlexiblePlugins from './.vitepress/theme/components/landing/2. feature-section/FeatureFlexiblePlugins.vue'
import FeatureTypedAPI from './.vitepress/theme/components/landing/2. feature-section/FeatureTypedAPI.vue'
import FeatureSSRSupport from './.vitepress/theme/components/landing/2. feature-section/FeatureSSRSupport.vue'
import FeatureCI from './.vitepress/theme/components/landing/2. feature-section/FeatureCI.vue'
>>>>>>> e6572f5dbcc9f890cad963a999caf9fe1aeb501b
</script>

<div class="VPHome">
  <Hero/>
  <FeatureSection title="Redefining developer experience" description="Vite makes web development simple again" type="blue">
    <FeatureInstantServerStart />
    <FeatureHMR />
    <FeatureRichFeatures />
    <FeatureOptimizedBuild />
  </FeatureSection>
  <FeatureSection title="A shared foundation to build upon" type="pink" class="feature-section--flip">
    <FeatureFlexiblePlugins />
    <FeatureTypedAPI />
    <FeatureSSRSupport />
    <FeatureCI />
  </FeatureSection>
  <FrameworksSection />
  <CommunitySection />
  <SponsorSection />
  <GetStartedSection />
</div>
