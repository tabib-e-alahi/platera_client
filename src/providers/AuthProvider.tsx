"use client";

import { createContext, useContext } from "react";
import { useSession } from "@/lib/auth-client";
import type { IUser } from "@/types/auth.type";

interface IAuthContext {
  user: IUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<IAuthContext>({
  user: null,
  isLoading: true,
  isAuthenticated: false,
});

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, isPending } = useSession();

  const user = session?.user
    ? (session.user as unknown as IUser)
    : null;

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading: isPending,
        isAuthenticated: !!session?.user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);