
import api from "@/lib/axios";

export const getCategories = async () => {
  const res = await api.get("/public/categories");
  return res.data;
};
