import { test } from '@playwright/test';
import { expect } from '../../../helpers/matchers.js';
import { ProductsApi } from '../../../api/products.api.js';
import { createProductPayload } from '../../../factories/product.factory.js';
import { createCategoryPayload } from '../../../factories/category.factory.js';
import { UserStorage } from '../../../helpers/user.storage.js';
import { CategoryStorage } from '../../../helpers/category.storage.js';
import { ProductStorage } from '../../../helpers/product.storage.js';
import { getProductSchema } from '../../../schemas/getProduct.schema.js';
import fs from 'fs';
import path from 'path';
import { faker } from '@faker-js/faker';

test.describe('Products CRUD', () => {
  test.describe.configure({ mode: 'serial' });

  test('Create product without access', async ({ request }) => {
    const api = new ProductsApi(request);

    const payload = createProductPayload();
    const createResponse = await api.createProduct(payload);

    expect(createResponse.status()).toBe(401);
    const data = await createResponse.json();
    expect(data.success).toBe(false);
    expect(data.message).toBe('Unauthorized request');
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
    const payload = createCategoryPayload();

    const createCategoryResponse = await api.createCategory(payload);
    const data = await createCategoryResponse.json();
    expect(createCategoryResponse.status()).toBe(401);
    expect(data.statusCode).toBe(401);
    expect(data.success).toBe(false);
    expect(data.message).toBe('Unauthorized request');
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

  test('Create product with access with invalid data', async ({ request }) => {
    const api = new ProductsApi(request);
    const authData = UserStorage.loadUser();
    const categoryData = CategoryStorage.loadCategory();

    const payload = createProductPayload(categoryData._id, { price: 'сто' });
    const createResponse = await api.createProduct(payload, authData.accessToken);
    const data = await createResponse.json();
    expect(createResponse.status()).toBe(422);

    expect(data.statusCode).toBe(422);
    expect(data.success).toBe(false);
    expect(data.message).toBe('Received data is not valid');
    expect(data.errors[0].price).toBe('Price must be a number');
  });

  test('Get all products', async ({ request }) => {
    const api = new ProductsApi(request);
    const getAllProductsResponse = await api.getAllProducts();
    expect(getAllProductsResponse.status()).toBe(200);

    const getAllData = await getAllProductsResponse.json();
    const products = getAllData.data.products;
    expect(Array.isArray(products)).toBe(true);

    const filePath = path.resolve('./data/products.json');
    fs.writeFileSync(filePath, JSON.stringify(products, null, 2));
    expect(products.length).toBeGreaterThan(0);
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
    //check schema of getProductByIdResponse
    expect(data).toMatchSchema(getProductSchema);
  });

  test('Get product by invalid id', async ({ request }) => {
    const api = new ProductsApi(request);
    const authData = UserStorage.loadUser();
    const productData = ProductStorage.loadProduct();
    const invalidId = productData._id.slice(0, -4) + '0000';

    const getProductByIdResponse = await api.getProductById(invalidId, authData.accessToken);
    const data = await getProductByIdResponse.json();
    expect(getProductByIdResponse.status()).toBe(404);

    expect(data.statusCode).toBe(404);
    expect(data.success).toBe(false);
    expect(data.message).toBe('Product does not exist');
  });

  test('Update product by id', async ({ request }) => {
    const api = new ProductsApi(request);
    const userData = UserStorage.loadUser();
    const productData = ProductStorage.loadProduct();
    const newPrice = faker.number.int({ min: 1, max: 100 });

    const updateResponse = await api.updateProduct(
      productData._id,
      { price: newPrice, category: productData.category },
      userData.accessToken
    );

    const data = await updateResponse.json();
    expect(updateResponse.status()).toBe(200);

    expect(data.statusCode).toBe(200);
    expect(data.success).toBe(true);
    expect(data.message).toBe('Product updated successfully');
    expect(data.data.name).toBe(productData.name);
    expect(data.data._id).toBe(productData._id);
    expect(data.data.stock).toBe(productData.stock);
    expect(data.data.price).toBe(newPrice);
  });

  test('Delete product by id', async ({ request }) => {
    const api = new ProductsApi(request);
    const userData = UserStorage.loadUser();
    const productData = ProductStorage.loadProduct();

    let countBefore: number;

    await test.step('Get initial products count', async () => {
      const getAllProductsResponse = await api.getAllProducts();
      const body = await getAllProductsResponse.json();
      countBefore = body.data.products.length;
    });

    await test.step('Delete the product', async () => {
      const deleteProductByIdresponse = await api.deleteProduct(
        productData._id,
        userData.accessToken
      );
      expect(deleteProductByIdresponse.status()).toBe(200);
      const body = await deleteProductByIdresponse.json();
      expect(body.success).toBe(true);
      expect(body.message).toBe('Product deleted successfully');
    });

    await test.step('Verify count decreased and ID is gone', async () => {
      const getAllProductsResponse = await api.getAllProducts();
      const body = await getAllProductsResponse.json();
      const products = body.data.products;
      const countAfter = products.length;

      expect(countAfter).toBe(countBefore - 1);

      const isProductStillExists = products.some((p: any) => p._id === productData._id);
      expect(isProductStillExists).toBe(false);
    });
  });
});
