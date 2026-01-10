"use client";

import LoginForm from "@/src/features/authentication/components/LoginForm";
import { queryClient } from "@/src/lib/react-query/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Suspense } from "react";

export default function Login() {
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
          <title>Connexion - Ohdit</title>
          <LoginForm />
        </main>
      </Suspense>
    </QueryClientProvider>
  );
}
