<script setup lang="ts">
import { computed } from 'vue'
import { VPDocAsideSponsors } from 'vitepress/theme'
import { useSponsor } from '../composables/sponsor'

const { data } = useSponsor()

const sponsors = computed(() => {
  return (
    data?.value.map((sponsor) => {
      return {
        size: sponsor.size === 'big' ? 'mini' : 'xmini',
        items: sponsor.items
      }
    }) ?? []
  )
})
</script>

<template>
  <a class="viteconf" href="https://viteconf.org" target="_blank">
    <img width="22" height="22" src="/viteconf.svg" />
    <span>
      <p class="extra-info">免费线上大会</p>
      <p class="heading">ViteConf - 10 月 11 日</p>
      <p class="extra-info">立即领取门票</p>
    </span>
  </a>
  <VPDocAsideSponsors v-if="data" :data="sponsors" />
</template>

<style>
.viteconf {
  margin-top: 1rem;
  margin-bottom: 1rem;
  border-radius: 14px;
  padding-left: 2.5rem;
  padding-top: 0.4rem;
  padding-bottom: 0.4rem;
  position: relative;
  font-size: 1rem;
  font-weight: 700;
  line-height: 1.1rem;
  filter: grayscale(100%);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  background-color: var(--vp-c-bg-alt);
  border: 2px solid var(--vp-c-bg-alt);
  transition: border-color 0.5s;
}
.viteconf:hover {
  filter: grayscale(0%);
  border: 2px solid var(--vp-c-brand-light);
}
.viteconf img {
  position: absolute;
  left: 1.5rem;
  transition: transform 0.5s;
}
.viteconf:hover img {
  transform: scale(1.75);
}

.viteconf:hover .heading {
  background-image: linear-gradient(
    120deg,
    #bd34fe 16%,
    var(--vp-c-brand-light),
    var(--vp-c-brand-light)
  );
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.viteconf .extra-info {
  color: var(--vp-c-text-1);
  opacity: 0;
  font-size: 0.7rem;
  padding-left: 0.1rem;
  transition: opacity 0.5s;
}
.viteconf:hover .extra-info {
  opacity: 0.9;
}
</style>
