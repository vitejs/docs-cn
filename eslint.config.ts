import antfu from '@antfu/eslint-config'

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
})
