import { faker } from '@faker-js/faker';

export interface CategoryPayload {
  name: string;
}

export const createCategoryPayload = (): CategoryPayload => ({
  name: faker.person.jobArea().toLowerCase()
});
