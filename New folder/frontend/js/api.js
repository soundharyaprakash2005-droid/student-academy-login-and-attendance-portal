/* ============================================================
   API client — talks to the FastAPI backend.
   When the frontend is served by the backend itself (port 8000)
   relative URLs are used; otherwise it targets localhost:8000.
   ============================================================ */

const API_BASE = location.protocol.startsWith("http")
  ? "/api"
  : "http://localhost:8000/api";

async function apiRequest(path, options = {}) {
  const config = {
    headers: { "Content-Type": "application/json" },
    ...options,
  };

  if (config.body && typeof config.body !== "string") {
    config.body = JSON.stringify(config.body);
  }

  let response;
  try {
    response = await fetch(`${API_BASE}${path}`, config);
  } catch (err) {
    throw new Error("Cannot reach the server. Is the backend running on port 8000?");
  }

  let payload = null;
  try {
    payload = await response.json();
  } catch (_) {
    /* non-JSON response */
  }

  if (!response.ok || (payload && payload.success === false)) {
    const message =
      (payload && (payload.message || payload.detail)) ||
      `Request failed (${response.status})`;
    const error = new Error(message);
    error.payload = payload;
    throw error;
  }

  return payload;
}

const api = {
  // Users (admins)
  getUsers: () => apiRequest("/admins/"),
  createUser: (data) => apiRequest("/admins/", { method: "POST", body: data }),
  updateUser: (id, data) => apiRequest(`/admins/${id}`, { method: "PUT", body: data }),
  deleteUser: (id) => apiRequest(`/admins/${id}`, { method: "DELETE" }),

  // Roles
  getRoles: () => apiRequest("/roles/"),
  createRole: (data) => apiRequest("/roles/", { method: "POST", body: data }),
  updateRole: (id, data) => apiRequest(`/roles/${id}`, { method: "PUT", body: data }),
  deleteRole: (id) => apiRequest(`/roles/${id}`, { method: "DELETE" }),

  // Settings
  getSettings: () => apiRequest("/settings/"),
  updateSettings: (data) => apiRequest("/settings/", { method: "PUT", body: data }),

  // Dashboard
  getDashboardStats: () => apiRequest("/dashboard/stats"),
};
