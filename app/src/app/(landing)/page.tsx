"use client";

import ProjectList from "@/src/features/project/components/ProjectList";
import { AuthenticatedLayout } from "../../components/layouts/AuthenticatedLayout";
import { CheckCircleIcon, FolderPlusIcon } from "@heroicons/react/24/outline";
import CallToActionLink from "@/src/components/form/CallToActionLink";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { getProjectUrl } from "../projet/routing";
import { useTeamsStateStore } from "@/src/features/authentication/store/teamsStore";

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
  const currentTeamUuid = useTeamsStateStore((state) => state.currentTeamUuid);

  return (
    <AuthenticatedLayout>
      <Suspense fallback={<div>Loading...</div>}>
        <SuccessMessage />
      </Suspense>

      <title>Vos audits - Ohdit</title>
        <div className="flex items-center align-center mb-10 gap-10">
          <h1 className="h1 m-0">Vos audits</h1>
          <CallToActionLink href={getProjectUrl.new()}>
            <FolderPlusIcon />
            Créer un nouvel audit
          </CallToActionLink>
        </div>
        
        {currentTeamUuid && <ProjectList teamUuid={currentTeamUuid} />}
    </AuthenticatedLayout>
  );
}
