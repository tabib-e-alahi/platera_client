import api from "@/lib/axios";

export type TCheckoutPayload = {
  customerName: string;
  customerPhone: string;
  deliveryStreetAddress: string;
  deliveryHouseNumber?: string;
  deliveryApartment?: string;
  deliveryPostalCode?: string;
  deliveryNote?: string;
};

export type TCreateOrderPayload = TCheckoutPayload & {
  paymentMethod: "ONLINE" | "COD";
};

export const getCheckoutPreview = async (payload: TCheckoutPayload) => {
  const res = await api.post("/orders/checkout-preview", payload);
  return res.data;
};

export const createOrder = async (payload: TCreateOrderPayload) => {
  const res = await api.post("/orders", payload);
  return res.data;
};

export const getMyOrders = async () => {
  const res = await api.get("/orders/my-orders");
  return res.data;
};

export const getMyOrderDetail = async (id: string) => {
  const res = await api.get(`/orders/${id}`);
  return res.data;
};