const BASE = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/+$/, '');

const endpoint = (path = '') => {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${BASE}/v1${cleanPath}`;
};

const json = (res) => {
  if (!res.ok) throw new Error(`HTTP ${res.status} – ${res.statusText}`);
  return res.json();
};

export const todosApi = {
  /** GET /todos – paginated list with search, sort, user_id, and completed filters */
  list: ({
    page = 1,
    limit = 10,
    q = '',
    _sort = '',
    _order = 'asc',
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
    return fetch(endpoint(`/todos?${params}`)).then(json);
  },

  /** GET /todos/:id */
  getById: (id) => fetch(endpoint(`/todos/${id}`)).then(json),

  /** POST /todos */
  create: (body) =>
    fetch(endpoint('/todos'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }).then(json),

  /** PATCH /todos/:id */
  patch: (id, body) =>
    fetch(endpoint(`/todos/${id}`), {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }).then(json),

  /** PUT /todos/:id */
  update: (id, body) =>
    fetch(endpoint(`/todos/${id}`), {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }).then(json),

  /** DELETE /todos/:id */
  remove: (id) =>
    fetch(endpoint(`/todos/${id}`), { method: 'DELETE' }).then(json),

  /** Quick toggle task completed state */
  toggle: (id, currentCompleted) =>
    fetch(endpoint(`/todos/${id}`), {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed: !currentCompleted }),
    }).then(json),
};
