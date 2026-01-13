---
title: Vite
<<<<<<< HEAD
titleTemplate: 下一代的前端工具链
# add `dark` here to apply dark mode on initial load,
# since `onMounted` doesn't run during SSR
pageClass: landing dark

=======
titleTemplate: Next Generation Frontend Tooling
>>>>>>> 7f01a8e976d17c5107c79e80c3c6847f589ab7fa
layout: home
theme: dark
---

<script setup>
import Home from './.vitepress/theme/landing/Layout.vue'
</script>

<<<<<<< HEAD
<div class="VPHome">
  <Hero/>
  <FeatureSection title="重新诠释开发者体验" description="Vite 让 Web 开发重回简单" type="blue">
    <FeatureInstantServerStart />
    <FeatureHMR />
    <FeatureRichFeatures />
    <FeatureOptimizedBuild />
  </FeatureSection>
  <FeatureSection title="共同构建的坚实基础" type="pink" class="feature-section--flip">
    <FeatureFlexiblePlugins />
    <FeatureTypedAPI />
    <FeatureSSRSupport />
    <FeatureCI />
  </FeatureSection>
  <FrameworksSection />
  <CommunitySection />
  <SponsorSection />
  <GetStartedSection />
</div>
=======
<Home />
>>>>>>> 7f01a8e976d17c5107c79e80c3c6847f589ab7fa
