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

  // 🔹 Общие строгие правила
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: './tsconfig.json',
      },
          globals: {
        // Добавляем Node.js переменные, чтобы он не ругался на process и т.д.
        process: 'readonly',
        __dirname: 'off', // Отключаем старый __dirname
      },
    },

    rules: {
      // ❗ КРИТИЧНО для API тестов
      'require-await': 'error',
      'no-return-await': 'error',

      // ❗ ловит забытые await
      '@typescript-eslint/no-floating-promises': 'error',

      // ❗ предотвращает race conditions
      '@typescript-eslint/await-thenable': 'error',

      // ❗ чистота кода
      'no-console': 'warn',
      'no-debugger': 'error',

      // ❗ мусор
      '@typescript-eslint/no-unused-vars': ['error'],

      // ❗ запрет any
      '@typescript-eslint/no-explicit-any': 'warn',

      // ❗ явные типы возврата (опционально можно сделать error)
      '@typescript-eslint/explicit-function-return-type': 'off',

      // ❗ одинаковый стиль
      quotes: ['error', 'single'],
      semi: ['error', 'always'],

      // ❗ запрет var
      'no-var': 'error',

      // ❗ предпочтение const
      'prefer-const': 'error',

      // ❗ запрет неявных преобразований
      eqeqeq: ['error', 'always'],

      // ❗ читаемость
      'max-lines-per-function': ['warn', 100],
      complexity: ['warn', 10],
      '@typescript-eslint/naming-convention': [
  'error',

  // переменные
  {
    selector: 'variable',
    format: ['camelCase', 'UPPER_CASE']
  },

  // функции
  {
    selector: 'function',
    format: ['camelCase']
  },

  // классы
  {
    selector: 'typeLike',
    format: ['PascalCase']
  }
]
    }
  },

  // 🔹 Playwright (очень важно)
  {
    files: ['tests/**/*.ts'],
    plugins: {
      playwright
    },
    rules: {
      ...playwright.configs.recommended.rules,

      // ❗ критично для CI
      'playwright/no-focused-test': 'error',
      'playwright/no-skipped-test': 'warn',

      // ❗ стабильность тестов
      'playwright/no-wait-for-timeout': 'error',

      // ❗ читаемость
      'playwright/expect-expect': 'error',

      // ❗ не дублировать beforeAll логикой
      'playwright/no-conditional-in-test': 'warn'
    }
  },

  // 🔹 Отключаем конфликты с Prettier
  prettier
];
