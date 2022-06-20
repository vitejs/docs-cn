import { defineConfig } from 'vite'

export default defineConfig({
  ssr: {
    format: 'cjs'
  },
  legacy: {
    buildSsrCjsExternalHeuristics: true
  }
})
