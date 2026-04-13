import { APIRequestContext } from '@playwright/test';

export class ProductsApi {
  constructor(private request: APIRequestContext) {}

  async getAll(page: number =1, limit:number =10) {    
    const response = await this.request.get(`/api/v1/ecommerce/products?page=${page}&limit=${limit}`);
    return response;
  }

  async create(body: any, accessToken?: string) {
    const response = await this.request.post('/api/v1/ecommerce/products', {
       data: body,
      headers: {
      'Authorization': `Bearer ${accessToken}`
    }    
    });
    return response;
  }

  async getById(id: string) {
    const response = await this.request.get(`/api/v1/ecommerce/products/${id}`);
        return response;
  }

  async update(id: string, body: any) {
    const response = await this.request.put(`/api/v1/ecommerce/products/${id}`, { data: body });
        return response;
  }

  async delete(id: string) {
    const response = await this.request.delete(`/api/v1/ecommerce/products/${id}`);
        return response;
  }
}
