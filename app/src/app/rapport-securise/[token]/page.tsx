"use client";

import SecuredReportController from "@/src/features/deliverable/components/SecuredReport/SecuredReportController";
import { queryClient } from "@/src/lib/react-query/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Suspense } from "react";
import { useParams } from "next/navigation";

export default function RapportSecurise() {
  const { token } = useParams<{ token: string }>();

  return (
    <QueryClientProvider client={queryClient}>
      <Suspense fallback={<div></div>}>
          <title>Rapport d'audit sécurisé - Ohdit</title>
          <SecuredReportController linkToken={token} />
      </Suspense>
    </QueryClientProvider>
  );
}
