import { test } from '@playwright/test';
import { expect } from '../../../helpers/matchers.js';
import { ProductsApi } from '../../../api/products.api.js';
import { createProductPayload } from '../../../factories/product.factory.js';
import { createCategoryPayload } from '../../../factories/category.factory.js';
import { UserStorage } from '../../../helpers/user.storage.js';
import { CategoryStorage } from '../../../helpers/category.storage.js';
import { ProductStorage } from '../../../helpers/product.storage.js';
import fs from 'fs';
import path from 'path';
import { faker } from '@faker-js/faker';
import {
  productSuccessSchema,
  productDeleteSchema,
  productListSchema,
  productWithoutAccessSchema
} from '../../../schemas/product.schemas.js';

test.describe('Products CRUD', () => {
  test.describe.configure({ mode: 'serial' });

  test(
    'Create product without access',
    { tag: ['@regression', '@P3', '@product'] },
    async ({ request }) => {
      const api = new ProductsApi(request);

      const payload = createProductPayload();
      const createResponse = await api.createProduct(payload);

      expect(createResponse.status()).toBe(401);
      const data = await createResponse.json();
      expect(data.success).toBe(false);
      expect(data.message).toBe('Unauthorized request');

      //check schema of createProduct unathorized
      expect(data).toMatchSchema(productWithoutAccessSchema);
    }
  );

  test('Get all categories', { tag: ['@regression', '@P2', '@product'] }, async ({ request }) => {
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

  test(
    'Create category without access',
    { tag: ['@regression', '@P3', '@product'] },
    async ({ request }) => {
      const api = new ProductsApi(request);
      const payload = createCategoryPayload();

      const createCategoryResponse = await api.createCategory(payload);
      const data = await createCategoryResponse.json();
      expect(createCategoryResponse.status()).toBe(401);
      expect(data.statusCode).toBe(401);
      expect(data.success).toBe(false);
      expect(data.message).toBe('Unauthorized request');

      //check schema of createCategory unathorized
      expect(data).toMatchSchema(productWithoutAccessSchema);
    }
  );

  test(
    'Create category with access',
    { tag: ['@regression', '@P2', '@product'] },
    async ({ request }) => {
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
    }
  );

  test(
    'Create product with access',
    { tag: ['@regression', '@P1', '@product'] },
    async ({ request }) => {
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

      //check schema of createProduct
      expect(data).toMatchSchema(productSuccessSchema);
    }
  );

  test('Get all products', { tag: ['@regression', '@P2', '@product'] }, async ({ request }) => {
    const api = new ProductsApi(request);
    const getAllProductsResponse = await api.getAllProducts();
    expect(getAllProductsResponse.status()).toBe(200);

    const data = await getAllProductsResponse.json();
    const products = data.data.products;
    expect(Array.isArray(products)).toBe(true);

    const filePath = path.resolve('./data/products.json');
    fs.writeFileSync(filePath, JSON.stringify(products, null, 2));
    expect(products.length).toBeGreaterThan(0);

    //check schema of getAllProducts
    expect(data).toMatchSchema(productListSchema);
  });

  test('Get product by id', { tag: ['@regression', '@P2', '@product'] }, async ({ request }) => {
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
    expect(data).toMatchSchema(productSuccessSchema);
  });

  test(
    'Get product by invalid id',
    { tag: ['@regression', '@P3', '@product'] },
    async ({ request }) => {
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

      //check schema of getProductById unathorized
      expect(data).toMatchSchema(productWithoutAccessSchema);
    }
  );

  test('Update product by id', { tag: ['@regression', '@P2', '@product'] }, async ({ request }) => {
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

  test('Delete product by id', { tag: ['@regression', '@P1', '@product'] }, async ({ request }) => {
    const api = new ProductsApi(request);
    const userData = UserStorage.loadUser();
    const productData = ProductStorage.loadProduct();

    await test.step('Delete the product', async () => {
      const deleteProductByIdresponse = await api.deleteProduct(
        productData._id,
        userData.accessToken
      );
      expect(deleteProductByIdresponse.status()).toBe(200);
      const body = await deleteProductByIdresponse.json();
      expect(body.success).toBe(true);
      expect(body.message).toBe('Product deleted successfully');

      //check schema of deleteProduct
      expect(body).toMatchSchema(productDeleteSchema);
    });

    await test.step('Verify product deleted with ID', async () => {
      const getAllProductsResponse = await api.getAllProducts();
      const body = await getAllProductsResponse.json();
      const products = body.data.products;

      const isProductStillExists = products.some((p: any) => p._id === productData._id);
      expect(isProductStillExists).toBe(false);
    });
  });

  test.describe('Create product with boundary price values', () => {
    const priceCases = [
      { value: 0 },
      { value: -1 },
      { value: 999999999 },
      { value: 0.001 },
      { value: '100' },
      { value: '' },
      { value: 'сто' },
      { value: null },
      { value: '10 OR 1=1' },
      { value: `<script>alert('pwned')</script>` }
    ];

    for (const testCase of priceCases) {
      test(
        `Price = $(${testCase.value})`,
        { tag: ['@regression', '@P2', '@product'] },
        async ({ request }) => {
          const api = new ProductsApi(request);
          const authData = UserStorage.loadUser();
          const categoryData = CategoryStorage.loadCategory();

          const payload = createProductPayload(categoryData._id, { price: testCase.value as any });
          const createResponse = await api.createProduct(payload, authData.accessToken);
          const data = await createResponse.json();

          if (testCase.value === 0) {
            // баг
            expect(createResponse.status()).toBe(201);
            expect(data.statusCode).toBe(201);
            expect(data.success).toBe(true);
            expect(data.message).toBe('Product created successfully');
          }
          if (testCase.value === -1) {
            // баг
            expect(createResponse.status()).toBe(201);
            expect(data.statusCode).toBe(201);
            expect(data.success).toBe(true);
            expect(data.message).toBe('Product created successfully');
          }

          if (testCase.value === 9999999999999) {
            // потенциально не валидное значение
            expect(createResponse.status()).toBe(201);
            expect(data.statusCode).toBe(201);
            expect(data.success).toBe(true);
            expect(data.message).toBe('Product created successfully');
          }

          if (testCase.value === 0.001) {
            // потенциально не валидное значение
            expect(createResponse.status()).toBe(201);
            expect(data.statusCode).toBe(201);
            expect(data.success).toBe(true);
            expect(data.message).toBe('Product created successfully');
          }

          if (testCase.value === '') {
            expect(createResponse.status()).toBe(422);
            expect(data.statusCode).toBe(422);
            expect(data.success).toBe(false);
            expect(data.message).toBe('Received data is not valid');
            expect(data.errors[0].price).toBe('Price is required');
          }

          if (testCase.value === 'сто') {
            expect(createResponse.status()).toBe(422);
            expect(data.statusCode).toBe(422);
            expect(data.success).toBe(false);
            expect(data.message).toBe('Received data is not valid');
            expect(data.errors[0].price).toBe('Price must be a number');
          }

          if (testCase.value === null) {
            expect(createResponse.status()).toBe(422);
            expect(data.statusCode).toBe(422);
            expect(data.success).toBe(false);
            expect(data.message).toBe('Received data is not valid');
            expect(data.errors[0].price).toBe('Price must be a number');
          }

          if (testCase.value === '10 OR 1=1') {
            expect(createResponse.status()).toBe(422);
            expect(data.statusCode).toBe(422);
            expect(data.success).toBe(false);
            expect(data.message).toBe('Received data is not valid');
            expect(data.errors[0].price).toBe('Price must be a number');
          }

          if (testCase.value === `<script>alert('pwned')</script>`) {
            expect(createResponse.status()).toBe(422);
            expect(data.statusCode).toBe(422);
            expect(data.success).toBe(false);
            expect(data.message).toBe('Received data is not valid');
            expect(data.errors[0].price).toBe('Price must be a number');
          }
        }
      );
    }
  });
});
