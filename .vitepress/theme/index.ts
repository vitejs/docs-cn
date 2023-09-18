import { h } from 'vue'
<<<<<<< HEAD
import Theme from 'vitepress/theme'
=======
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import './styles/vars.css'
>>>>>>> 8052801f441569d648c4c25f3a5d807d110de47d
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
