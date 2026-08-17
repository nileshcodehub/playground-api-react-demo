import { apiRequest } from './client';

export const authApi = {
  /** POST /auth/login */
  login: async ({ username, email, password } = {}) => {
    return apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, email, password }),
    });
  },

  /** POST /auth/register */
  register: async (userData) => {
    return apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  /** GET /auth/me */
  getMe: async (accessToken) => {
    const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
    return apiRequest('/auth/me', {
      headers,
    });
  },

  /** PATCH /auth/me */
  updateMe: async (userData, accessToken) => {
    const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
    return apiRequest('/auth/me', {
      method: 'PATCH',
      headers,
      body: JSON.stringify(userData),
    });
  },

  /** POST /auth/refresh */
  refreshToken: async (refreshToken) => {
    return apiRequest('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refresh_token: refreshToken }),
    });
  },
};
