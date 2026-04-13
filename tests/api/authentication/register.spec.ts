import { test, expect } from '@playwright/test';
import { AuthApi } from '../../../api/auth.api.js';
import { createRegisterPayload } from '../../../factories/auth.factory.js';
import { UserStorage } from '../../../helpers/user.storage.js';
// import { LoginPayload } from '../factories/auth.factory.js';
// import { RegisterPayload } from '../factories/auth.factory.js';

test('Register user', async ({ request }) => {
  const api = new AuthApi(request);
  const payload = createRegisterPayload();
  // console.log(payload.password);
  const registerResponse = await api.register(payload);
  expect(registerResponse.status()).toBe(201);
  const responseBody = await registerResponse.json();
  // console.log('user is registrated with response:', responseBody);
  expect(responseBody.statusCode).toBe(200);
  expect(responseBody.success).toBe(true);
  // const id = responseBody.data.user._id;
  // console.log('user is registrated with response:', id);
  UserStorage.saveUser(payload);
});
