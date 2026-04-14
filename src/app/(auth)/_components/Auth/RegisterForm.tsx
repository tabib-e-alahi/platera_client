"use client"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

import "@/app/(auth)/register/register.css"
import { registerCustomer } from "@/services/auth.service"
import SocialLogin from "./SocialLogin"

const formSchema = z
  .object({
    name: z
      .string()
      .min(1, "Name is required.")
      .min(2, "Name must be at least 2 characters.")
      .max(50, "Name cannot exceed 50 characters."),
    email: z.email("Please enter a valid email address."),
    password: z
      .string()
      .min(1, "Password is required.")
      .min(8, "Password must be at least 8 characters.")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
        "Password must contain uppercase, lowercase, number and special character."
      ),
    confirmPassword: z
      .string()
      .min(1, "Please confirm your password."),
  })
  .refine(
    (data) => data.password === data.confirmPassword,
    {
      message: "Passwords do not match.",
      path: ["confirmPassword"],
    }
  )

type TRegisterForm = z.infer<typeof formSchema>

// password strength
function getStrength(password: string): {
  score: number
  label: string
  key: string
} {
  if (!password) return { score: 0, label: "", key: "" }
  let score = 0
  if (password.length >= 8) score++
  if (/[A-Z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[@$!%*?&]/.test(password)) score++

  const map = [
    { score: 1, label: "Weak", key: "weak" },
    { score: 2, label: "Fair", key: "fair" },
    { score: 3, label: "Good", key: "good" },
    { score: 4, label: "Strong", key: "strong" },
  ]

  return map[score - 1] ?? { score: 0, label: "", key: "" }
}

export function RegisterForm() {
  const router = useRouter()

  const form = useForm<TRegisterForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  })

  const passwordValue = form.watch("password")
  const strength = getStrength(passwordValue)

  async function onSubmit(data: TRegisterForm) {
    try {
      console.log(data);
      const res = await registerCustomer({
        name: data.name,
        email: data.email,
        password: data.password,
      })

      if (res?.success) {
        toast.success(
          "Account created! Please check your email to verify your account."
        )
        form.reset()
        router.push(`/verify-email?email=${encodeURIComponent(data.email)}`);
      } else {
        toast.error(res?.message ?? "Registration failed.")
      }
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ??
        "Something went wrong. Please try again."
      )
    }
  }

  return (
    <Card className="register-card">

      {/* HEADER */}
      <CardHeader className="register-card-header">
        <div className="register-eyebrow">
          <span className="register-eyebrow-dot" />
          Free account
        </div>

        <h1 className="register-title">
          Join <em>Platera</em>
        </h1>

        <p className="register-desc">
          Already have an account?{" "}
          <Link href="/login">Sign in here</Link>
        </p>
      </CardHeader>

      {/* FORM */}
      <CardContent className="register-card-content">
        <SocialLogin></SocialLogin>
        <div className="login-form__separator">
          <span className="login-form__separator-line" />
          <span className="login-form__separator-text">or continue with email</span>
          <span className="login-form__separator-line" />
        </div>
        <form
          id="register-form"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FieldGroup className="register-field-group">

            {/* NAME */}
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field
                  className="register-field"
                  data-invalid={fieldState.invalid}
                >
                  <FieldLabel
                    htmlFor="register-name"
                    className="register-field-label"
                  >
                    Full name
                  </FieldLabel>
                  <Input
                    {...field}
                    id="register-name"
                    type="text"
                    aria-invalid={fieldState.invalid}
                    placeholder="Your full name"
                    autoComplete="name"
                    className="register-input"
                  />
                  {fieldState.invalid && (
                    <FieldError
                      errors={[fieldState.error]}
                      className="register-field-error"
                    />
                  )}
                </Field>
              )}
            />

            {/* EMAIL */}
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field
                  className="register-field"
                  data-invalid={fieldState.invalid}
                >
                  <FieldLabel
                    htmlFor="register-email"
                    className="register-field-label"
                  >
                    Email address
                  </FieldLabel>
                  <Input
                    {...field}
                    id="register-email"
                    type="email"
                    aria-invalid={fieldState.invalid}
                    placeholder="you@example.com"
                    autoComplete="email"
                    className="register-input"
                  />
                  {fieldState.invalid && (
                    <FieldError
                      errors={[fieldState.error]}
                      className="register-field-error"
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
                <Field
                  className="register-field"
                  data-invalid={fieldState.invalid}
                >
                  <FieldLabel
                    htmlFor="register-password"
                    className="register-field-label"
                  >
                    Password
                  </FieldLabel>
                  <Input
                    {...field}
                    id="register-password"
                    type="password"
                    aria-invalid={fieldState.invalid}
                    placeholder="Min. 8 characters"
                    autoComplete="new-password"
                    className="register-input"
                  />
                  {fieldState.invalid && (
                    <FieldError
                      errors={[fieldState.error]}
                      className="register-field-error"
                    />
                  )}

                  {/* strength indicator */}
                  {passwordValue && (
                    <div className="register-strength">
                      <div className="register-strength__bars">
                        {[1, 2, 3, 4].map((i) => (
                          <div
                            key={i}
                            className={`register-strength__bar ${strength.score >= i
                                ? `register-strength__bar--${strength.key}`
                                : ""
                              }`}
                          />
                        ))}
                      </div>
                      {strength.label && (
                        <span
                          className={`register-strength__label register-strength__label--${strength.key}`}
                        >
                          {strength.label} password
                        </span>
                      )}
                    </div>
                  )}
                </Field>
              )}
            />

            {/* CONFIRM PASSWORD */}
            <Controller
              name="confirmPassword"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field
                  className="register-field"
                  data-invalid={fieldState.invalid}
                >
                  <FieldLabel
                    htmlFor="register-confirm"
                    className="register-field-label"
                  >
                    Confirm password
                  </FieldLabel>
                  <Input
                    {...field}
                    id="register-confirm"
                    type="password"
                    aria-invalid={fieldState.invalid}
                    placeholder="Repeat your password"
                    autoComplete="new-password"
                    className="register-input"
                  />
                  {fieldState.invalid && (
                    <FieldError
                      errors={[fieldState.error]}
                      className="register-field-error"
                    />
                  )}
                </Field>
              )}
            />

          </FieldGroup>

          <p className="register-terms">
            By creating an account you agree to our{" "}
            <Link href="/terms">Terms of Service</Link> and{" "}
            <Link href="/privacy">Privacy Policy</Link>.
          </p>
        </form>
      </CardContent>

      {/* FOOTER */}
      <CardFooter className="register-card-footer">
        <div className="register-btn-row">
          <Button
            type="button"
            className="register-btn-reset"
            onClick={() => form.reset()}
            disabled={form.formState.isSubmitting}
          >
            Reset
          </Button>

          <Button
            type="submit"
            form="register-form"
            className="register-btn-submit"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting
              ? "Creating account…"
              : "Create account"}
          </Button>
        </div>

        <p className="register-footer-link">
          Already have an account?{" "}
          <Link href="/login">Sign in</Link>
        </p>
      </CardFooter>

    </Card>
  )
}