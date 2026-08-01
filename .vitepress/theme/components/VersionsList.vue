<script setup lang="ts">
defineProps<{ versions: string[] }>()

function separator(index: number, length: number) {
  if (index === 0) return ''
<<<<<<< HEAD
  return index === length - 1 ? ' 和 ' : ', '
=======
  return index === length - 1 ? ' and ' : ', '
>>>>>>> f20ccf26c18fd25a494324afdb696d2740bd9720
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
