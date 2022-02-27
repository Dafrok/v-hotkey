const isProduction = process.env.NODE_ENV === 'production'

module.exports = {
  root: true,
  extends: [
    'plugin:vue/vue3-recommended'
  ],
  parserOptions: {
    parser: '@babel/eslint-parser',
    sourceType: 'module'
  },
  overrides: [
    {
      files: [
        '**/*.spec.js'
      ],
      plugins: [
        'jest'
      ],
      env: {
        jest: true
      }
    },
    {
      files: [
        '**/__tests__/*.{j,t}s?(x)',
        '**/tests/unit/**/*.spec.{j,t}s?(x)'
      ],
      env: {
        jest: true
      }
    }
  ],
  rules: {
    'arrow-parens': 'off',
    'generator-star-spacing': 'off',
    'no-debugger': isProduction ? 'error' : 'off',
    'no-prototype-builtins': 'off'
  }
}
