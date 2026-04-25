import { cookies } from "next/headers";

export type TDashboardUser = {
  id: string;
  name: string;
  email: string;
  role: "CUSTOMER" | "PROVIDER" | "ADMIN" | "SUPER_ADMIN";
  image?: string | null;
  hasProviderProfile?: boolean;
  providerProfileStatus?: "DRAFT" | "PENDING" | "APPROVED" | "REJECTED" | null;
};

export const getDashboardUser = async (): Promise<TDashboardUser | null> => {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/session-check`,
      {
        method: "GET",
        headers: {
          cookie: cookieHeader,
        },
        cache: "no-store",
      }
    );

    if (!res.ok) return null;

    const json = await res.json();
    const data = json?.data;

    if (!data?.isAuthenticated || !data?.user) return null;

    return {
      id: data.user.id,
      name: data.user.name,
      email: data.user.email,
      role: data.user.role,
      image: data.user.image ?? null,
      hasProviderProfile: data.hasProviderProfile,
      providerProfileStatus: data.providerProfileStatus,
    };
  } catch {
    return null;
  }
};