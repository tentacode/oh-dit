"use client";

import ResetPasswordForm from "@/src/features/authentication/components/ResetPasswordForm";
import { queryClient } from "@/src/lib/react-query/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Suspense } from "react";

export default function ResetPassword() {
  return (
    <QueryClientProvider client={queryClient}>
      <Suspense fallback={<div></div>}>
        <ResetPasswordForm />
      </Suspense>
    </QueryClientProvider>
  );
}
