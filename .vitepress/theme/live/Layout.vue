<script setup>
import Hero from './Hero.vue'
import Timer from './Timer.vue'
import TimeoutSwitcher from './TimeoutSwitcher.vue'
import VideoIframe from './VideoIframe.vue'
import Events from './Events.vue'
import Footer from '@components/oss/Footer.vue'
</script>

<template>
  <TimeoutSwitcher at="2026-03-19T15:00:00.000Z">
    <template #default>
      <Hero />
      <Timer at="2026-03-19T15:00:00.000Z" />
    </template>
    <template #timeout>
      <VideoIframe />
    </template>
  </TimeoutSwitcher>
  <Events />
  <Footer
    heading="使用 Vite 开始构建"
    subheading="准备好迎接一个能跟上你思维速度的开发环境"
    button-text="快速开始"
    button-link="/guide/"
  />
</template>
