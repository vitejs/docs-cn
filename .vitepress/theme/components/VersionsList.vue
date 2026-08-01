<script setup lang="ts">
defineProps<{ versions: string[] }>()

function separator(index: number, length: number) {
  if (index === 0) return ''
  return index === length - 1 ? ' 和 ' : ', '
}
</script>

<template>
  <span
    ><template v-for="(version, index) in versions" :key="version"
      >{{ separator(index, versions.length)
      }}<code>vite@{{ version }}</code></template
    ></span
  >
</template>
