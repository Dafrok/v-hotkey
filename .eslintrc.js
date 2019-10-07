const isProduction = process.env.NODE_ENV === 'production'

module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint',
    sourceType: 'module'
  },
  extends: ['standard', 'plugin:vue/recommended'],
  plugins: ['vue'],
  overrides: [{
    files: ['**/*.spec.js'],
    plugins: ['jest'],
    env: {
      jest: true
    }
  }],
  rules: {
    'arrow-parens': 'off',
    'generator-star-spacing': 'off',
    'no-debugger': isProduction ? 'error' : 'off'
  }
}
