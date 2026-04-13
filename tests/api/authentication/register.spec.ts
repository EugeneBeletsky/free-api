import { test, expect } from '@playwright/test';
import { AuthApi } from '../../../api/auth.api.js';
import { createRegisterPayload } from '../../../factories/auth.factory.js';
import { UserStorage } from '../../../helpers/user.storage.js';

test.describe('Register Flow', () => {
  test('Register user', async ({ request }) => {
    const api = new AuthApi(request);
    const payload = createRegisterPayload();
    const registerResponse = await api.register(payload);
    expect(registerResponse.status()).toBe(201);
    const responseBody = await registerResponse.json();

    expect(responseBody.statusCode).toBe(200);
    expect(responseBody.success).toBe(true);
    UserStorage.saveUser(payload);
  });
});
