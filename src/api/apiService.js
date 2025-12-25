// apiService.js

const API_BASE_URL = 'http://localhost:5000/api'; // Change to your backend URL

// Admin endpoints
export const adminAPI = {
  async login(email, password) {
    const response = await fetch(`${API_BASE_URL}/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return response.json();
  },

  async getProfile(token) {
    const response = await fetch(`${API_BASE_URL}/admin/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.json();
  },

  async updateProfile(token, data) {
    const response = await fetch(`${API_BASE_URL}/admin/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },
};

// Bestie endpoints
export const bestieAPI = {
  async createBestie(token, bestieData) {
    const response = await fetch(`${API_BASE_URL}/besties`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(bestieData),
    });
    return response.json();
  },

  async getBesties(token) {
    const response = await fetch(`${API_BASE_URL}/besties`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.json();
  },

  async getBestie(token, bestieId) {
    const response = await fetch(`${API_BASE_URL}/besties/${bestieId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.json();
  },

  async updateBestie(token, bestieId, updates) {
    const response = await fetch(`${API_BASE_URL}/besties/${bestieId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updates),
    });
    return response.json();
  },

  async deleteBestie(token, bestieId) {
    const response = await fetch(`${API_BASE_URL}/besties/${bestieId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.json();
  },

  async publishBestie(token, bestieId) {
    const response = await fetch(`${API_BASE_URL}/besties/${bestieId}/publish`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.json();
  },

  async uploadImage(token, formData) {
    const response = await fetch(`${API_BASE_URL}/upload/image`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    return response.json();
  },

  async uploadVideo(token, formData) {
    const response = await fetch(`${API_BASE_URL}/upload/video`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    return response.json();
  },
};