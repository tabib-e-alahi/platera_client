import api from "@/lib/axios"
import { TSessionCheckResponse } from "@/types/auth.type"
import { NextRequest } from "next/server"

export const registerCustomer = async (payload: {
  name: string
  email: string
  password: string
}) => {
  const res = await api.post("/auth/register-customer", payload)
  return res.data
}

export const loginUser = async (payload: {
  email: string
  password: string
}) => {
  const res = await api.post("/auth/login", payload)
  return res.data
}

export const logoutUser = async () => {
  const res = await api.post("/auth/logout");
  return res.data;
}

export const getMe = async () => {
  const res = await api.get("/auth/me")
  return res.data
}


export const registerProvider = async (payload: {
  name: string
  email: string
  password: string
}) => {
  const res = await api.post("/auth/register-provider", payload)
  return res.data
}

export const getSessionInfoForProxy = async (
  request: NextRequest
): Promise<TSessionCheckResponse | null> => {
  try {
    const cookie = request.headers.get("cookie") || "";

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/session-check`,
      {
        method: "GET",
        headers: {
          cookie,
        },
        cache: "no-store",
      }
    );

    if (!res.ok) {
      return null;
    }

    const data = await res.json();
    return data?.data ?? null;
  } catch {
    return null;
  }
};