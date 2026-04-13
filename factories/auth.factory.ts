import { faker } from '@faker-js/faker';

export interface RegisterPayload {
  email: string;
  password: string;
  role: 'ADMIN' | 'USER';
  username: string;
}

export interface LoginPayload {
  username: string;
  password: string;
}

export const createRegisterPayload = (): RegisterPayload => ({
  email: faker.internet.email(),
  password: faker.internet.password(),
  role: 'ADMIN',
  username: faker.internet.username().toLowerCase()
});
