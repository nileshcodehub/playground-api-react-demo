import { apiRequest } from './client';

export const todosApi = {
  /** GET /todos – paginated list with search, sort, user_id, and completed filters */
  list: ({
    page = 1,
    limit = 15,
    q = '',
    _sort = 'id',
    _order = 'desc',
    user_id = '',
    completed = '',
  } = {}) => {
    const params = new URLSearchParams({ page, limit });
    if (q) params.set('q', q);
    if (_sort) {
      params.set('_sort', _sort);
      params.set('_order', _order);
    }
    if (user_id) params.set('user_id', user_id);
    if (completed !== '' && completed !== null && completed !== undefined) {
      params.set('completed', completed);
    }
    return apiRequest(`/todos?${params}`);
  },

  /** GET /todos/:id */
  getById: (id) => apiRequest(`/todos/${id}`),

  /** POST /todos */
  create: (body) =>
    apiRequest('/todos', {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  /** PATCH /todos/:id */
  patch: (id, body) =>
    apiRequest(`/todos/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(body),
    }),

  /** PUT /todos/:id */
  update: (id, body) =>
    apiRequest(`/todos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(body),
    }),

  /** DELETE /todos/:id */
  remove: (id) =>
    apiRequest(`/todos/${id}`, {
      method: 'DELETE',
    }),

  /** Quick toggle task completed state */
  toggle: (id, currentCompleted) =>
    apiRequest(`/todos/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ completed: !currentCompleted }),
    }),
};
