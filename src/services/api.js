const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:8080"
).replace(/\/$/, "");

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...(options.token
        ? { Authorization: `Bearer ${options.token}` }
        : {}),
      ...options.headers,
    },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      data.message || data.error || `Request failed (${response.status})`
    );
  }

  return data;
}

export const api = {
  getSongs() {
    return request("/api/songs");
  },

  register(payload) {
    return request("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  login(payload) {
    return request("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  forgotPassword(email) {
    return request("/api/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  },

  addSong(song, token) {
    return request("/api/songs", {
      method: "POST",
      token,
      body: JSON.stringify(song),
    });
  },
  updateSong(id, song, token) {
  return request(`/api/songs/${id}`, {
    method: "PUT",
    token,
    body: JSON.stringify(song),
  });
},

deleteSong(id, token) {
  return request(`/api/songs/${id}`, {
    method: "DELETE",
    token,
  });
},

};