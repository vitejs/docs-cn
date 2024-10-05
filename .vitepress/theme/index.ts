import { h } from 'vue'
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import TwoslashFloatingVue from '@shikijs/vitepress-twoslash/client'
import '@shikijs/vitepress-twoslash/style.css'
import './styles/vars.css'
import './styles/landing.css'
import AsideSponsors from './components/AsideSponsors.vue'
import SvgImage from './components/SvgImage.vue'
<<<<<<< HEAD
import WwAds from './components/WwAds.vue'
import './custom.css'
=======
import 'virtual:group-icons.css'
>>>>>>> 0fd7d2e8b36cf55fe5385ff2f957b92e9d44054b

export default {
  extends: DefaultTheme,
  Layout() {
    return h(DefaultTheme.Layout, null, {
<<<<<<< HEAD
      'home-features-after': () => h(HomeSponsors),
      'aside-outline-after': () => h(WwAds),
      'aside-bottom': () => h(AsideSponsors)
=======
      'aside-ads-before': () => h(AsideSponsors),
>>>>>>> 0fd7d2e8b36cf55fe5385ff2f957b92e9d44054b
    })
  },
  enhanceApp({ app }) {
    app.component('SvgImage', SvgImage)
    app.use(TwoslashFloatingVue)
  },
} satisfies Theme

