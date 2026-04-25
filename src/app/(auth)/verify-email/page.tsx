"use client";
import { Suspense } from "react";
import VerifyEmailPageClient from "../_components/verify-email/VerifyEmailPageClient";
import LoadingPage from "@/components/shared/loading/LoadingCompo";

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<LoadingPage></LoadingPage>}>
      <VerifyEmailPageClient></VerifyEmailPageClient>
    </Suspense>
  );
}