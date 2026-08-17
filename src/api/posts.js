import { apiRequest } from './client';

export const postsApi = {
  /** GET /posts – paginated list with optional search, sort, and user_id filter */
  list: ({ page = 1, limit = 10, q = '', _sort = 'id', _order = 'desc', user_id = '' } = {}) => {
    const params = new URLSearchParams({ page, limit });
    if (q) params.set('q', q);
    if (_sort) {
      params.set('_sort', _sort);
      params.set('_order', _order);
    }
    if (user_id) params.set('user_id', user_id);
    return apiRequest(`/posts?${params}`);
  },

  /** GET /posts/:id */
  getById: (id) => apiRequest(`/posts/${id}`),

  /** POST /posts */
  create: (body) =>
    apiRequest('/posts', {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  /** PATCH /posts/:id */
  patch: (id, body) =>
    apiRequest(`/posts/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(body),
    }),

  /** PUT /posts/:id */
  update: (id, body) =>
    apiRequest(`/posts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(body),
    }),

  /** DELETE /posts/:id */
  remove: (id) =>
    apiRequest(`/posts/${id}`, {
      method: 'DELETE',
    }),

  /** GET /posts/:postId/comments – relational sub-resource */
  getComments: (postId, { page = 1, limit = 20, q = '' } = {}) => {
    const params = new URLSearchParams({ page, limit });
    if (q) params.set('q', q);
    return apiRequest(`/posts/${postId}/comments?${params}`);
  },

  /** POST /comments under post */
  addComment: (body) =>
    apiRequest('/comments', {
      method: 'POST',
      body: JSON.stringify(body),
    }),
};
