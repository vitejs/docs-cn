<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, watch } from 'vue'
import { useData } from 'vitepress'

let contentObserver: MutationObserver | undefined
const { isDark } = useData()

function updateAppearanceLabel() {
  if (typeof document === 'undefined') return

  const label = isDark.value
    ? '切换至浅色模式'
    : '切换至深色模式'

  document
    .querySelectorAll<HTMLElement>('.VPSwitchAppearance')
    .forEach((element) => element.setAttribute('title', label))
}

watch(
  isDark,
  () => {
    void nextTick(updateAppearanceLabel)
  },
  { immediate: true },
)

function translateLegacyThemeLabels() {
  const labels = [
    ['.VPSkipLink', '跳转到内容'],
    ['#main-nav-aria-label', '主导航'],
    ['#sidebar-aria-label', '侧边栏导航'],
    ['#doc-outline-aria-label', '当前页面目录'],
  ] as const

  for (const [selector, text] of labels) {
    const element = document.querySelector<HTMLElement>(selector)
    if (element && element.textContent !== text) element.textContent = text
  }

  updateAppearanceLabel()

  document
    .querySelectorAll<HTMLElement>('.DocSearch-Button[aria-label="Search"]')
    .forEach((element) => element.setAttribute('aria-label', '搜索文档'))

  const attributes = [
    ['button.copy[title="Copy Code"]', 'title', '复制代码'],
    ['[aria-label="search icon"]', 'aria-label', '搜索图标'],
    ['[aria-label="edit icon"]', 'aria-label', '编辑图标'],
    ['[aria-label="mobile navigation"]', 'aria-label', '移动端导航'],
    ['[aria-label="up arrow"]', 'aria-label', '向上箭头'],
    ['[aria-label="down arrow"]', 'aria-label', '向下箭头'],
    ['[aria-label="enter"]', 'aria-label', '回车键'],
    ['[aria-label="escape"]', 'aria-label', '退出键'],
  ] as const

  for (const [selector, attribute, value] of attributes) {
    document
      .querySelectorAll<HTMLElement>(selector)
      .forEach((element) => element.setAttribute(attribute, value))
  }

  document
    .querySelectorAll<HTMLElement>('[aria-label^="Permalink to"]')
    .forEach((element) => {
      const label = element.getAttribute('aria-label')
      const target = label?.match(/^Permalink to "(.+)"$/)?.[1]
      if (target) element.setAttribute('aria-label', `链接到“${target}”`)
    })

  const customBlockTitles: Record<string, string> = {
    NOTE: '注意',
    TIP: '提示',
    WARNING: '警告',
    DANGER: '危险',
    INFO: '信息',
    DETAILS: '详情',
  }

  document.querySelectorAll<HTMLElement>('.custom-block-title').forEach((element) => {
    const translation = customBlockTitles[element.textContent?.trim() ?? '']
    if (translation) element.textContent = translation
  })
}

onMounted(() => {
  translateLegacyThemeLabels()
  contentObserver = new MutationObserver(translateLegacyThemeLabels)
  contentObserver.observe(document.body, { childList: true, subtree: true })
})

onUnmounted(() => contentObserver?.disconnect())
</script>

<template>
  <div class="old-document" role="status">
    <p>
      当前页面是 Vite 3 的<strong>历史版本文档</strong>。请前往
      <a href="https://cn.vite.dev" class="new-document-link">cn.vite.dev</a>
      查看最新版本。
    </p>
  </div>
</template>

<style>
:root {
  --vp-layout-top-height: 96px;
}

@media (min-width: 455px) {
  :root {
    --vp-layout-top-height: 64px;
  }
}

@media (min-width: 960px) {
  :root {
    --vp-layout-top-height: 32px;
  }
}

.old-document {
  position: fixed;
  display: flex;
  width: 100%;
  height: var(--vp-layout-top-height);
  padding: 4px 32px;
  align-items: center;
  justify-content: center;
  color: var(--vp-c-text-1);
  text-align: center;
  background: var(--vp-c-brand-lightest);
  z-index: var(--vp-z-index-layout-top);
}

.old-document p {
  margin: 0;
}

.old-document .new-document-link {
  color: var(--vp-c-text-1);
  text-decoration: underline;
}

.old-document .new-document-link:hover {
  color: var(--vp-c-text-2);
}

.dark .old-document {
  background: var(--vp-c-brand-darker);
}
</style>
