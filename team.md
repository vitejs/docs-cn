---
layout: page
title: Meet the Team
description: The development of Vite is guided by an international team.
---

<script setup>
import {
  VPTeamPage,
  VPTeamPageTitle,
  VPTeamPageSection,
  VPTeamMembers
} from '@voidzero-dev/vitepress-theme'
import { core, advisors, emeriti, cnTranslator } from './_data/team'
</script>

<VPTeamPage>
  <VPTeamPageTitle>
    <template #title>认识我们的团队</template>
    <template #lead>
      Vite 目前由一个国际化的团队开发和维护，<br>
      下面是对一些团队成员的介绍。
    </template>
  </VPTeamPageTitle>
  <VPTeamMembers :members="core" />
  <VPTeamPageSection>
    <template #title>顾问</template>
    <template #lead>
      顾问从生态系统角度帮助指引 Vite，分享他们的经验，<br>
      以共同塑造环境 API 和未来 API 的设计。
    </template>
    <template #members>
      <VPTeamMembers size="small" :members="advisors" />
    </template>
  </VPTeamPageSection>
  <VPTeamPageSection>
    <template #title>中文文档翻译维护者</template>
    <template #lead>
      官方中文文档目前由以下 Vite 团队成员进行维护。
    </template>
    <template #members>
      <VPTeamMembers size="small" :members="cnTranslator" />
    </template>
  </VPTeamPageSection>
  <VPTeamPageSection>
    <template #title>团队荣誉会员</template>
    <template #lead>
      我们在此处向一些目前暂时不再活跃的团队成员致敬，他们在过去做出了宝贵的贡献。
    </template>
    <template #members>
      <VPTeamMembers size="small" :members="emeriti" />
    </template>
  </VPTeamPageSection>
</VPTeamPage>
