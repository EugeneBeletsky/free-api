import { faker } from '@faker-js/faker';

export const createProductPayload = () => ({
  name: faker.commerce.productName(),
  price: Number(faker.commerce.price()),
  description: faker.commerce.productDescription(),
  category: faker.commerce.product(),
  stock: faker.number.int(),
  category:

});
