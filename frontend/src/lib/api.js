const BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
const TOKEN_KEY = 'foodos_admin_token';

export class ApiError extends Error {
  constructor(message, status, fields) {
    super(message);
    this.status = status;
    this.fields = fields || {};
  }
}

export const auth = {
  get: () => {
    try { return sessionStorage.getItem(TOKEN_KEY); } catch { return null; }
  },
  set: (t) => {
    try { sessionStorage.setItem(TOKEN_KEY, t); } catch { /* storage unavailable */ }
  },
  clear: () => {
    try { sessionStorage.removeItem(TOKEN_KEY); } catch { /* storage unavailable */ }
  },
};

async function request(path, { method = 'GET', body, token } = {}) {
  const headers = {};
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  if (token) headers.Authorization = `Bearer ${token}`;

  let res;
  try {
    res = await fetch(`${BASE}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError('Could not reach the server. Please check your connection and try again.', 0);
  }

  if (res.status === 204) return null;
  let data = null;
  try { data = await res.json(); } catch { /* empty or non-JSON body */ }
  if (!res.ok) {
    throw new ApiError(data?.message || 'Something went wrong. Please try again.', res.status, data?.fields);
  }
  return data;
}

export const api = {
  bookDemo: (payload) => request('/api/demo-bookings', { method: 'POST', body: payload }),
  sendEnquiry: (payload) => request('/api/contact', { method: 'POST', body: payload }),
  calculateSavings: (payload) => request('/api/savings/calculate', { method: 'POST', body: payload }),
  login: (email, password) => request('/api/auth/login', { method: 'POST', body: { email, password } }),
  leads: (params, token) => {
    const qs = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => { if (v !== '' && v != null) qs.set(k, v); });
    return request(`/api/admin/leads?${qs}`, { token });
  },
  stats: (token) => request('/api/admin/leads/stats', { token }),
  updateStatus: (id, status, token) =>
    request(`/api/admin/leads/${id}/status`, { method: 'PATCH', body: { status }, token }),
  deleteLead: (id, token) => request(`/api/admin/leads/${id}`, { method: 'DELETE', token }),
};
