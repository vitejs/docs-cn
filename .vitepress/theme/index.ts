import { h } from 'vue'
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import TwoslashFloatingVue from '@shikijs/vitepress-twoslash/client'
import '@shikijs/vitepress-twoslash/style.css'
import './styles/vars.css'
import './styles/landing.css'
import AsideSponsors from './components/AsideSponsors.vue'
import SvgImage from './components/SvgImage.vue'
import WwAds from './components/WwAds.vue'
import ReleaseTag from './components/ReleaseTag.vue'
import './custom.css'
import 'virtual:group-icons.css'

export default {
  extends: DefaultTheme,
  Layout() {
    return h(DefaultTheme.Layout, null, {
      'aside-outline-after': () => h(WwAds),
      'aside-ads-before': () => h(AsideSponsors),
    })
  },
  enhanceApp({ app }) {
    app.component('SvgImage', SvgImage)
    app.component('ReleaseTag', ReleaseTag)
    app.use(TwoslashFloatingVue)
  },
} satisfies Theme

