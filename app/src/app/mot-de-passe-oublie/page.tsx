"use client";

import ForgotPasswordForm from "@/src/features/authentication/components/ForgotPasswordForm";
import { queryClient } from "@/src/lib/react-query/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Suspense } from "react";

export default function ForgotPassword() {
  return (
    <QueryClientProvider client={queryClient}>
      <Suspense fallback={<div></div>}>
        <main
          style={{
            height: "100vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <title>Mot de passe oublié - Ohdit</title>
          <ForgotPasswordForm />
        </main>
      </Suspense>
    </QueryClientProvider>
  );
}
