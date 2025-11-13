"use client";

import ProjectGrid from "@/src/features/project/components/ProjectGrid";
import { AuthenticatedLayout } from "../../components/layouts/AuthenticatedLayout";
import { CheckCircleIcon, FolderPlusIcon } from "@heroicons/react/24/outline";
import CallToActionLink from "@/src/components/form/CallToActionLink";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

const SuccessMessage = () => {
  const searchParams = useSearchParams();
  const successMessage = searchParams.get("success");

  if (!successMessage) {
    return null;
  }

  return (
    <p
      role="alert"
      aria-live="polite"
      style={{
        border: "3px solid #56C07C",
        padding: "10px",
        borderRadius: "15px",
        fontWeight: "600",
        display: "flex",
        alignItems: "center",
        gap: "10px",
        marginBottom: "20px",
      }}
    >
      <CheckCircleIcon style={{ height: "30px", color: "#56C07C" }} />
      {successMessage}
    </p>
  );
};

export default function Projects() {
  return (
    <AuthenticatedLayout>
      <Suspense fallback={<div>Loading...</div>}>
        <SuccessMessage />
      </Suspense>
        <div className="flex items-center align-center mb-10 gap-10">
          <h1 className="m-0">Vos audits</h1>
          <CallToActionLink href="/projet/nouveau">
            <FolderPlusIcon />
            Créer un nouvel audit
          </CallToActionLink>
        </div>
        <ProjectGrid />
    </AuthenticatedLayout>
  );
}
