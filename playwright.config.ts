import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    baseURL: 'https://api.freeapi.app',
    extraHTTPHeaders: {
      'Content-Type': 'application/json'
    }
  },
  reporter: [['list'], ['allure-playwright']],
  projects: [
    {
      name: 'api-tests'
    }
  ]
});
