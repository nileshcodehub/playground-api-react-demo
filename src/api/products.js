const BASE = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/+$/, '');
const cleanBase = `${BASE}/v1`;

export const productsApi = {
  /**
   * POST /custom/seed?template=ecommerce
   * Seeds 10 realistic e-commerce products into the session sandbox overlay.
   */
  seedStore: async (template = 'ecommerce') => {
    const res = await fetch(`${cleanBase}/custom/seed?template=${template}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.message || `Failed to seed template (HTTP ${res.status})`);
    }
    return data;
  },

  /**
   * GET /custom/products
   * Fetches paginated products with optional search, category filtering, and sorting.
   */
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

    const res = await fetch(`${cleanBase}/custom/products?${params.toString()}`);
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.message || `Failed to fetch products (HTTP ${res.status})`);
    }
    return data;
  },

  /**
   * GET /custom/products/:id
   */
  getById: async (id) => {
    const res = await fetch(`${cleanBase}/custom/products/${id}`);
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.message || `Product #${id} not found`);
    }
    return data;
  },

  /**
   * POST /custom/products
   * Creates a new custom product in the session overlay.
   */
  create: async (productData) => {
    const res = await fetch(`${cleanBase}/custom/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productData),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.message || `Failed to create product (HTTP ${res.status})`);
    }
    return data;
  },

  /**
   * PUT /custom/products/:id
   */
  update: async (id, productData) => {
    const res = await fetch(`${cleanBase}/custom/products/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productData),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.message || `Failed to update product #${id} (HTTP ${res.status})`);
    }
    return data;
  },

  /**
   * DELETE /custom/products/:id
   */
  delete: async (id) => {
    const res = await fetch(`${cleanBase}/custom/products/${id}`, {
      method: 'DELETE',
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.message || `Failed to delete product #${id} (HTTP ${res.status})`);
    }
    return data;
  },
};
