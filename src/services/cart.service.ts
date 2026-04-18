import api from "@/lib/axios";

export const getMyCart = async () => {
  const res = await api.get("/cart");
  return res.data;
};

export const addToCart = async (payload: {
  mealId: string;
  quantity?: number;
}) => {
  const res = await api.post("/cart/items", payload);
  return res.data;
};

export const updateCartItemQuantity = async (
  itemId: string,
  payload: { quantity: number }
) => {
  const res = await api.patch(`/cart/items/${itemId}`, payload);
  return res.data;
};

export const removeCartItem = async (itemId: string) => {
  const res = await api.delete(`/cart/items/${itemId}`);
  return res.data;
};

export const clearCart = async () => {
  const res = await api.delete("/cart");
  return res.data;
};