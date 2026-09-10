<script setup>
import Footer from '@components/oss/Footer.vue'
import Events from './Events.vue'
import Hero from './Hero.vue'
import TimeoutSwitcher from './TimeoutSwitcher.vue'
import Timer from './Timer.vue'
import VideoIframe from './VideoIframe.vue'
const startTime = '2026-03-19T15:00:00.000Z'
</script>

<template>
  <TimeoutSwitcher :at="startTime">
    <template #default>
      <Hero />
      <Timer :at="startTime" />
    </template>
    <template #timeout>
      <VideoIframe :at="startTime" />
    </template>
  </TimeoutSwitcher>
  <TimeoutSwitcher :at="startTime">
    <template #default>
      <Events />
    </template>
  </TimeoutSwitcher>
  <Footer
    heading="使用 Vite 开始构建"
    subheading="准备好迎接一个能跟上你思维速度的开发环境"
    button-text="快速开始"
    button-link="/guide/"
  />
</template>
