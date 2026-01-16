<script setup>
// these components live in @voidzero-dev/vitepress-theme
import Hero from './Hero.vue'
import ViteFeatureGrid1 from './FeatureGrid1.vue'
import ViteFeatureGrid2 from './FeatureGrid2.vue'
import ViteFrameworks from './Frameworks.vue'
import ViteCommunity from './Community.vue'
import TrustedBy from '@components/oss/TrustedBy.vue'
import HeadingSection from '@components/oss/HeadingSection.vue'
import Sponsors from '@components/oss/Sponsors.vue'
import Spacer from '@components/shared/Spacer.vue'
import Footer from '@components/oss/Footer.vue'
import { useSponsor } from '../composables/sponsor'

const { data: sponsors } = useSponsor()
</script>

<template>
  <Hero />
  <TrustedBy
    :logos="['openai', 'shopify', 'stripe', 'linear', 'clickup', 'wiz']"
  />
  <HeadingSection
    heading="重新诠释开发者体验"
    subheading="Vite 让 Web 开发再次充满乐趣"
  />
  <ViteFeatureGrid1 />
  <HeadingSection heading="共同构建的坚实基础" />
  <ViteFeatureGrid2 />
  <HeadingSection heading="支持你喜爱的框架和工具" />
  <ViteFrameworks />
  <ViteCommunity />
  <Sponsors
    heading="免费 & 开源"
    sponsor-link-text="成为赞助商"
    description="Vite 采用 MIT 许可协议，将始终保持免费开源。这得益于我们的贡献者及以下企业的支持："
   :sponsors="sponsors" />
  <Spacer />
  <Footer
    heading="使用 Vite 开始构建"
    subheading="准备好迎接一个能跟上你思维速度的开发环境"
    button-text="开始"
    button-link="/guide/"
  />
</template>
