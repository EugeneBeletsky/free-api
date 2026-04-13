import { test, expect } from '@playwright/test';
import { ProductsApi } from '../../../api/products.api';
import { createProductPayload } from '../../../factories/product.factory';

test.describe('Products CRUD', () => {
  test('GET all', async ({ request }) => {
    const api = new ProductsApi(request);
    const getAllResponse = await api.getAll();
    expect(getAllResponse.status()).toBe(200);

    const getAllData = await getAllResponse.json();
    expect(Array.isArray(getAllData.data.products)).toBeTruthy();
  });

  test('CREATE', async ({ request }) => {
    const api = new ProductsApi(request);

    const payload = createProductPayload();
    const createResponse = await api.create(payload);
    expect(createResponse.status()).toBe(201);

    const created = await createResponse.json();
    const productId = created.data.id;
  });

  test('GET by ID', async ({ request }) => {
    const api = new ProductsApi(request);

    const getByIdResponse = await api.getById(productId);
    const product = await getByIdResponse.json();
    expect(product.data.name).toBe(payload.name);
  });

  test('UPDATE', async ({ request }) => {
    const api = new ProductsApi(request);

    const newPrice = 999;
    await api.update(productId, { price: newPrice });

    const updated = await (await api.getById(productId)).json();
    expect(updated.data.price).toBe(newPrice);
  });

  test('DELETE', async ({ request }) => {
    const api = new ProductsApi(request);

    const deleteResponse = await api.delete(productId);
    expect([200, 204]).toContain(deleteResponse.status());
  });
});
