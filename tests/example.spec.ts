import { test, expect } from '@playwright/test';
const fs = require('fs');

test('1. Get users', async ({ request }) => {
  const response = await request.get('https://api.freeapi.app/api/v1/public/randomusers', {
    params: {
      page: 1,
      limit: 10
    },
    headers: {
      accept: 'application/json'
    }
  });

  expect(response.ok()).toBeTruthy();
  expect(response.status()).toBe(200);

  const data = await response.json();
  console.log(data);

  expect(data.data.data).toHaveLength(10);
});

test('2. Get user by id', async ({ request }) => {
  const response = await request.get('https://api.freeapi.app/api/v1/public/randomusers/13', {
    headers: {
      accept: 'application/json'
    }
  });

  expect(response.ok()).toBeTruthy();
  expect(response.status()).toBe(200);

  const data = await response.json();
  console.log(data);

  expect(data.data.id).toBe(13);
});

test('3. Get products', async ({ request }) => {
  const response = await request.get('https://api.freeapi.app/api/v1/public/randomproducts', {
    params: {
      page: 1,
      limit: 10,
      query: 'mens-watches',
      inc: 'category,price,thumbnail,images,title,id'
    },
    headers: {
      accept: 'application/json'
    }
  });

  expect(response.ok()).toBeTruthy();
  expect(response.status()).toBe(200);

  const responseData = await response.json();

  expect(responseData.data.data[0].category).toBe('mens-watches');
});

test('4. Get all products', async ({ request }) => {
  const response = await request.get('https://api.freeapi.app/api/v1/ecomerce/products', {
    params: {
      page: 1,
      limit: 10
    },
    headers: {
      accept: 'application/json'
    }
  });

  expect(response.ok()).toBeTruthy();
  expect(response.status()).toBe(200);

  const responseData = await response.json();
  console.log(`responseData`, responseData);

  // expect(responseData.data.data[0].category).toBe('mens-watches');
});

test('Получить список продуктов и сохранить в JSON', async ({ request }) => {
  const url = 'https://api.freeapi.app/api/v1/ecommerce/products';

  const response = await request.get(url, {
    params: {
      page: 1,
      limit: 10
    },
    headers: {
      accept: 'application/json'
    }
  });

  // 1. Проверяем статус-код 200
  expect(response.status()).toBe(200);

  const responseBody = await response.json();

  // 2. Проверяем, что продукты представлены в виде массива
  // В этом API путь: responseBody -> data -> products
  const products = responseBody.data.products;
  expect(Array.isArray(products)).toBe(true);

  // 3. Сохраняем список продуктов локально в файл products.json
  // Используем JSON.stringify с отступами (2), чтобы файл был читаемым
  fs.writeFileSync('products.json', JSON.stringify(products, null, 2));

  console.log(`Сохранено продуктов: ${products.length}`);
});
