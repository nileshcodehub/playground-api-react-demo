import { apiRequest } from './client';

export const productsApi = {
  /** POST /custom/seed?template=ecommerce */
  seedStore: async (template = 'ecommerce') => {
    return apiRequest(`/custom/seed?template=${template}`, {
      method: 'POST',
    });
  },

  /** GET /custom/products */
  getAll: async ({ page = 1, limit = 10, search = '', category = '', sort = '', order = 'asc' } = {}) => {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });

    if (search && search.trim()) params.set('q', search.trim());
    if (category && category !== 'all') params.set('category', category);
    if (sort) {
      params.set('_sort', sort);
      params.set('_order', order);
    }

    return apiRequest(`/custom/products?${params.toString()}`);
  },

  /** GET /custom/products/:id */
  getById: async (id) => {
    return apiRequest(`/custom/products/${id}`);
  },

  /** POST /custom/products */
  create: async (productData) => {
    return apiRequest('/custom/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  },

  /** PUT /custom/products/:id */
  update: async (id, productData) => {
    return apiRequest(`/custom/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    });
  },

  /** DELETE /custom/products/:id */
  delete: async (id) => {
    return apiRequest(`/custom/products/${id}`, {
      method: 'DELETE',
    });
  },
};
