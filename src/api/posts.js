const BASE = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/+$/, '');

const endpoint = (path = '') => {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${BASE}/v1${cleanPath}`;
};

const json = (res) => {
  if (!res.ok) throw new Error(`HTTP ${res.status} – ${res.statusText}`);
  return res.json();
};

export const postsApi = {
  /** GET /posts – paginated list with optional search, sort, and user_id filter */
  list: ({ page = 1, limit = 10, q = '', _sort = '', _order = 'asc', user_id = '' } = {}) => {
    const params = new URLSearchParams({ page, limit });
    if (q) params.set('q', q);
    if (_sort) {
      params.set('_sort', _sort);
      params.set('_order', _order);
    }
    if (user_id) params.set('user_id', user_id);
    return fetch(endpoint(`/posts?${params}`)).then(json);
  },

  /** GET /posts/:id */
  getById: (id) => fetch(endpoint(`/posts/${id}`)).then(json),

  /** POST /posts */
  create: (body) =>
    fetch(endpoint('/posts'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }).then(json),

  /** PATCH /posts/:id */
  patch: (id, body) =>
    fetch(endpoint(`/posts/${id}`), {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }).then(json),

  /** PUT /posts/:id */
  update: (id, body) =>
    fetch(endpoint(`/posts/${id}`), {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }).then(json),

  /** DELETE /posts/:id */
  remove: (id) =>
    fetch(endpoint(`/posts/${id}`), { method: 'DELETE' }).then(json),

  /** GET /posts/:postId/comments – relational sub-resource */
  getComments: (postId, { page = 1, limit = 20, q = '' } = {}) => {
    const params = new URLSearchParams({ page, limit });
    if (q) params.set('q', q);
    return fetch(endpoint(`/posts/${postId}/comments?${params}`)).then(json);
  },
};
