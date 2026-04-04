import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "/api",
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  if (typeof window === "undefined") return config;

  try {
    const raw = localStorage.getItem("civicpulse-auth");
    if (!raw) return config;

    const parsed      = JSON.parse(raw);
    const token       = parsed?.state?.token;
    const tokenExpiry = parsed?.state?.tokenExpiry;

    // Token expired — clear storage and redirect
    if (tokenExpiry && Date.now() > tokenExpiry) {
      localStorage.removeItem("civicpulse-auth");
      window.location.href = "/auth/login?reason=expired";
      return config;
    }

    if (token) config.headers.Authorization = `Bearer ${token}`;
  } catch {}

  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (
      err.response?.status === 401 &&
      typeof window !== "undefined" &&
      !window.location.pathname.startsWith("/auth")
    ) {
      localStorage.removeItem("civicpulse-auth");
      window.location.href = "/auth/login?reason=unauthorized";
    }
    return Promise.reject(err);
  }
);