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


export const getCategories = async () => {
  const res = await api.get("/public/categories");
  return res.data;
};

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
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/public/restaurants/featured`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Failed to fetch featured restaurants");
  }
  const data = await res.json();
  return data;
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

export const getTopDishes = async (params?: { limit?: number }) => {
  const res = await api.get("/public/top-dishes", {
    params: { limit: params?.limit ?? 9 },
  });
  return res.data;
};

export const getHomeTestimonials = async (params?: { limit?: number }) => {
  const res = await api.get("/public/testimonials", {
    params: { limit: params?.limit ?? 9 },
  });
  return res.data;
};