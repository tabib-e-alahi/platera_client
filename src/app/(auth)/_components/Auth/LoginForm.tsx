"use client"

import Link from "next/link"
import { Controller, useForm } from "react-hook-form"
import { z } from "zod"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect } from "react"

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

/* ─── Demo credentials ──────────────────────────────────────────────────── */

const DEMO_CREDENTIALS = [
  {
    role: "Customer",
    email: "sarah.rahman@platera.demo",
    password: "Demo@customer1",
    emoji: "🛒",
    color: "#3b82f6",
    bg: "rgba(59,130,246,0.07)",
    border: "rgba(59,130,246,0.2)",
  },
  {
    role: "Provider",
    email: "kitchen.spice@platera.demo",
    password: "Demo@provider1",
    emoji: "🍳",
    color: "#e8a030",
    bg: "rgba(232,160,48,0.07)",
    border: "rgba(232,160,48,0.25)",
  },
  {
    role: "Admin",
    email: "admin@platera.demo",
    password: "Demo@admin2024",
    emoji: "🛡️",
    color: "#7c3aed",
    bg: "rgba(124,58,237,0.07)",
    border: "rgba(124,58,237,0.2)",
  },
] as const

/* ─── Schema ────────────────────────────────────────────────────────────── */

const formSchema = z.object({
  email: z.email("Please enter a valid email address."),
  password: z.string().min(1, "Password is required."),
})

type FormValues = z.infer<typeof formSchema>

/* ─── Component ─────────────────────────────────────────────────────────── */

export function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const error = searchParams.get("error")
    if (error === "google_failed") {
      toast.error("Google sign-in failed. Please try again or use email/password.")
      window.history.replaceState({}, "", "/login")
    }
  }, [searchParams])

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "", password: "" },
  })

  /* fill form with one click */
  const fillDemo = (cred: (typeof DEMO_CREDENTIALS)[number]) => {
    form.setValue("email", cred.email, { shouldValidate: true })
    form.setValue("password", cred.password, { shouldValidate: true })
    toast.success(`${cred.emoji} ${cred.role} credentials filled — hit Sign In!`)
  }

  async function onSubmit(data: FormValues) {
    try {
      const res = await loginUser({ email: data.email, password: data.password })

      if (!res?.success) {
        toast.error(res?.message || "Login failed. Please try again.")
        return
      }

      toast.success("Login successful!")
      form.reset()
      const user = res.data.data.user
      const role = user?.role as string | undefined
      const hasProviderProfile = res?.data.hasProviderProfile

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
      const serverData = err?.response?.data
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

        {/* ── Demo credentials ── */}
        <div className="demo-creds">
          <div className="demo-creds__header">
            <span className="demo-creds__icon">✨</span>
            <span className="demo-creds__prompt">
              Want to try with demo credentials?
            </span>
          </div>
          <div className="demo-creds__pills">
            {DEMO_CREDENTIALS.map((cred) => (
              <button
                key={cred.role}
                type="button"
                className="demo-creds__pill"
                onClick={() => fillDemo(cred)}
                style={{
                  "--pill-color": cred.color,
                  "--pill-bg": cred.bg,
                  "--pill-border": cred.border,
                } as React.CSSProperties}
              >
                <span className="demo-creds__pill-emoji">{cred.emoji}</span>
                <span className="demo-creds__pill-role">{cred.role}</span>
              </button>
            ))}
          </div>
        </div>

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