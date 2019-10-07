module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint',
    sourceType: 'module'
  },
  extends: ['standard', 'plugin:vue/recommended' ],
  plugins: ['vue'],
  overrides: [
    {
      files: [
        "**/*.spec.js"
      ],
      env: {
        jest: true 
      },
      plugins: ["jest"],
    }
  ],
  rules: {
    'arrow-parens': 0,
    'generator-star-spacing': 0,
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0
  }
}
