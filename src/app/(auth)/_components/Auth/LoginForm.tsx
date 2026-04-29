"use client"
<<<<<<< HEAD

import Link from "next/link"
import { Controller, useForm } from "react-hook-form"
import { z } from "zod"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect } from "react"
=======
import Link from "next/link"
import { Controller, useForm } from "react-hook-form"
import { z } from "zod"
import { useRouter } from "next/navigation"
>>>>>>> dc5656236feee959b1e0e891718009336b905842

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { InputGroup } from "@/components/ui/input-group"

import { zodResolver } from "@hookform/resolvers/zod"
import { loginUser } from "@/services/auth.service"
import { toast } from "sonner"
import SocialLogin from "./SocialLogin"

const formSchema = z.object({
  email: z.email("Please enter a valid email address."),
  password: z.string().min(1, "Password is required."),
})

type FormValues = z.infer<typeof formSchema>

export function LoginForm() {
  const router = useRouter()
<<<<<<< HEAD
  const searchParams = useSearchParams()

  // Show a toast if Google OAuth redirected back with an error
  useEffect(() => {
    const error = searchParams.get("error")
    if (error === "google_failed") {
      toast.error("Google sign-in failed. Please try again or use email/password.")
      // Clean the URL so a refresh doesn't re-trigger the toast
      window.history.replaceState({}, "", "/login")
    }
  }, [searchParams])
=======
>>>>>>> dc5656236feee959b1e0e891718009336b905842

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "", password: "" },
  })

  async function onSubmit(data: FormValues) {
    try {
      const res = await loginUser({ email: data.email, password: data.password })

      if (!res?.success) {
<<<<<<< HEAD
=======
        // Server returned a structured error response (non-2xx caught by axios
        // interceptor won't reach here, but handle gracefully just in case)
>>>>>>> dc5656236feee959b1e0e891718009336b905842
        toast.error(res?.message || "Login failed. Please try again.")
        return
      }

      toast.success("Login successful!")
      form.reset()
<<<<<<< HEAD
      const user = res.data.data.user
      const role = user?.role as string | undefined
      const hasProviderProfile = res?.data.hasProviderProfile
=======
      // console.log(res.data);
      const user = res.data.data.user
      const role = user?.role as string | undefined
      const hasProviderProfile = res?.data.hasProviderProfile
      // console.log(role, hasProviderProfile);
>>>>>>> dc5656236feee959b1e0e891718009336b905842
      if (role === "CUSTOMER") {
        router.push("/")
      } else if (role === "PROVIDER") {
        router.push(hasProviderProfile ? "/provider-dashboard" : "/create-provider-profile")
      } else if (role === "ADMIN" || role === "SUPER_ADMIN") {
        router.push("/admin-dashboard")
      } else {
        router.push("/")
      }
    } catch (err: any) {
      // Axios puts the server response under err.response.data
      const serverData = err?.response?.data

      // Try to surface the most specific message from the server
      const message =
        serverData?.message ||
        serverData?.error ||
        err?.message ||
        "Login failed. Please check your credentials and try again."

      toast.error(message)
    }
  }

  return (
    <Card className="login-card">
      {/* ── HEADER ── */}
      <CardHeader className="login-card-header">
        <div className="login-eyebrow">
          <span className="login-eyebrow-dot" />
          Welcome back
        </div>

        <h1 className="login-title">
          Sign in to <em>Platera</em>
        </h1>

        <p className="login-desc">
          New here?{" "}
          <Link href="/register-customer">Create a free account</Link>
          {" "}and start ordering.
        </p>
      </CardHeader>

      {/* ── FORM ── */}
      <CardContent className="login-card-content">

        <SocialLogin />

        <div className="login-form__separator">
          <span className="login-form__separator-line" />
          <span className="login-form__separator-text">or continue with email</span>
          <span className="login-form__separator-line" />
        </div>

        <form id="login-form" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup className="login-field-group">

            {/* EMAIL */}
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field className="login-field" data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="login-email" className="login-field-label">
                    Email address
                  </FieldLabel>
                  <Input
                    {...field}
                    id="login-email"
                    type="email"
                    aria-invalid={fieldState.invalid}
                    placeholder="you@example.com"
                    autoComplete="email"
                    className="login-input"
                  />
                  {fieldState.error && (
                    <FieldError
                      errors={[fieldState.error]}
                      className="login-field-error"
                    />
                  )}
                </Field>
              )}
            />

            {/* PASSWORD */}
            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field className="login-field" data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="login-password" className="login-field-label">
                    Password
                  </FieldLabel>
                  <InputGroup>
                    <Input
                      {...field}
                      id="login-password"
                      type="password"
                      aria-invalid={fieldState.invalid}
                      placeholder="Your password"
                      autoComplete="current-password"
                      className="login-input"
                    />
                  </InputGroup>
                  {fieldState.error && (
                    <FieldError
                      errors={[fieldState.error]}
                      className="login-field-error"
                    />
                  )}
                </Field>
              )}
            />

          </FieldGroup>
        </form>
      </CardContent>

      {/* ── FOOTER ── */}
      <CardFooter className="login-card-footer">
        <div className="login-btn-row">
          <Button
            type="button"
            className="login-btn-reset"
            onClick={() => form.reset()}
            disabled={form.formState.isSubmitting}
          >
            Reset
          </Button>

          <Button
            type="submit"
            form="login-form"
            className="login-btn-submit"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? "Authenticating…" : "Sign In"}
          </Button>
        </div>

        <p className="login-footer-link">
          Don't have an account?{" "}
          <Link href="/register-customer">Register</Link>
        </p>
      </CardFooter>
    </Card>
  )
}