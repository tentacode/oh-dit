"use client";

import ForgotPasswordForm from "@/src/features/authentication/components/ForgotPasswordForm";
import { queryClient } from "@/src/lib/react-query/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Suspense } from "react";

export default function ForgotPassword() {
  return (
    <QueryClientProvider client={queryClient}>
      <Suspense fallback={<div></div>}>
        <ForgotPasswordForm />
      </Suspense>
    </QueryClientProvider>
  );
}
