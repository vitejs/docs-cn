import antfu from '@antfu/eslint-config'
import { createSimplePlugin } from 'eslint-factory'

export default antfu({
  formatters: true,
  typescript: true,
  rules: {
    'regexp/no-unused-capturing-group': 'off',
    'regexp/no-super-linear-backtracking': 'off',
  },
  ignores: [
    '**/*.md',
  ],

}, createSimplePlugin({
  name: 'no-vitepress-plugin-llms',
  include: ['**/*.ts', '**/*.ts/**'],
  create(context) {
    return {
      ImportDeclaration(node) {
        if (node.type === 'ImportDeclaration' && node.source.value === 'vitepress-plugin-llms') {
          context.report({
            node,
            message: 'Don\'t use vitepress-plugin-llms, only need to be installed in the upstream repository.',
          })
        }
      },
    }
  },
}))
