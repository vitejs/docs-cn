<script setup lang="ts">
import { VPHomeSponsors } from 'vitepress/theme'
import { useSponsor } from '../composables/sponsor'

const { data } = useSponsor()
</script>

<template>
  <VPHomeSponsors
    v-if="data"
    message="Vite 是免费开源软件，离不开优秀赞助商的支持。"
    action-text="成为赞助商"
    action-link="https://github.com/sponsors/yyx990803"
    :data="data"
  />
</template>
