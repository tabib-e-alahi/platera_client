// src/lib/auth-client.ts

import { emailOTPClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL!,
  plugins: [emailOTPClient()],
});

export const { signIn, signUp, signOut, useSession, getSession } =
  authClient;