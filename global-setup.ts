import { request as apiRequest } from '@playwright/test';
import { AuthApi } from './api/auth.api.js';
import { createRegisterPayload } from './factories/auth.factory.js';
import { UserStorage } from './helpers/user.storage.js';

export default async function globalSetup() {
  const requestContext = await apiRequest.newContext({
    baseURL: 'https://api.freeapi.app'
  });

  const api = new AuthApi(requestContext);

  // 1. Register user
  console.log('[globalSetup] Registering user...');
  const registerPayload = createRegisterPayload();
  const registerResponse = await api.register(registerPayload);
  console.log(`[globalSetup] Register status: ${registerResponse.status()}`);
  if (registerResponse.status() !== 201) {
    throw new Error(`Registration failed: ${await registerResponse.text()}`);
  }
  UserStorage.saveUser(registerPayload);

  // 2. Login user
  console.log('[globalSetup] Logging in user...');
  const { username, password } = registerPayload;
  const loginResponse = await api.login({ username, password });
  console.log(`[globalSetup] Login status: ${loginResponse.status()}`);
  if (loginResponse.status() !== 200) {
    throw new Error(`Login failed: ${await loginResponse.text()}`);
  }

  const loginData = await loginResponse.json();  
  const storedUser = {
    ...loginData.data,
    user: {
      ...loginData.data.user,
      password: registerPayload.password
    }
  };
  UserStorage.saveUser(storedUser);
  console.log(`[globalSetup] User authenticated, accessToken saved`);

  await requestContext.dispose();
}
