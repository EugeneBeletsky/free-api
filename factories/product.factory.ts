import { faker } from '@faker-js/faker';
import fs from 'fs';
import path from 'path';

export const createProductPayload = (category?: string) => ({
  name: faker.commerce.productName(),
  price: Number(faker.commerce.price()),
  description: faker.commerce.productDescription(),
  category: `${category}`,
  stock: faker.number.int({ min: 1, max: 100 }),
  mainImage: fs.createReadStream(path.resolve('tests/assets/test-image.jpg'))
});
