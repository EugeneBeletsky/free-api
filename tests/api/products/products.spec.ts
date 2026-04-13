import { test, expect } from '@playwright/test';
import { ProductsApi } from '../../../api/products.api.js';
import { createProductPayload } from '../../../factories/product.factory.js';
import { createCategoryPayload } from '../../../factories/category.factory.js';
import { UserStorage } from '../../../helpers/user.storage.js';
import { CategoryStorage } from '../../../helpers/category.storage.js';
import { ProductStorage } from '../../../helpers/product.storage.js';
import fs from 'fs';
import path from 'path';
import { faker } from '@faker-js/faker';

test.describe('Products CRUD', () => {
  test.describe.configure({ mode: 'serial' });

  test('Get all products', async ({ request }) => {
    const api = new ProductsApi(request);
    const getAllResponse = await api.getAllProducts();
    expect(getAllResponse.status()).toBe(200);

    const getAllData = await getAllResponse.json();
    const products = getAllData.data.products;
    expect(Array.isArray(products)).toBe(true);

    const filePath = path.resolve('products.json');
    fs.writeFileSync(filePath, JSON.stringify(products, null, 2));
    console.log(`Saved products: ${products.length}`);
  });

  test('Create product without access', async ({ request }) => {
    const api = new ProductsApi(request);

    const payload = createProductPayload();
    const createResponse = await api.createProduct(payload);

    expect(createResponse.status()).toBe(401);
    const data = await createResponse.json();
    expect(data.success).toBe(false);
    expect(data.message).toBe('jwt malformed');

    console.log('data', data);
  });

  test('Get all categories', async ({ request }) => {
    const api = new ProductsApi(request);
    const getAllCategoriesResponse = await api.getAllCategories();
    const data = await getAllCategoriesResponse.json();
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
    expect(data.message).toBe('jwt malformed');
  });

  test('Create category with access', async ({ request }) => {
    const api = new ProductsApi(request);
    const authData = UserStorage.loadUser();
    const payload = createCategoryPayload();

    const createCategoryResponse = await api.createCategory(payload, authData.accessToken);
    const data = await createCategoryResponse.json();
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
    const categoryData = CategoryStorage.loadCategory();

    const payload = createProductPayload(categoryData._id);
    const createResponse = await api.createProduct(payload, authData.accessToken);
    const data = await createResponse.json();
    expect(createResponse.status()).toBe(201);

    expect(data.statusCode).toBe(201);
    expect(data.success).toBe(true);
    expect(data.message).toBe('Product created successfully');
    expect(data.data.category).toBe(categoryData._id);
    expect(data.data.description).toBe(payload.description);
    expect(data.data.name).toBe(payload.name);
    expect(data.data.price).toBe(payload.price);
    expect(data.data.stock).toBe(payload.stock);
    expect(data.data).toHaveProperty('_id');
    ProductStorage.saveProduct(data.data);
  });

  test('Get product by id', async ({ request }) => {
    const api = new ProductsApi(request);
    const authData = UserStorage.loadUser();
    const productData = ProductStorage.loadProduct();

    const getProductByIdResponse = await api.getProductById(productData._id, authData.accessToken);
    const data = await getProductByIdResponse.json();
    expect(getProductByIdResponse.status()).toBe(200);

    expect(data.statusCode).toBe(200);
    expect(data.success).toBe(true);
    expect(data.message).toBe('Product fetched successfully');

    expect(data.data.name).toBe(productData.name);
    expect(data.data._id).toBe(productData._id);
    expect(data.data.stock).toBe(productData.stock);
    expect(data.data.price).toBe(productData.price);
  });

  test('Update product by id', async ({ request }) => {
    const api = new ProductsApi(request);
    const userData = UserStorage.loadUser();
    const productData = ProductStorage.loadProduct();
    const newPrice = faker.number.int({ min: 1, max: 100 });

    const response = await api.updateProduct(
      productData._id,
      { price: newPrice, category: productData.category },
      userData.accessToken
    );

    const data = await response.json();
    expect(response.status()).toBe(200);

    expect(data.statusCode).toBe(200);
    expect(data.success).toBe(true);
    expect(data.message).toBe('Product updated successfully');
    expect(data.data.name).toBe(productData.name);
    expect(data.data._id).toBe(productData._id);
    expect(data.data.stock).toBe(productData.stock);
    expect(data.data.price).toBe(newPrice);
  });
});
