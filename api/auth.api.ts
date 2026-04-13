import { APIRequestContext, APIResponse } from '@playwright/test';
import { LoginPayload } from '../factories/auth.factory.js';
import { RegisterPayload } from '../factories/auth.factory.js';


export class AuthApi {
  constructor(private request: APIRequestContext) {}

  async register(body: RegisterPayload): Promise<APIResponse> {
    const response =  await this.request.post('/api/v1/users/register', {
      data: body,
    });
    return response;
  }

  async login(body: LoginPayload): Promise<APIResponse> {
    const response = await  this.request.post('/api/v1/users/login', {
      data: body,
    });
    return response;
  }

    async currentUser(accessToken: string): Promise<APIResponse> {
    const response = await  this.request.get('/api/v1/users/current-user', {
      headers: {
      'Authorization': `Bearer ${accessToken}`
    }
    });
    return response;
  }
}
