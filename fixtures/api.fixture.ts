import { test as base, APIRequestContext } from '@playwright/test';
import { AuthData } from '../api/auth.types.js';
import { UserStorage } from '../helpers/user.storage.js';

type MyFixtures = {
  // Запрос, который уже умеет ходить по API с токеном
  apiClient: APIRequestContext;
  // Данные текущего залогиненного юзера (из хранилища)
  currentUser: AuthData;
};

export const test = base.extend<MyFixtures>({
  currentUser: async ({}, use) => {
    const data = UserStorage.loadUser();
    if (!data)
      throw new Error('Пользователь не найден в Storage. Сначала запустите тест регистрации!');
    await use(data);
  },

  apiClient: async ({ playwright, currentUser }, use) => {
    const context = await playwright.request.newContext({
      extraHTTPHeaders: {
        Authorization: `Bearer ${currentUser.accessToken}`,
        Accept: 'application/json'
      }
    });
    await use(context);
    await context.dispose();
  }
});

export { expect } from '@playwright/test';
