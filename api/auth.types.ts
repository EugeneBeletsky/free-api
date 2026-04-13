export interface UserAvatar {
  url: string;
  localPath: string;
  _id: string;
}

export interface User {
  _id: string;
  avatar?: UserAvatar;
  username: string;
  email: string;
  role: 'ADMIN' | 'USER';
  loginType: string;
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface AuthData {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  statusCode: number;
  data: AuthData;
  message: string;
  success: boolean;
}
