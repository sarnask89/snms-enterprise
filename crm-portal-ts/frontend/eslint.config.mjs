// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt({
  rules: {
    '@stylistic/arrow-parens': 'off',
    '@stylistic/eol-last': 'off',
    '@stylistic/indent': 'off',
    '@stylistic/max-statements-per-line': 'off',
    '@stylistic/no-trailing-spaces': 'off',
    '@stylistic/operator-linebreak': 'off',
    '@stylistic/semi': 'off',
    '@stylistic/space-before-function-paren': 'off',
    'nuxt/nuxt-config-keys-order': 'off',
    'vue/attributes-order': 'off',
    'vue/html-indent': 'off',
    'vue/max-attributes-per-line': 'off',
    'vue/multiline-html-element-content-newline': 'off',
    'vue/no-multiple-template-root': 'off',
    'vue/singleline-html-element-content-newline': 'off'
  }
})
