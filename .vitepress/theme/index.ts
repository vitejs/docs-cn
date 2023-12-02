import { h } from 'vue'
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import './styles/vars.css'
import HomeSponsors from './components/HomeSponsors.vue'
import AsideSponsors from './components/AsideSponsors.vue'
import SvgImage from './components/SvgImage.vue'
<<<<<<< HEAD
import WwAds from './components/WwAds.vue'
import './custom.css'
// temporary fix for vitepress not including component css when only
// imported in a single page
import './components/BlogIndex.vue'
=======
>>>>>>> 9719dff91b3912851a160523e1ae0153a912ad89

export default {
  extends: DefaultTheme,
  Layout() {
    return h(DefaultTheme.Layout, null, {
      'home-features-after': () => h(HomeSponsors),
      'aside-outline-after': () => h(WwAds),
      'aside-bottom': () => h(AsideSponsors)
    })
  },
  enhanceApp({ app }) {
    app.component('SvgImage', SvgImage)
  },
} satisfies Theme

