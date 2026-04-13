import { test, expect } from '@playwright/test';
import { ProductsApi } from '../../../api/products.api.js';
import { createProductPayload } from '../../../factories/product.factory.js';
import { UserStorage } from '../../../helpers/user.storage.js';
import fs from 'fs';
import path from 'path';

test.describe('Products CRUD', () => {
    test.describe.configure({ mode: 'serial' });
  let accessToken: string;


  test('Get all products', async ({ request }) => {
    const api = new ProductsApi(request);
    const getAllResponse = await api.getAll();
    expect(getAllResponse.status()).toBe(200);

    const getAllData = await getAllResponse.json();
    console.log(getAllData);

  const products = getAllData.data.products;
  expect(Array.isArray(products)).toBe(true);
  console.log('products', products)

  const filePath = path.resolve('products.json'); 
fs.writeFileSync(filePath, JSON.stringify(products, null, 2));
  console.log(`Сохранено продуктов: ${products.length}`);
  });






  test('Create product without access', async ({ request }) => {
    const api = new ProductsApi(request);

    const payload = createProductPayload();
    const createResponse = await api.create(payload);
    expect(createResponse.status()).toBe(401);

    const data = await createResponse.json();
    console.log('data', data)
  });


    test('Create product with access', async ({ request }) => {
    const api = new ProductsApi(request);
      const authData = UserStorage.loadUser();

    const payload = createProductPayload();
    const createResponse = await api.create(payload, authData.accessToken);
    expect(createResponse.status()).toBe(201);

    const data = await createResponse.json();
    console.log('data', data)
  });








//   test('GET by ID', async ({ request }) => {
//     const api = new ProductsApi(request);

//     const getByIdResponse = await api.getById(productId);
//     const product = await getByIdResponse.json();
//     expect(product.data.name).toBe(payload.name);
//   });

//   test('UPDATE', async ({ request }) => {
//     const api = new ProductsApi(request);

//     const newPrice = 999;
//     await api.update(productId, { price: newPrice });

//     const updated = await (await api.getById(productId)).json();
//     expect(updated.data.price).toBe(newPrice);
//   });

//   test('DELETE', async ({ request }) => {
//     const api = new ProductsApi(request);

//     const deleteResponse = await api.delete(productId);
//     expect([200, 204]).toContain(deleteResponse.status());
//   });
});
