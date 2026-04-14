// src/services/auth.ts

import api from "@/lib/axios"

export const registerCustomer = async (payload: {
  name: string
  email: string
  password: string
}) => {
  const res = await api.post("/api/v1/auth/register-customer", payload)
  console.log(res);
  return res.data
}

export const loginUser = async (payload: {
  email: string
  password: string
}) => {
  const res = await api.post("/api/v1/auth/login", payload)
  return res.data
}

export const logoutUser = async () => {
  const res = await api.post("/api/auth/logout")
  return res.data
}

export const getMe = async () => {
  const res = await api.get("/api/auth/me")
  return res.data
}