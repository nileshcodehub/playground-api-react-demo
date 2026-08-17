import { apiRequest } from './client';

export const usersApi = {
  /** GET /users – paginated list with optional search / sort */
  list: ({ page = 1, limit = 12, q = '', _sort = 'id', _order = 'asc' } = {}) => {
    const params = new URLSearchParams({ page, limit });
    if (q) params.set('q', q);
    if (_sort) {
      params.set('_sort', _sort);
      params.set('_order', _order);
    }
    return apiRequest(`/users?${params}`);
  },

  /** GET /users/:id */
  getById: (id) => apiRequest(`/users/${id}`),

  /** GET /users/:id/posts - relational */
  getUserPosts: (id) => apiRequest(`/users/${id}/posts`),

  /** GET /users/:id/todos - relational */
  getUserTodos: (id) => apiRequest(`/users/${id}/todos`),

  /** POST /users */
  create: (body) =>
    apiRequest('/users', {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  /** PATCH /users/:id */
  patch: (id, body) =>
    apiRequest(`/users/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(body),
    }),

  /** DELETE /users/:id */
  remove: (id) =>
    apiRequest(`/users/${id}`, {
      method: 'DELETE',
    }),
};
