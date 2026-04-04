import axios from "axios";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "/api";

export const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

// Attach JWT on every request
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    try {
      // Read token from Zustand persisted storage
      const raw = localStorage.getItem("civicpulse-auth");
      if (raw) {
        const parsed = JSON.parse(raw);
        const token  = parsed?.state?.token;
        if (token) config.headers.Authorization = `Bearer ${token}`;
      }
    } catch {}
  }
  return config;
});

// Redirect to login on 401
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (
      err.response?.status === 401 &&
      typeof window !== "undefined" &&
      !window.location.pathname.startsWith("/auth")
    ) {
      window.location.href = "/auth/login";
    }
    return Promise.reject(err);
  }
);