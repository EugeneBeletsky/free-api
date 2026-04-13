import { faker } from '@faker-js/faker';
import fs from 'fs';
import path from 'path';

export interface ProductPayload {
  name: string;
  price: number | string; //for invalid inputs tests
  description: string;
  category?: string;
  stock: number | string;
  mainImage: any; //stream or buffer
}

export const createProductPayload = (category?: string, overrides?: Partial<ProductPayload>): ProductPayload => ({
  name: faker.commerce.productName(),
  price: Number(faker.commerce.price()),
  description: faker.commerce.productDescription(),
  category: category || '',
  stock: faker.number.int({ min: 1, max: 100 }),
  mainImage: fs.createReadStream(path.resolve('tests/assets/test-image.jpg')),
  ...overrides
});
