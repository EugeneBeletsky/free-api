import './helpers/matchers.js';
import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    baseURL: 'https://api.freeapi.app'
    // extraHTTPHeaders: {
    //   'Content-Type': 'application/json'
    // } because of conflicts when multipart post body
  },
  reporter: [['list'], ['allure-playwright']],
  projects: [
    {
      name: 'api-tests'
    }
  ]
});
