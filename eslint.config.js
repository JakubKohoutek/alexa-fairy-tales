const js = require('@eslint/js');
const tseslint = require('@typescript-eslint/eslint-plugin');
const tsparser = require('@typescript-eslint/parser');

module.exports = [
  {
    ignores: ['lib/**', 'node_modules/**']
  },
  js.configs.recommended,
  {
    files: ['src/**/*.ts'],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        project: './tsconfig.json'
      }
    },
    plugins: {
      '@typescript-eslint': tseslint
    },
    rules: {
      ...tseslint.configs.recommended.rules,
      'no-undef': 'off',
      'quotes': ['error', 'single', {avoidEscape: true}],
      'comma-dangle': ['error', 'never'],
      'max-len': ['error', {code: 120}],
      'object-curly-spacing': ['error', 'never'],
      'array-bracket-spacing': ['error', 'never'],
      'no-trailing-spaces': 'error',
      'new-parens': 'error',
      'no-bitwise': 'error',
      'arrow-body-style': ['error', 'as-needed'],
      'no-console': ['warn', {allow: ['info', 'warn', 'error']}],
      'padding-line-between-statements': [
        'error',
        {blankLine: 'always', prev: '*', next: 'return'}
      ],
      '@typescript-eslint/no-explicit-any': 'off'
    }
  }
];
