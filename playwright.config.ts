import './helpers/matchers.js';
import { defineConfig } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';

const dirName = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  globalSetup: path.join(dirName, 'global-setup.ts'),
  use: {
    baseURL: 'https://api.freeapi.app'
    // extraHTTPHeaders: {
    //   'Content-Type': 'application/json'
    // } because of conflicts when multipart post body
  },
  reporter: [['list'], ['allure-playwright'], ['html', { open: 'never' }]],
  projects: [
    {
      name: 'api-tests'
    }
  ]
});
