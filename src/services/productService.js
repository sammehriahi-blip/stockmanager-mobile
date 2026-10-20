import { request } from './api';

function toQuery(params = {}) {
  const query = Object.entries(params)
    .filter(([, value]) => value !== undefined && value !== null && value !== '')
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join('&');
  return query ? `?${query}` : '';
}

export const productService = {
  getAll: (params) => request(`/products${toQuery(params)}`),
  getOne: (id) => request(`/products/${id}`),
  create: (data) => request('/products', { method: 'POST', body: data }),
  update: (id, data) => request(`/products/${id}`, { method: 'PUT', body: data }),
  updateStock: (id, delta) => request(`/products/${id}/stock`, { method: 'PATCH', body: { delta } }),
  remove: (id) => request(`/products/${id}`, { method: 'DELETE' }),
  getDashboard: () => request('/dashboard'),
  getMovements: () => request('/movements'),
};
