import path from 'node:path'
import { writeFileSync } from 'node:fs'
import { Feed } from 'feed'
import type { SiteConfig } from 'vitepress'
import { createContentLoader } from 'vitepress'

const siteUrl = 'https://devsecforge.io'
const blogUrl = `${siteUrl}/blog`

export const buildEnd = async (config: SiteConfig): Promise<void> => {
  const feed = new Feed({
    title: 'DevSecOps Documentation',
    description:
      'Learn DevSecOps through practical guides and examples - Docker, Kubernetes, Security, CI/CD',
    id: blogUrl,
    link: blogUrl,
    language: 'en',
    image: `${siteUrl}/icons/android-chrome-512x512.png`,
    favicon: `${siteUrl}/icons/favicon.ico`,
    copyright: 'Copyright © 2024-Now - Satcom',
    generator: 'VitePress with DevSecOps Documentation',
    feedLinks: {
      rss: `${siteUrl}/blog.rss`,
      atom: `${siteUrl}/blog.atom`,
      json: `${siteUrl}/blog.json`,
    },
    author: {
      name: 'DevSecForge Team',
      email: 'contact@devsecforge.io',
      link: siteUrl,
    },
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
    feed.addItem({
      title: frontmatter.title,
      id: `${siteUrl}${url}`,
      link: `${siteUrl}${url}`,
      description: excerpt,
      content: html,
      author: [
        {
          name: frontmatter.author.name,
        },
      ],
      date: frontmatter.date,
    })
  }

  writeFileSync(path.join(config.outDir, 'blog.rss'), feed.rss2())
  writeFileSync(path.join(config.outDir, 'blog.atom'), feed.atom1())
  writeFileSync(path.join(config.outDir, 'blog.json'), feed.json1())
}
