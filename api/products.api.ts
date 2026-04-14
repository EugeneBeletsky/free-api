import { APIRequestContext, APIResponse } from '@playwright/test';
import { CategoryPayload } from '../factories/category.factory.js';
import { ProductPayload } from '../factories/product.factory.js';

export class ProductsApi {
  constructor(private request: APIRequestContext) {}

  async getAllProducts(page: number = 1, limit: number = 10): Promise<APIResponse> {
    const response = await this.request.get(
      `/api/v1/ecommerce/products?page=${page}&limit=${limit}`
    );
    return response;
  }

  async createProduct(body: ProductPayload, accessToken?: string): Promise<APIResponse> {
    const customHeaders: Record<string, string> = {
      Accept: 'application/json'
    };

    if (accessToken) {
      customHeaders['Authorization'] = `Bearer ${accessToken}`;
    }
    const response = await this.request.post('/api/v1/ecommerce/products', {
      headers: customHeaders,
      multipart: {
        name: body.name,
        price: String(body.price),
        description: body.description,
        category: body.category,
        stock: String(body.stock),
        mainImage: body.mainImage
      }
    });
    return response;
  }

  async getProductById(id: string, accessToken?: string): Promise<APIResponse> {
    const response = await this.request.get(`/api/v1/ecommerce/products/${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    return response;
  }

  async updateProduct(
    id: string,
    body: Partial<ProductPayload>,
    accessToken?: string
  ): Promise<APIResponse> {
    const response = await this.request.patch(`/api/v1/ecommerce/products/${id}`, {
      data: {
        price: Number(body.price),
        category: body.category
      },
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/json'
      }
    });
    return response;
  }

  async deleteProduct(id: string, accessToken?: string): Promise<APIResponse> {
    const response = await this.request.delete(`/api/v1/ecommerce/products/${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/json'
      }
    });
    return response;
  }

  async getAllCategories(page: number = 1, limit: number = 5): Promise<APIResponse> {
    const response = await this.request.get(
      `/api/v1/ecommerce/categories?page=${page}&limit=${limit}`
    );
    return response;
  }

  async createCategory(body: CategoryPayload, accessToken?: string): Promise<APIResponse> {
    const customHeaders: Record<string, string> = {
      Accept: 'application/json'
    };

    if (accessToken) {
      customHeaders['Authorization'] = `Bearer ${accessToken}`;
    }
    const response = await this.request.post('/api/v1/ecommerce/categories', {
      data: body,
      headers: customHeaders
    });
    return response;
  }
}
