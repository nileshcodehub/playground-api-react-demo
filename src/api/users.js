const BASE = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/+$/, '');

const endpoint = (path = '') => {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${BASE}/v1${cleanPath}`;
};

const json = (res) => {
  if (!res.ok) throw new Error(`HTTP ${res.status} – ${res.statusText}`);
  return res.json();
};

export const usersApi = {
  /** GET /users – paginated list with optional search / sort */
  list: ({ page = 1, limit = 10, q = '', _sort = '', _order = 'asc' } = {}) => {
    const params = new URLSearchParams({ page, limit });
    if (q) params.set('q', q);
    if (_sort) { params.set('_sort', _sort); params.set('_order', _order); }
    return fetch(endpoint(`/users?${params}`)).then(json);
  },

  /** GET /users/:id */
  getById: (id) => fetch(endpoint(`/users/${id}`)).then(json),

  /** POST /users */
  create: (body) =>
    fetch(endpoint('/users'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }).then(json),

  /** PATCH /users/:id */
  patch: (id, body) =>
    fetch(endpoint(`/users/${id}`), {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }).then(json),

  /** DELETE /users/:id */
  remove: (id) =>
    fetch(endpoint(`/users/${id}`), { method: 'DELETE' }).then(json),
};
