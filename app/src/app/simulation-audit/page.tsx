"use client";

import { AuthenticatedLayout } from "@/src/components/layouts/AuthenticatedLayout";
import AuditSimulationForm from "@/src/features/simulation/components/AuditSimulationForm";

export default function SimulationAuditPage() {
  return (
    <AuthenticatedLayout>
      <AuditSimulationForm />
    </AuthenticatedLayout>
  );
}
