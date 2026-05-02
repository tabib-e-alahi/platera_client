import axios from 'axios';

const api = axios.create({
  baseURL: "/api/v1",
  withCredentials: true, // send session cookie
});

// Routes that should forcefully redirect to /login on a 401.
// Public pages (/, /restaurants, etc.) must NOT be in this list —
// an unauthenticated visitor on the homepage is perfectly normal.
const PROTECTED_PREFIXES = [
  "/customer-dashboard",
  "/provider-dashboard",
  "/admin-dashboard",
  "/create-provider-profile",
  "/checkout",
  "/cart",
];

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response?.status === 401 &&
      typeof window !== "undefined"
    ) {
      const path = window.location.pathname;
      const isProtected = PROTECTED_PREFIXES.some((prefix) =>
        path.startsWith(prefix)
      );
      if (isProtected) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;