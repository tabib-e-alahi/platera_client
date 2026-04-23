// src/services/public.service.ts

import api from "@/lib/axios";

/* ── Categories ───────────────────────────────────────────────────────────── */

export const getCategories = async () => {
  const res = await api.get("/public/categories");
  return res.data;
};

/* ── Restaurants ──────────────────────────────────────────────────────────── */

export const getRestaurants = async (params?: {
  search?: string;
  city?: string;
  categoryId?: string;
  subcategory?: string;
  businessCategory?: string;
  page?: number;
  limit?: number;
}) => {
  const res = await api.get("/public/restaurants", { params });
  return res.data;
};

export const getFeaturedRestaurants = async () => {
  const res = await api.get("/public/restaurants/featured");
  return res.data;
};

export const getRestaurantById = async (
  id: string,
  params?: {
    search?: string;
    categoryId?: string;
    subcategory?: string;
    dietary?: string;
    sortBy?: string;
  }
) => {
  const res = await api.get(`/public/restaurants/${id}`, { params });
  return res.data;
};

/* ── Top dishes (homepage) ────────────────────────────────────────────────── */

/**
 * Fetches up to 9 featured/bestseller meals for the homepage "Signature
 * Collection" section. Sorted by order count descending.
 * GET /public/top-dishes
 */
export const getTopDishes = async (params?: { limit?: number }) => {
  const res = await api.get("/public/top-dishes", {
    params: { limit: params?.limit ?? 9 },
  });
  return res.data;
};

/* ── Testimonials (homepage) ─────────────────────────────────────────────── */

/**
 * Fetches the most recent 5-star reviews (rating >= 4) with non-empty
 * feedback, for display in the homepage testimonials section.
 * GET /public/testimonials
 */
export const getHomeTestimonials = async (params?: { limit?: number }) => {
  const res = await api.get("/public/testimonials", {
    params: { limit: params?.limit ?? 9 },
  });
  return res.data;
};