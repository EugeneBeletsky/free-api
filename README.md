# Playwright API Framework

Фреймворк для API-тестирования на **Playwright + TypeScript**.

Проект тестирует REST API приложения (https://freeapi.hashnode.space/api-guide/)

Тесты выстроены в цепочку: `register → login → products CRUD`. Данные передаются между тестами через shared storage, поэтому порядок запуска не имеет значения — `globalSetup` выполняет регистрацию и логин один раз перед всеми тестами.

## Требования

- **Node.js** >= 18
- **npm**

## Установка

```bash
npm install
```

## ПРоверка линтера на ошибки

`npm run lint`

## Возможный фикс ошибок линтера

`npm run lint:fix`

## Форматирование кода согласно конфигурации (желательно делать перед коммитом)

`npm run format`

## Запуск тестов

| Команда              | Описание                            |
| -------------------- | ----------------------------------- |
| `npm test`           | Запуск всех тестов                  |
| `npm run test:ui`    | Запуск в UI-режиме Playwright       |
| `npm run test:clean` | Очистка результатов + запуск тестов |

## Allure отчёты

| Команда                   | Описание                                     |
| ------------------------- | -------------------------------------------- |
| `npm run report`          | Генерация и открытие отчёта (одной командой) |
| `npm run report:generate` | Генерация HTML-отчёта в `allure-report/`     |
| `npm run report:open`     | Открытие уже сгенерированного отчёта         |
| `npm run report:clean`    | Удаление `allure-report/`                    |

## Очистка

```bash
npm run clean
```

Удаляет `allure-results/`, `test-results/`, `allure-report/`, `playwright-report/`.

## CI/CD (GitHub Actions)

Пайплайн запускается при push/PR в ветки `main` и `test`:

1. **Lint Check** — проверка кода через ESLint (обязательная)
2. **Run API Tests** — запуск тестов + генерация Allure-отчёта
