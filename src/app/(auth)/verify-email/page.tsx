"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Mail, RefreshCw, ShieldCheck } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import "./verify-email.css";

const OTP_LENGTH = 6;
const RESEND_SECONDS = 60;

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialEmail = searchParams.get("email") || "";
  const role = searchParams.get("role") || "CUSTOMER";
  const [email, setEmail] = useState(initialEmail);
  const [userRole, setUserRole] = useState(role);
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [timeLeft, setTimeLeft] = useState(RESEND_SECONDS);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  const otpValue = useMemo(() => otp.join(""), [otp]);
  const canSubmit = email.trim() && otpValue.length === OTP_LENGTH && !otp.includes("");

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec.toString().padStart(2, "0")}`;
  };

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    setError("");
    setSuccess("");

    const next = [...otp];
    next[index] = value.slice(-1);
    setOtp(next);

    if (value && index < OTP_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Backspace") {
      if (otp[index]) {
        const next = [...otp];
        next[index] = "";
        setOtp(next);
        return;
      }

      if (index > 0) {
        inputsRef.current[index - 1]?.focus();
      }
    }

    if (event.key === "ArrowLeft" && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }

    if (event.key === "ArrowRight" && index < OTP_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();

    const pasted = event.clipboardData.getData("text").trim();
    if (!/^\d+$/.test(pasted)) return;

    const chars = pasted.slice(0, OTP_LENGTH).split("");
    const next = Array(OTP_LENGTH).fill("");

    chars.forEach((char, index) => {
      next[index] = char;
    });

    setOtp(next);

    const lastIndex = Math.min(chars.length, OTP_LENGTH) - 1;
    if (lastIndex >= 0) {
      inputsRef.current[lastIndex]?.focus();
    }
  };

  const clearOtp = () => {
    setOtp(Array(OTP_LENGTH).fill(""));
    inputsRef.current[0]?.focus();
  };

  const handleVerify = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!email.trim()) {
      setError("Please enter your email.");
      return;
    }

    if (!canSubmit) {
      setError("Please enter the full 6-digit code.");
      return;
    }

    try {
      setIsVerifying(true);

      const { data, error } = await authClient.emailOtp.verifyEmail({
        email: email.trim(),
        otp: otpValue,
      });

      if (error) {
        setError(error.message || "Invalid verification code.");
        return;
      }

      setSuccess("Email verified successfully. Redirecting...");
      clearOtp();

      setTimeout(() => {
        if(userRole === "CUSTOMER"){
          router.push(`/`);
        }
        if(userRole === "PROVIDER"){
          router.push(`/create-provider-profile`);
        }
        router.refresh();
      }, 1200);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Verification failed. Try again.";
      setError(message);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    if (!email.trim()) {
      setError("Enter your email first.");
      return;
    }

    try {
      setError("");
      setSuccess("");
      setIsResending(true);

      await authClient.emailOtp.sendVerificationOtp({
        email: email.trim(),
        type: "email-verification",
      });

      setSuccess("A new verification code has been sent.");
      setTimeLeft(RESEND_SECONDS);
      clearOtp();
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Could not resend code.";
      setError(message);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <main className="verify-page">
      <div className="verify-card">
        <div className="verify-badge">
          <ShieldCheck size={16} />
          <span>Secure Email Verification</span>
        </div>

        <h1 className="verify-title">Verify your email</h1>
        <p className="verify-subtitle">
          Enter the 6-digit code sent to your email to activate your Platera
          account.
        </p>

        <form className="verify-form" onSubmit={handleVerify}>
          <label className="verify-label" htmlFor="email">
            Email address
          </label>

          <div className="verify-email-wrap">
            <Mail size={18} className="verify-email-icon" />
            <input
              id="email"
              type="email"
              className="verify-email-input"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <label className="verify-label">Verification code</label>

          <div className="verify-otp">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  inputsRef.current[index] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                className="verify-otp-input"
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                aria-label={`OTP digit ${index + 1}`}
              />
            ))}
          </div>

          {error ? <p className="verify-message verify-message--error">{error}</p> : null}
          {success ? (
            <p className="verify-message verify-message--success">{success}</p>
          ) : null}

          <button
            type="submit"
            className="verify-submit"
            disabled={isVerifying || !canSubmit}
          >
            {isVerifying ? "Verifying..." : "Verify Email"}
          </button>
        </form>

        <div className="verify-footer">
          <button
            type="button"
            className="verify-resend"
            onClick={handleResend}
            disabled={isResending || timeLeft > 0}
          >
            <RefreshCw size={16} className={isResending ? "spin" : ""} />
            {isResending
              ? "Sending..."
              : timeLeft > 0
                ? `Resend code in ${formatTime(timeLeft)}`
                : "Resend code"}
          </button>

          <Link href="/login" className="verify-link">
            Back to login
          </Link>
        </div>
      </div>
    </main>
  );
}