<script setup lang="ts">
import { useReleaseTag } from '../../utils/useReleaseTag'

const { releaseTag } = useReleaseTag()
</script>

<template>
  <a
    v-if="releaseTag"
    class="VPNavBarReleaseLink link"
    href="https://github.com/vitejs/docs-cn/releases"
    target="_blank"
    tabindex="0"
  >
    <span>{{ releaseTag }}</span>
  </a>
</template>

<style scoped>
.VPNavBarReleaseLink {
  display: flex;
  align-items: center;
  padding: 0 12px;
  line-height: var(--vp-nav-height);
  font-size: 14px;
  font-weight: 500;
  color: var(--vp-c-text-1);
  transition: color 0.25s;
  cursor: pointer;
}
</style>
