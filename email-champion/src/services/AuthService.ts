import RestAPI from './RestApi';
import { User } from '../models/User';

export const AuthService = {
  async login(params: { email: string; password: string }) {
    try {
      const response = await RestAPI.post('/auth/login', { ...params });
      return response.data;
    } catch (error: any) {
      const data: any = (error && error.response && error.response.data) || null;
      throw {
        status: (data && data.status) || -1,
        message: (data && data.message) || '',
      };
    }
  },

  async register(user: User) {
    try {
      const response = await RestAPI.post('/auth/register', { ...user });
      return response.data;
    } catch (error: any) {
      const data: any = (error && error.response && error.response.data) || null;
      throw {
        status: (data && data.status) || -1,
        message: (data && data.message) || '',
      };
    }
  },
};
