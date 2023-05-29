import Axios from 'axios';
import { StorageService } from './StorageService';

const RestAPI = Axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

RestAPI.interceptors.request.use(
  (config) => {
    const token = StorageService.get('token');
    token && (config.headers.Authorization = `Bearer ${token}`);
    return config;
  },
  (error) => {
    console.log(error);
    Promise.reject(error);
  }
);

export default RestAPI;
