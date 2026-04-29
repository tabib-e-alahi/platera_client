<<<<<<< HEAD
import api from "@/lib/axios";

export const getHeroStats = async (): Promise<{
  restaurantCount: number;
  cuisineCount: number;
  happyFoodiesCount: number;
  averageRating: number;
}> => {
  const FALLBACK = { restaurantCount: 0, cuisineCount: 0, happyFoodiesCount: 0, averageRating: 0 };
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/public/hero-stats`,
      {
        next: { revalidate: 300 },
      }
    );
    if (!res.ok) return FALLBACK;
    const data = await res.json();
    return data.data ?? FALLBACK;
  } catch {
    return FALLBACK;
  }
};

=======
// src/services/public.service.ts

import api from "@/lib/axios";

/* ── Categories ───────────────────────────────────────────────────────────── */
>>>>>>> dc5656236feee959b1e0e891718009336b905842

export const getCategories = async () => {
  const res = await api.get("/public/categories");
  return res.data;
};

<<<<<<< HEAD
=======
/* ── Restaurants ──────────────────────────────────────────────────────────── */

>>>>>>> dc5656236feee959b1e0e891718009336b905842
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
<<<<<<< HEAD
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/public/restaurants/featured`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Failed to fetch featured restaurants");
  }
  const data = await res.json();
  return data;
=======
  const res = await api.get("/public/restaurants/featured");
  return res.data;
>>>>>>> dc5656236feee959b1e0e891718009336b905842
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

<<<<<<< HEAD
=======
/* ── Top dishes (homepage) ────────────────────────────────────────────────── */

/**
 * Fetches up to 9 featured/bestseller meals for the homepage "Signature
 * Collection" section. Sorted by order count descending.
 * GET /public/top-dishes
 */
>>>>>>> dc5656236feee959b1e0e891718009336b905842
export const getTopDishes = async (params?: { limit?: number }) => {
  const res = await api.get("/public/top-dishes", {
    params: { limit: params?.limit ?? 9 },
  });
  return res.data;
};

<<<<<<< HEAD
=======
/* ── Testimonials (homepage) ─────────────────────────────────────────────── */

/**
 * Fetches the most recent 5-star reviews (rating >= 4) with non-empty
 * feedback, for display in the homepage testimonials section.
 * GET /public/testimonials
 */
>>>>>>> dc5656236feee959b1e0e891718009336b905842
export const getHomeTestimonials = async (params?: { limit?: number }) => {
  const res = await api.get("/public/testimonials", {
    params: { limit: params?.limit ?? 9 },
  });
  return res.data;
};