// src/services/review.service.ts

import api from "@/lib/axios";

export type TCreateReviewPayload = {
  orderId:  string;
  mealId:   string;
  rating:   number;
  feedback?: string;
};

export type TReview = {
  id:        string;
  rating:    number;
  feedback?: string | null;
  images:    string[];
  createdAt: string;
  user: {
    id:    string;
    name:  string;
    image?: string | null;
  };
  meal: {
    id:           string;
    name:         string;
    mainImageURL: string;
  };
  order?: {
    id:          string;
    orderNumber: string;
  };
};

export type TReviewStats = {
  averageRating: number;
  totalReviews:  number;
  breakdown:     Record<string, number>; // "1" → count, "2" → count, …
};

export type TProviderReviewsResponse = {
  reviews:    TReview[];
  pagination: {
    total:       number;
    page:        number;
    limit:       number;
    totalPages:  number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  stats: TReviewStats;
};

// ── Customer ──────────────────────────────────────────────────────────────────

export const createReview = async (payload: TCreateReviewPayload) => {
  const res = await api.post("/reviews", payload);
  return res.data;
};

export const getMyReviews = async () => {
  const res = await api.get("/reviews/my");
  return res.data;
};

/** Check if the customer can review a specific order */
export const canReviewOrder = async (orderId: string) => {
  const res = await api.get(`/reviews/can-review/${orderId}`);
  return res.data as {
    success: boolean;
    data: {
      canReview:       boolean;
      reason?:         string;
      existingReview?: TReview;
    };
  };
};

// ── Provider ──────────────────────────────────────────────────────────────────

export const getProviderReviews = async (params?: {
  page?:   number;
  limit?:  number;
  rating?: number;
  mealId?: string;
}) => {
  const res = await api.get("/reviews/provider", { params });
  return res.data as { success: boolean; data: TProviderReviewsResponse };
};

// ── Public ────────────────────────────────────────────────────────────────────

export const getPublicProviderReviews = async (
  providerId: string,
  params?: { page?: number; limit?: number }
) => {
  const res = await api.get(`/reviews/public/provider/${providerId}`, { params });
  return res.data;
};

export const getMealReviews = async (
  mealId: string,
  params?: { page?: number; limit?: number }
) => {
  const res = await api.get(`/reviews/public/meal/${mealId}`, { params });
  return res.data;
};