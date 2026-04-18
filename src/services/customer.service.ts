import api from "@/lib/axios";

export type TCustomerProfilePayload = {
  phone?: string;
  city: string;
  streetAddress: string;
  houseNumber?: string;
  apartment?: string;
  postalCode?: string;
  latitude?: number;
  longitude?: number;
};

export const getMyCustomerProfile = async () => {
  const res = await api.get("/customers/profile/me");
  return res.data;
};

export const createCustomerProfile = async (
  payload: TCustomerProfilePayload
) => {
  const res = await api.post("/customers/profile", payload);
  return res.data;
};

export const updateCustomerProfile = async (
  payload: Partial<TCustomerProfilePayload>
) => {
  const res = await api.patch("/customers/profile", payload);
  return res.data;
};