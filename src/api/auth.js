const BASE = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/+$/, '');
const cleanBase = `${BASE}/v1`;

export const authApi = {
  /**
   * POST /auth/login
   * Simulates JWT login with username or email.
   */
  login: async ({ username, email, password } = {}) => {
    const res = await fetch(`${cleanBase}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, email, password }),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.message || `Login failed (HTTP ${res.status})`);
    }
    return data;
  },

  /**
   * POST /auth/register
   * Registers a new user in the session sandbox overlay and returns JWT tokens.
   */
  register: async (userData) => {
    const res = await fetch(`${cleanBase}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.message || `Registration failed (HTTP ${res.status})`);
    }
    return data;
  },

  /**
   * GET /auth/me
   * Fetches the current authenticated user details using the Bearer access token.
   */
  getMe: async (accessToken) => {
    const res = await fetch(`${cleanBase}/auth/me`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.message || `Failed to fetch user session (HTTP ${res.status})`);
    }
    return data;
  },

  /**
   * PATCH /auth/me
   * Updates the current authenticated user profile.
   */
  updateMe: async (userData, accessToken) => {
    const res = await fetch(`${cleanBase}/auth/me`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(userData),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.message || `Failed to update profile (HTTP ${res.status})`);
    }
    return data;
  },

  /**
   * POST /auth/refresh
   * Rotates and issues a new access token using a valid refresh token.
   */
  refreshToken: async (refreshToken) => {
    const res = await fetch(`${cleanBase}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.message || `Token refresh failed (HTTP ${res.status})`);
    }
    return data;
  },
};
