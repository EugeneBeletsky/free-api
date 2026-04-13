import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import playwright from 'eslint-plugin-playwright';
import prettier from 'eslint-config-prettier';

export default [
  {
    ignores: ['node_modules', 'dist', 'allure-results', 'playwright-report']
  },

  js.configs.recommended,
  ...tseslint.configs.recommended,

  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: './tsconfig.json',
      },
          globals: {
        process: 'readonly',
        __dirname: 'off', // Отключаем старый __dirname
      },
    },

    rules: {
      'require-await': 'error',
      'no-return-await': 'error',
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/await-thenable': 'error',
      'no-console': 'warn',
      'no-debugger': 'error',
      '@typescript-eslint/no-unused-vars': ['error'],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/explicit-function-return-type': 'off',
      quotes: ['error', 'single'],
      semi: ['error', 'always'],
      'no-var': 'error',
      'prefer-const': 'error',
      eqeqeq: ['error', 'always'],
      'max-lines-per-function': ['warn', 100],
      complexity: ['warn', 10],
      '@typescript-eslint/naming-convention': [
  'error',

  {
    selector: 'variable',
    format: ['camelCase', 'UPPER_CASE']
  },

  {
    selector: 'function',
    format: ['camelCase']
  },

  {
    selector: 'typeLike',
    format: ['PascalCase']
  }
]
    }
  },

  {
    files: ['tests/**/*.ts'],
    plugins: {
      playwright
    },
    rules: {
      ...playwright.configs.recommended.rules,
      'playwright/no-focused-test': 'error',
      'playwright/no-skipped-test': 'warn',
      'playwright/no-wait-for-timeout': 'error',
      'playwright/expect-expect': 'error',
      'playwright/no-conditional-in-test': 'warn'
    }
  },

  prettier
];
