import api from "@/lib/axios"

export const createProviderProfile = async (payload: FormData) => {
  const res = await api.post("/providers/profile", payload, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const getMyProviderProfile = async () => {
  const res = await api.get("/providers/profile/me")
  return res.data
}


export const updateProviderProfile = async (payload: FormData) => {
  const res = await api.patch("/providers/profile", payload, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const requestApproval = async () => {
  const res = await api.post(
    "/providers/profile/request-approval"
  )
  return res.data
}

export const deleteProviderImage = async (
  imageType: string
) => {
  const res = await api.delete("/providers/profile/image", {
    data: { imageType },
  })
  return res.data
}

<<<<<<< HEAD
=======
//* ─── Meals ────────────────────────────────────────────────────────────────────

>>>>>>> dc5656236feee959b1e0e891718009336b905842
export const getMyMeals = async (params?: {
  page?: number
  limit?: number
  categoryId?: string
  isAvailable?: boolean
  search?: string
}) => {
  const res = await api.get("/provider/meals", { params })
  return res.data
}

export const getMyMealById = async (id: string) => {
  const res = await api.get(`/provider/meals/${id}`)
<<<<<<< HEAD
=======
  // console.log("From provider service: =====> ", res);
>>>>>>> dc5656236feee959b1e0e891718009336b905842
  return res.data
}

export const createMeal = async (payload: FormData) => {
  const res = await api.post("/provider/meals", payload, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const updateMeal = async (id: string, payload: FormData) => {
  const res = await api.patch(`/provider/meals/${id}`, payload, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const toggleMealAvailability = async (id: string) => {
  const res = await api.patch(`/provider/meals/${id}/availability`);
  return res.data;
};

export const deleteMeal = async (id: string) => {
  const res = await api.delete(`/provider/meals/${id}`);
  return res.data;
};

export const deleteGalleryImage = async (id: string, imageUrl: string) => {
  const res = await api.delete(`/provider/meals/${id}/gallery`, {
    data: { imageUrl },
  });
  return res.data;
};

<<<<<<< HEAD
=======
// ─── Categories (public — for select dropdown) ────────────────────────────────
>>>>>>> dc5656236feee959b1e0e891718009336b905842

export const getCategories = async () => {
  const res = await api.get("/public/categories")
  return res.data
}

<<<<<<< HEAD
=======
// ─── Dashboard Stats ─────────────────────────────────────────────────────────
>>>>>>> dc5656236feee959b1e0e891718009336b905842

export const getProviderDashboardStats = async () => {
  const res = await api.get("/providers/dashboard/stats");
  return res.data;
};