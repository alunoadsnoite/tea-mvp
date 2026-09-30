import tseslint from 'typescript-eslint';
import js from '@eslint/js';

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
    },
    rules: {
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'warn',
      'no-console': 'off',
    },
  },
  {
    ignores: [
      'dist/',
      'node_modules/',
      '.expo/',
      'android/',
      'ios/',
      'nativewind.config.js',
      'tailwind.config.js',
      'babel.config.js',
      'metro.config.js',
      // Config plugins do Expo rodam em Node/CommonJS, fora do escopo do app
      'plugins/',
    ],
  },
);
