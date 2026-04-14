import { test, expect } from '@playwright/test';
import { AuthApi } from '../../../api/auth.api.js';
import { UserStorage } from '../../../helpers/user.storage.js';

test.describe('Auth Flow (after globalSetup)', () => {
  test.describe.configure({ mode: 'serial' });

  test(
    'User is already logged in (has accessToken)',
    { tag: ['@regression', '@P1', '@login'] },
    () => {
      const authData = UserStorage.loadUser();
      expect(authData).not.toBeNull();
      expect(authData).toHaveProperty('accessToken');
      expect(authData?.accessToken).toBeTruthy();
    }
  );

  test('Get logged in user', { tag: ['@regression', '@P1', '@login'] }, async ({ request }) => {
    const api = new AuthApi(request);
    const authData = UserStorage.loadUser();

    const response = await api.currentUser(authData.accessToken);

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.success).toBe(true);
    expect(body.data.username).toBe(authData.user.username);
  });

  test(
    'Can login with credentials',
    { tag: ['@regression', '@P1', '@login'] },
    async ({ request }) => {
      const api = new AuthApi(request);
      const user = UserStorage.loadUser();
      const { username, password } = user.user;

      const loginResponse = await api.login({ username, password });
      expect(loginResponse.status()).toBe(200);
      const data = await loginResponse.json();
      expect(data.data).toHaveProperty('accessToken');
    }
  );
});
