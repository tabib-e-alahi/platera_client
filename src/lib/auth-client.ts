import { emailOTPClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
<<<<<<< HEAD
  baseURL: process.env.NEXT_PUBLIC_APP_URL
    ? process.env.NEXT_PUBLIC_APP_URL
    : "/api/auth",
  fetchOptions: { credentials: "include" },
  plugins: [emailOTPClient(), {
    id: "next-cookies-request",
    fetchPlugins: [
      {
        id: "next-cookies-request-plugin",
        name: "next-cookies-request-plugin",
        hooks: {
          async onRequest(ctx) {
            if (typeof window === "undefined") {
              const { cookies } = await import("next/headers");
              const headers = await cookies();
              ctx.headers.set("cookie", headers.toString());
            }
          },
        },
      },
    ],
  }],
});


=======
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL!,
  basePath: "/api/auth",
  plugins: [emailOTPClient()],
});

>>>>>>> dc5656236feee959b1e0e891718009336b905842
export const { signIn, signUp, signOut, useSession, getSession } =
  authClient;