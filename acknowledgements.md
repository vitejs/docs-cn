---
title: Acknowledgements
description: Vite is built upon the shoulders of giants. Thank you to all the projects and contributors that make Vite possible.
---

<script setup>
import { computed } from 'vue'
// import { data } from './_data/acknowledgements.data'
import { useSponsor, voidZero } from './.vitepress/theme/composables/sponsor'
import VPSponsors from '@components/vitepress-default/VPSponsors.vue'

const { data: sponsorData } = useSponsor()

const allSponsors = computed(() => {
  if (!sponsorData.value) return []
  return [
    {
      tier: 'Brought to you by',
      size: 'big',
      items: [voidZero],
    },
    ...sponsorData.value,
  ]
})

function npmUrl(name) {
  return `https://www.npmjs.com/package/${name}`
}
</script>

# 致谢 {#acknowledgements}

Vite 的成长离不开众多优秀项目和社区的支持。感谢所有为 Vite 做出贡献的项目、开发者和赞助商！

## 贡献者 {#contributors}

Vite 是由来自世界各地的开发者共同打造的。想了解核心团队成员，请访问 [团队页面](/team)。

特别感谢所有 [GitHub 上的贡献者](https://github.com/vitejs/vite/graphs/contributors)，他们通过提交代码、报告问题、编写文档、翻译内容等各种方式帮助 Vite 不断完善。

## 赞助商 {#sponsors}

Vite 的持续发展离不开众多赞助商的大力支持。如果你也想支持 Vite，可以通过 [GitHub Sponsors](https://github.com/sponsors/vitejs) 或 [Open Collective](https://opencollective.com/vite) 来贡献一份力量。

<div class="sponsors-container">
  <VPSponsors :data="allSponsors" />
</div>

<!--
## 依赖项 {#dependencies}

Vite 依赖于以下众多优秀的开源项目：

### 主要依赖项 {#main-dependencies}

<div class="deps-list notable">
  <div v-for="dep in data.notableDependencies" :key="dep.name" class="dep-item">
    <div class="dep-header">
      <a :href="npmUrl(dep.name)" target="_blank" rel="noopener"><code>{{ dep.name }}</code></a>
      <span class="dep-links">
        <a v-if="dep.repository" :href="dep.repository" target="_blank" rel="noopener" class="dep-link">Repo</a>
        <a v-if="dep.funding" :href="dep.funding" target="_blank" rel="noopener" class="dep-link sponsor">Sponsor</a>
      </span>
    </div>
    <p v-if="dep.author" class="dep-author">
      by <a v-if="dep.authorUrl" :href="dep.authorUrl" target="_blank" rel="noopener">{{ dep.author }}</a><template v-else>{{ dep.author }}</template>
    </p>
    <p v-if="dep.description">{{ dep.description }}</p>
  </div>
</div>

### 集成依赖项作者 {#bundled-dependency-authors}

<table class="authors-table">
  <thead>
    <tr>
      <th>作者</th>
      <th>包名</th>
    </tr>
  </thead>
  <tbody>
    <tr v-for="author in data.authors" :key="author.name">
      <td>
        <a v-if="author.url" :href="author.url" target="_blank" rel="noopener">{{ author.name }}</a>
        <template v-else>{{ author.name }}</template>
        <a v-if="author.funding" :href="author.funding" target="_blank" rel="noopener" class="sponsor-link">Sponsor</a>
      </td>
      <td>
        <template v-for="(pkg, index) in author.packages" :key="pkg.name">
          <span class="pkg-item"><a :href="npmUrl(pkg.name)" target="_blank" rel="noopener"><code>{{ pkg.name }}</code></a><a v-if="pkg.funding" :href="pkg.funding" target="_blank" rel="noopener" class="sponsor-link">Sponsor</a></span><template v-if="index < author.packages.length - 1">, </template>
        </template>
      </td>
    </tr>
  </tbody>
</table>

::: tip 给包作者的提示
本部分是根据每个包 `package.json` 中的 `author` 和 `funding` 字段自动生成的。如果你想更新你的包在此处的显示方式，可以在你的包中更新这些字段。
:::

## 开发工具 {#development-tools}

Vite 的开发工作流程离不开以下这些工具的支持：

<div class="deps-list notable">
  <div v-for="dep in data.devTools" :key="dep.name" class="dep-item">
    <div class="dep-header">
      <a :href="npmUrl(dep.name)" target="_blank" rel="noopener"><code>{{ dep.name }}</code></a>
      <span class="dep-links">
        <a v-if="dep.repository" :href="dep.repository" target="_blank" rel="noopener" class="dep-link">Repo</a>
        <a v-if="dep.funding" :href="dep.funding" target="_blank" rel="noopener" class="dep-link sponsor">Sponsor</a>
      </span>
    </div>
    <p v-if="dep.author" class="dep-author">
      by <a v-if="dep.authorUrl" :href="dep.authorUrl" target="_blank" rel="noopener">{{ dep.author }}</a><template v-else>{{ dep.author }}</template>
    </p>
    <p v-if="dep.description">{{ dep.description }}</p>
  </div>
</div>

## 历史依赖项 {#past-dependencies}

我们也要感谢那些在 Vite 早期版本中使用过的项目的维护者：

<table>
  <thead>
    <tr>
      <th>包名</th>
      <th>描述</th>
      <th>链接</th>
    </tr>
  </thead>
  <tbody>
    <tr v-for="dep in data.pastNotableDependencies" :key="dep.name">
      <td><a :href="npmUrl(dep.name)" target="_blank" rel="noopener"><code>{{ dep.name }}</code></a></td>
      <td>{{ dep.description }}</td>
      <td><a :href="dep.repository" target="_blank" rel="noopener">仓库</a></td>
    </tr>
  </tbody>
</table>
-->

<style scoped>
.deps-list {
  display: grid;
  gap: 1rem;
  margin: 1rem 0;
}

.deps-list.notable {
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
}

.dep-item {
  padding: 1rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
}

.dep-item .dep-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
}

.dep-item a {
  color: var(--vp-c-brand-1);
  text-decoration: none;
}

.dep-item a:hover {
  text-decoration: underline;
}

.dep-item .dep-links {
  display: flex;
  gap: 0.5rem;
}

.dep-item .dep-link {
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  background: var(--vp-c-default-soft);
}

.dep-item .dep-author {
  margin: 0.25rem 0 0;
  color: var(--vp-c-text-2);
  font-size: 0.8rem;
}

.dep-item .dep-link.sponsor {
  background: var(--vp-c-brand-soft);
}

.dep-item p {
  margin: 0.5rem 0 0;
  color: var(--vp-c-text-2);
  font-size: 0.875rem;
}

.authors-table .sponsor-link {
  margin-left: 0.5rem;
  font-size: 0.75rem;
  padding: 0.15rem 0.4rem;
  border-radius: 4px;
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  text-decoration: none;
}

.authors-table .sponsor-link:hover {
  text-decoration: underline;
}
</style>
