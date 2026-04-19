"use client";

import AskForAccountForm from "@/src/features/authentication/components/AskForAccountForm";
import { queryClient } from "@/src/lib/react-query/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Suspense } from "react";

export default function Register() {
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
          <title>Inscription à la bêta - Ohdit</title>
          <AskForAccountForm />
        </main>
      </Suspense>
    </QueryClientProvider>
  );
}
