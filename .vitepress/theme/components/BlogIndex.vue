<script setup lang="ts">
import { data as posts } from '../../../_data/blog.data'

const dateFormatter = new Intl.DateTimeFormat('zh-CN', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  timeZone: 'UTC',
})

function getDateTime(time: number) {
  return new Date(time).toISOString()
}

function formatDate(time: number) {
  return dateFormatter.format(time)
}
</script>

<template>
  <ul class="blog-list">
    <li class="blog-entry" v-for="post of posts">
      <article>
        <time :datetime="getDateTime(post.date.time)">{{
          formatDate(post.date.time)
        }}</time>
        <h2 class="title">
          <a :href="post.url">{{ post.title }}</a>
        </h2>
      </article>
    </li>
  </ul>
</template>

<style scoped>
.blog-list {
  list-style-type: none;
  padding: 0;
}
.blog-entry {
  margin-top: 3em;
  border-bottom: 1px solid var(--vp-c-divider);
}
.blog-entry time {
  font-size: 14px;
}
.title {
  border: none;
  margin-top: 0;
  padding-top: 0;
  font-size: 22px;
}
.title a {
  font-weight: 600;
  text-decoration: none;
}
</style>
