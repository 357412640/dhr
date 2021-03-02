module.exports = {
  root: true,
  'extends': [
    'plugin:vue/essential',
    '@vue/standard'
  ],
  rules: {
    // allow async-await
    // 'generator-star-spacing': 'off',
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'vue/no-parsing-error': [2, { 'x-invalid-end-tag': false }],
    'no-undef': 'off',
    'camelcase': ['off', {properties: 'never'}], // 关闭驼峰
    'no-unused-vars': [0, {"vars": "all", "args": "after-used"}],
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
}
