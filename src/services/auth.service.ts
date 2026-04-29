import api from "@/lib/axios"
import { TSessionCheckResponse } from "@/types/auth.type"
<<<<<<< HEAD
import { getCookieValue } from "@/utils/cookieExtractor"
=======
>>>>>>> dc5656236feee959b1e0e891718009336b905842
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

<<<<<<< HEAD
=======

>>>>>>> dc5656236feee959b1e0e891718009336b905842
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
<<<<<<< HEAD
    const cookieHeader = request.headers.get("cookie") || "";
    console.log("cooki header", cookieHeader);
    if (!cookieHeader) return null;
=======
    const cookie = request.headers.get("cookie") || "";
>>>>>>> dc5656236feee959b1e0e891718009336b905842

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/session-check`,
      {
        method: "GET",
        headers: {
<<<<<<< HEAD
          cookie: cookieHeader,
=======
          cookie,
>>>>>>> dc5656236feee959b1e0e891718009336b905842
        },
        cache: "no-store",
      }
    );

<<<<<<< HEAD
    if (!res.ok) return null;

    const json = await res.json();
    return json?.data ?? null;
=======
    if (!res.ok) {
      return null;
    }

    const data = await res.json();
    return data?.data ?? null;
>>>>>>> dc5656236feee959b1e0e891718009336b905842
  } catch {
    return null;
  }
};