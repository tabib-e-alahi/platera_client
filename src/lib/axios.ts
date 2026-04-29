import axios from 'axios';

const api = axios.create({
<<<<<<< HEAD
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

=======
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true, // send session cookie
});

>>>>>>> dc5656236feee959b1e0e891718009336b905842
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response?.status === 401 &&
<<<<<<< HEAD
      typeof window !== "undefined"
    ) {
      const path = window.location.pathname;
      const isProtected = PROTECTED_PREFIXES.some((prefix) =>
        path.startsWith(prefix)
      );
      if (isProtected) {
        window.location.href = "/login";
      }
=======
      typeof window !== "undefined" &&
      !window.location.pathname.startsWith("/login")
    ) {
      window.location.href = "/login";
>>>>>>> dc5656236feee959b1e0e891718009336b905842
    }
    return Promise.reject(error);
  }
);

export default api;