import api from "@/lib/axios";

export interface Restaurant {
  id: string;
  businessName: string;
  businessCategory: string;
  bio?: string;
  imageURL?: string;
  city: string;
  street?: string;
  totalOrdersCompleted: number;
  reviewCount: number;
  mealCount: number;
  avgRating: number;
  subcategories: (string | null)[];
}

export interface Meal {
  id: string;
  name: string;
  subcategory?: string;
  shortDescription: string;
  mainImageURL: string;
  basePrice: number;
  discountPrice?: number;
  discountStartDate?: string;
  discountEndDate?: string;
  dietaryPreferences: string[];
  isBestseller: boolean;
  isFeatured: boolean;
  isAvailable: boolean;
  preparationTimeMinutes: number;
  deliveryFee: number;
  tags: string[];
  category: { id: string; name: string; slug: string };
  _count: { orderItems: number };
}

export interface RestaurantFilters {
  search?: string;
  city?: string;
  categoryId?: string;
  subcategory?: string;
  businessCategory?: string;
  page?: number;
  limit?: number;
}

export interface MealFilters {
  search?: string;
  categoryId?: string;
  subcategory?: string;
  dietary?: string;
  sortBy?: string;
}

export const getRestaurants = async (filters: RestaurantFilters = {}) => {
  try {
    const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/public/restaurants`);
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          url.searchParams.append(key, value);
        }
      });
    }
    const res = await fetch(url.toString(), {
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to fetch restaurants");
    }

    const data = await res.json();
    return data;
  } catch (error) {
    throw error;
  }
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

export const getRestaurantById = async (id: string, filters: MealFilters = {}) => {
  const params: Record<string, string> = {};
  Object.entries(filters).forEach(([k, v]) => { if (v !== undefined && v !== "") params[k] = v; });
  const res = await api.get(`/public/restaurants/${id}`, { params });
  return res.data;
};
