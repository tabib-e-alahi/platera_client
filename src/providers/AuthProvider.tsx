"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { IUser } from "@/types/auth.type";
import api from "@/lib/axios";

interface IAuthContext {
  user: IUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  refetch: () => void;
}

const AuthContext = createContext<IAuthContext>({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  refetch: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<IUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const res = await api.get("/auth/me");
      setUser(res.data?.data ?? null);
    } catch {
      setUser(null); // 401 = not authenticated
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        refetch: fetchUser, // call this after login/logout to sync instantly
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);