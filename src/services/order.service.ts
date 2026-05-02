// src/services/order.service.ts  — FULL REPLACEMENT

import api from "@/lib/axios";
import { TCancelResult } from "@/HelpersAndAttributes/CustomerOrder/typesAndConstants";

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


export const updateProviderOrderStatus = async (
  id: string,
  status: "ACCEPTED" | "PREPARING" | "OUT_FOR_DELIVERY" | "DELIVERED" | "CANCELLED",
  note?: string
) => {
  const res = await api.patch(`/orders/${id}/provider-status`, { status, note });
  return res.data;
};


export const getCheckoutPreview = async (payload: TCheckoutPayload) => {
  const res = await api.post("/orders/checkout-preview", payload);
  return res.data;
};

export const createOrder = async (payload: TCreateOrderPayload) => {
  const res = await api.post("/orders", payload);
  return res.data;
};

export const getMyOrders = async (params?: {
  status?: string;
  page?: number;
  limit?: number;
  search?: string;
}) => {
  const res = await api.get("/orders/my-orders", { params });
  return res.data;
};

export const getMyOrderDetail = async (id: string) => {
  const res = await api.get(`/orders/${id}`);
  return res.data;
};

export const cancelMyOrder = async (id: string) => {
  const res = await api.patch(`/orders/${id}/cancel`);
  return res.data;
};

export const getOrderTracking = async (id: string) => {
  const res = await api.get(`/orders/${id}/tracking`);
  return res.data;
};

export const getProviderOrders = async (params?: {
  status?: string;
  page?: number;
  limit?: number;
  search?: string;
}) => {
  const res = await api.get("/orders/provider/orders", { params });
  return res.data;
};


export const getProviderDashboardStats = async () => {
  const res = await api.get("/providers/dashboard/stats");
  return res.data;
};

export const getProviderRevenueChart = async (days = 7) => {
  const res = await api.get("/providers/dashboard/revenue-chart", { params: { days } });
  return res.data;
};