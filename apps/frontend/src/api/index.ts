import axios from 'axios';
import type { Order, Price, User, StoreItem, UserMessage } from '../types';

const api = axios.create({ baseURL: '/admin' });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  },
);

export const authApi = {
  login: (inputName: string, inputPassword: string, powerId: string) =>
    api.post<{ isLogined: boolean; token: string }>('/login', { inputName, inputPassword, powerId }),
  checkLogin: () => api.get<{ isLogined: boolean }>('/checkLogin'),
  logout: () => api.get('/loginOut'),
};

export const ordersApi = {
  getAll: (phoneSuffix?: string) => api.get<Order[]>('/Data', { params: phoneSuffix ? { phoneSuffix } : {} }),
  create: (data: Partial<Order>) => api.post<{ result: Order }>('/insertoneOrder', data),
  update: (data: Partial<Order>) => api.post('/updateoneOrder', data),
  delete: (id: string) => api.post('/deleteOne', { _id: id }),
  exportCsv: (start: string, end: string) => api.get('/exportOrders', { params: { start, end }, responseType: 'blob' }),
};

export const usersApi = {
  getAll: () => api.get<User[]>('/users'),
  getSaler: () => api.get<{ username: string }>('/getSaler'),
  getUserMessage: () => api.get<UserMessage>('/userMessage'),
  create: (data: Partial<User>) => api.post('/insertuser', data),
  update: (data: Partial<User>) => api.post('/updateuser', data),
  delete: (data: Partial<User>) => api.post('/deleteuser', data),
};

export const priceApi = {
  getAll: () => api.get<Price[]>('/price'),
  update: (data: Price) => api.post('/updatePrice', data),
};

export const storeApi = {
  getAll: () => api.get<StoreItem[]>('/getstore'),
  create: (data: Partial<StoreItem>) => api.post('/insertStore', data),
  update: (data: Partial<StoreItem>) => api.post('/updateStore', data),
  delete: (id: string) => api.post('/deleStore', { _id: id }),
};
