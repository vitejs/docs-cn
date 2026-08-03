<template>
  <div class="old-document" role="status">
    <p>
      当前页面是 Vite 5 的<strong>历史版本文档</strong>。请前往
      <a href="https://cn.vite.dev" class="new-document-link">cn.vite.dev</a>
      查看最新版本。
    </p>
  </div>
</template>

<style>
:root {
  --vp-layout-top-height: 96px;

  @media (min-width: 455px) {
    --vp-layout-top-height: 64px;
  }

  @media (min-width: 960px) {
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
