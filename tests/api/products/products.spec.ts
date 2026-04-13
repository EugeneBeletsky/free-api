import { test, expect } from '@playwright/test';
import { ProductsApi } from '../../../api/products.api.js';
import { createProductPayload } from '../../../factories/product.factory.js';
import { createCategoryPayload } from '../../../factories/category.factory.js';
import { UserStorage } from '../../../helpers/user.storage.js';
import { CategoryStorage } from '../../../helpers/category.storage.js';
import fs from 'fs';
import path from 'path';

test.describe('Products CRUD', () => {
  test.describe.configure({ mode: 'serial' });
  // let accessToken: string;

  test('Get all products', async ({ request }) => {
    const api = new ProductsApi(request);
    const getAllResponse = await api.getAllProducts();
    expect(getAllResponse.status()).toBe(200);

    const getAllData = await getAllResponse.json();
    console.log(getAllData);

    const products = getAllData.data.products;
    expect(Array.isArray(products)).toBe(true);
    console.log('products', products);

    const filePath = path.resolve('products.json');
    fs.writeFileSync(filePath, JSON.stringify(products, null, 2));
    console.log(`Сохранено продуктов: ${products.length}`);
  });

  test('Create product without access', async ({ request }) => {
    const api = new ProductsApi(request);

    const payload = createProductPayload();
    const createResponse = await api.createProduct(payload);
    expect(createResponse.status()).toBe(401);

    const data = await createResponse.json();
    console.log('data', data);
  });

  test('Get all categories', async ({ request }) => {
    const api = new ProductsApi(request);
    const authData = UserStorage.loadUser();
    console.log('authData', authData);

    const getAllCategoriesResponse = await api.getAllCategories();
    const data = await getAllCategoriesResponse.json();
    console.log('data', data);
    expect(getAllCategoriesResponse.status()).toBe(200);

    expect(data).toHaveProperty('statusCode');
    expect(data).toHaveProperty('message');
    expect(data).toHaveProperty('success');
    expect(data.data).toHaveProperty('categories');
    expect(Array.isArray(data.data.categories)).toBe(true);
  });

  test('Create category without access', async ({ request }) => {
    const api = new ProductsApi(request);
    const authData = UserStorage.loadUser();
    console.log('authData', authData);
    const payload = createCategoryPayload();
    console.log('payload', payload);

    const createCategoryResponse = await api.createCategory(payload);
    const data = await createCategoryResponse.json();
    console.log('data', data);
    expect(createCategoryResponse.status()).toBe(401);
    expect(data.statusCode).toBe(401);
    expect(data.success).toBe(false);
    expect(data.message).toBe('Unauthorized request');
  });

  test('Create category with access', async ({ request }) => {
    const api = new ProductsApi(request);
    const authData = UserStorage.loadUser();

    console.log('authData', authData);
    const payload = createCategoryPayload();
    console.log('payload', payload);

    const createCategoryResponse = await api.createCategory(payload, authData.accessToken);
    const data = await createCategoryResponse.json();
    console.log('data', data);
    CategoryStorage.saveCategory(data.data);
    expect(createCategoryResponse.status()).toBe(201);

    expect(data).toHaveProperty('statusCode');
    expect(data).toHaveProperty('success');
    expect(data).toHaveProperty('message');

    expect(data.statusCode).toBe(200);
    expect(data.success).toBe(true);
    expect(data.message).toBe('Category created successfully');
  });

  test('Create product with access', async ({ request }) => {
    const api = new ProductsApi(request);
    const authData = UserStorage.loadUser();
    console.log('authData', authData);
    const categoryData = CategoryStorage.loadCategory();
    console.log('categoryData', categoryData);
    console.log('categoryID', categoryData._id);

    const payload = createProductPayload(categoryData._id);
    console.log('payload', payload);
    const createResponse = await api.createProduct(payload, authData.accessToken);
    const data = await createResponse.json();
    console.log('data', data);
    expect(createResponse.status()).toBe(201);

    expect(data.statusCode).toBe(201);
    expect(data.success).toBe(true);
    expect(data.message).toBe('Product created successfully');
    expect(data.data.category).toBe(categoryData._id);
    expect(data.data.description).toBe(payload.description);
    expect(data.data.name).toBe(payload.name);
    expect(data.data.price).toBe(payload.price);
    expect(data.data.stock).toBe(payload.stock);
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
