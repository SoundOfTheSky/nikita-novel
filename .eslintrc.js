module.exports = {
  root: true,
  extends: ['plugin:prettier/recommended'],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  rules: {
    'prefer-const': 1,
    'prettier/prettier': 1,
  },
};
