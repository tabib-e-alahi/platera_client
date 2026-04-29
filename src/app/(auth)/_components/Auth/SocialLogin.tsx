<<<<<<< HEAD
"use client";
// src/app/(auth)/_components/Auth/SocialLogin.tsx
//
// Fix: The old callbackURL was `${NEXT_PUBLIC_APP_URL}/google-callback`.
// better-auth's signIn.social() initiates the OAuth flow through its own
// backend handler. The callbackURL is where better-auth redirects the user
// AFTER the OAuth round-trip completes — it must be a frontend URL that
// better-auth is allowed to redirect to.
//
// The flow is:
//   1. authClient.signIn.social() → redirects to Google
//   2. Google → redirects to backend /api/auth/callback/google
//   3. better-auth validates, creates session, sets cookies
//   4. better-auth redirects to callbackURL (/google-callback)
//   5. GoogleCallbackPage reads the session and routes to the right dashboard

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

export default function SocialLogin() {
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleGoogleLogin = async () => {
    if (isGoogleLoading) return;
    setIsGoogleLoading(true);
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: `${process.env.NEXT_PUBLIC_APP_URL}/google-callback`,
      });
    } catch {
      setIsGoogleLoading(false);
      toast.error("Google sign-in failed. Please try again.");
    }
  };

  return (
    <div className="login-form__socials">
      <button
        type="button"
        className="login-form__social-btn"
        onClick={handleGoogleLogin}
        disabled={isGoogleLoading}
        aria-label="Sign in with Google"
      >
        {isGoogleLoading ? (
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ animation: "spin 1s linear infinite" }}
          >
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
          </svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
        )}
        {isGoogleLoading ? "Redirecting…" : "Continue with Google"}
      </button>

      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </div>
=======
"use client"

export default function SocialLogin() {
  return (
    <div className="login-form__socials">
              <button type="button" className="login-form__social-btn">
                <svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                Google
              </button>
              <button type="button" className="login-form__social-btn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M16.365 1.43c0 1.14-.493 2.27-1.177 3.08-.744.9-1.99 1.57-2.987 1.57-.18 0-.36-.02-.53-.06-.01-.12-.03-.33-.03-.5 0-1.08.56-2.27 1.23-3.02.75-.87 2.02-1.57 2.94-1.64.04.17.06.34.06.57zm3.24 16.12c-.56 1.09-1.2 2.09-2.17 2.97-1.02.93-2.02 1.19-3.07 1.19-1.07 0-1.83-.4-2.73-.4-.94 0-1.78.41-2.73.41-1.07 0-2.07-.62-3.07-1.62-1.97-2.03-3.44-5.15-3.44-8.14 0-4.42 2.87-6.97 5.69-6.97 1.18 0 2.17.57 2.93.57.73 0 1.87-.6 3.23-.6.76 0 2.78.17 4.1 1.65-3.04 1.87-2.56 6.69.76 8.14-.6 1.34-1.17 2.56-2.17 3.8h.67z"/></svg>
                Apple
              </button>
            </div>
>>>>>>> dc5656236feee959b1e0e891718009336b905842
  );
}