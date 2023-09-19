import { h } from 'vue'
<<<<<<< HEAD
import Theme from 'vitepress/theme'
=======
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import './styles/vars.css'
>>>>>>> 27a68382e9eb6fd99bdc3ccf41fc34ce00c48411
import HomeSponsors from './components/HomeSponsors.vue'
import AsideSponsors from './components/AsideSponsors.vue'
import SvgImage from './components/SvgImage.vue'
import './styles/vars.css'
import './custom.css'

export default {
  extends: DefaultTheme,
  Layout() {
    return h(DefaultTheme.Layout, null, {
      'home-features-after': () => h(HomeSponsors),
      'aside-ads-before': () => h(AsideSponsors),
    })
  },
  enhanceApp({ app }) {
    app.component('SvgImage', SvgImage)
  },
} satisfies Theme
