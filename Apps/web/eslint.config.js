import globals from 'globals';
import pluginJs from '@eslint/js';

export default [
  { ignores: ['dist/**', 'node_modules/**'] },
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      globals: {
        ...globals.browser,
        ...globals.es2022,
        ...globals.node,
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        sourceType: 'module',
      },
    },
    plugins: {
      js: pluginJs,
    },
    rules: {
      ...pluginJs.configs.recommended.rules,
      'no-unused-vars': 'warn',
      'no-console': 'off',
      'no-debugger': 'warn',
    },
  },
];