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
import { registerProvider } from "@/services/auth.service"

const formSchema = z
  .object({
    name: z
      .string()
      .min(1, "Name is required.")
      .min(2, "Name must be at least 2 characters.")
      .max(50, "Name cannot exceed 50 characters."),
    email: z
      .string()
      .min(1, "Email is required.")
      .email("Please enter a valid email address."),
    password: z
      .string()
      .min(1, "Password is required.")
      .min(8, "Password must be at least 8 characters.")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
        "Must contain uppercase, lowercase, number and special character."
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

type TRegisterProviderForm = z.infer<typeof formSchema>

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

export function RegisterProviderForm() {
  const router = useRouter()

  const form = useForm<TRegisterProviderForm>({
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

  async function onSubmit(data: TRegisterProviderForm) {
    try {
      const res = await registerProvider({
        name: data.name,
        email: data.email,
        password: data.password,
      })

      if (res?.success) {
        toast.success(
          "Provider account created! Please verify your email then complete your profile."
        )
        form.reset()
        router.push(`/verify-email?email=${encodeURIComponent(data.email)}&role=${res.data.role}`);
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
    <Card className="rp-card">

      {/* HEADER */}
      <CardHeader className="rp-card-header">
        <div className="rp-eyebrow">
          <span className="rp-eyebrow-dot" />
          Provider account
        </div>

        <h1 className="rp-card-title">
          Start selling on <em>Platera</em>
        </h1>

        <p className="rp-card-desc">
          Already have an account?{" "}
          <Link href="/login">Sign in here</Link>
        </p>
      </CardHeader>

      {/* FORM */}
      <CardContent className="rp-card-content">
        <form
          id="register-provider-form"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FieldGroup className="rp-field-group">

            {/* NAME */}
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field
                  className="rp-field"
                  data-invalid={fieldState.invalid}
                >
                  <FieldLabel
                    htmlFor="rp-name"
                    className="rp-field-label"
                  >
                    Full name
                  </FieldLabel>
                  <Input
                    {...field}
                    id="rp-name"
                    type="text"
                    aria-invalid={fieldState.invalid}
                    placeholder="Your full name"
                    autoComplete="name"
                    className="rp-input"
                  />
                  {fieldState.invalid && (
                    <FieldError
                      errors={[fieldState.error]}
                      className="rp-field-error"
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
                  className="rp-field"
                  data-invalid={fieldState.invalid}
                >
                  <FieldLabel
                    htmlFor="rp-email"
                    className="rp-field-label"
                  >
                    Email address
                  </FieldLabel>
                  <Input
                    {...field}
                    id="rp-email"
                    type="email"
                    aria-invalid={fieldState.invalid}
                    placeholder="you@example.com"
                    autoComplete="email"
                    className="rp-input"
                  />
                  {fieldState.invalid && (
                    <FieldError
                      errors={[fieldState.error]}
                      className="rp-field-error"
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
                  className="rp-field"
                  data-invalid={fieldState.invalid}
                >
                  <FieldLabel
                    htmlFor="rp-password"
                    className="rp-field-label"
                  >
                    Password
                  </FieldLabel>
                  <Input
                    {...field}
                    id="rp-password"
                    type="password"
                    aria-invalid={fieldState.invalid}
                    placeholder="Min. 8 characters"
                    autoComplete="new-password"
                    className="rp-input"
                  />
                  {fieldState.invalid && (
                    <FieldError
                      errors={[fieldState.error]}
                      className="rp-field-error"
                    />
                  )}
                  {passwordValue && (
                    <div className="rp-strength">
                      <div className="rp-strength__bars">
                        {[1, 2, 3, 4].map((i) => (
                          <div
                            key={i}
                            className={`rp-strength__bar ${strength.score >= i
                                ? `rp-strength__bar--${strength.key}`
                                : ""
                              }`}
                          />
                        ))}
                      </div>
                      {strength.label && (
                        <span
                          className={`rp-strength__label rp-strength__label--${strength.key}`}
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
                  className="rp-field"
                  data-invalid={fieldState.invalid}
                >
                  <FieldLabel
                    htmlFor="rp-confirm"
                    className="rp-field-label"
                  >
                    Confirm password
                  </FieldLabel>
                  <Input
                    {...field}
                    id="rp-confirm"
                    type="password"
                    aria-invalid={fieldState.invalid}
                    placeholder="Repeat your password"
                    autoComplete="new-password"
                    className="rp-input"
                  />
                  {fieldState.invalid && (
                    <FieldError
                      errors={[fieldState.error]}
                      className="rp-field-error"
                    />
                  )}
                </Field>
              )}
            />

          </FieldGroup>

          <p className="rp-terms">
            By registering as a provider you agree to our{" "}
            <Link href="/terms">Terms of Service</Link>,{" "}
            <Link href="/provider-guidelines">Provider Guidelines</Link>{" "}
            and <Link href="/privacy">Privacy Policy</Link>. Your
            account will be reviewed by our team before activation.
          </p>
        </form>
      </CardContent>

      {/* FOOTER */}
      <CardFooter className="rp-card-footer">
        <div className="rp-btn-row">
          <Button
            type="button"
            className="rp-btn-reset"
            onClick={() => form.reset()}
            disabled={form.formState.isSubmitting}
          >
            Reset
          </Button>

          <Button
            type="submit"
            form="register-provider-form"
            className="rp-btn-submit"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting
              ? "Creating account…"
              : "Create provider account"}
          </Button>
        </div>

        <p className="rp-footer-link">
          Already have an account?{" "}
          <Link href="/login">Sign in</Link>
        </p>

        <p className="rp-alt-link">
          Ordering food instead?{" "}
          <Link href="/register-customer">Create a customer account</Link>
        </p>
      </CardFooter>

    </Card>
  )
}