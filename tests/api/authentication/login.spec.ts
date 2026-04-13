import { test, expect } from '@playwright/test';
import { AuthApi } from '../../../api/auth.api.js';
import { UserStorage } from '../../../helpers/user.storage.js';

test.describe('Auth Flow', () => {
  test.describe.configure({ mode: 'serial' });

  test('Login user', async ({ request }) => {
    const api = new AuthApi(request);
    const user = UserStorage.loadUser();

    const { username, password } = user;
    const loginResponse = await api.login({ username, password });

    expect(loginResponse.status()).toBe(200);
    const data = await loginResponse.json();

    UserStorage.saveUser(data.data);

    expect(data.data).toHaveProperty('accessToken');
  });

  test('Get logged in user', async ({ request }) => {
    const api = new AuthApi(request);
    const authData = UserStorage.loadUser();

    const response = await api.currentUser(authData.accessToken);

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.success).toBe(true);
    expect(body.data.username).toBe(authData.user.username);
  });
});
