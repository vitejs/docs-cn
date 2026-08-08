import path from 'node:path'
import { writeFileSync } from 'node:fs'
import { Feed } from 'feed'
import type { SiteConfig } from 'vitepress'
import { createContentLoader } from 'vitepress'

const siteUrl = 'https://v4.cn.vite.dev'
const blogUrl = `${siteUrl}/blog`

export async function buildEnd(config: SiteConfig): Promise<void> {
  const feed = new Feed({
    title: 'Vite 4 官方中文文档',
    description: 'Vite 4 历史版本官方中文文档',
    id: blogUrl,
    link: blogUrl,
    language: 'zh-CN',
    image: `${siteUrl}/og-image.png`,
    favicon: `${siteUrl}/logo.svg`,
    copyright: 'Copyright © 2019-present Evan You & Vite Contributors',
  })

  const posts = await createContentLoader('blog/*.md', {
    excerpt: true,
    render: true,
  }).load()

  posts.sort(
    (a, b) =>
      +new Date(b.frontmatter.date as string) -
      +new Date(a.frontmatter.date as string),
  )

  for (const { url, excerpt, frontmatter, html } of posts) {
    const author = frontmatter.author?.name ?? frontmatter.author ?? 'Vite 团队'

    feed.addItem({
      title: frontmatter.title,
      id: `${siteUrl}${url}`,
      link: `${siteUrl}${url}`,
      description: excerpt,
      content: html,
      author: [{ name: author }],
      date: new Date(frontmatter.date),
    })
  }

  writeFileSync(path.join(config.outDir, 'blog.rss'), feed.rss2())
}
