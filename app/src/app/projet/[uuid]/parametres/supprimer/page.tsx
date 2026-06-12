"use client";

import Button from "@/src/design-system/components/button/Button";
import Modal from "@/src/design-system/components/modal/Modal";
import { useAuditStore } from "@/src/features/audit/store/auditStore";
import { useDeleteProject } from "@/src/features/project/mutations/useDeleteProject";
import { useTeamsStateStore } from "@/src/features/authentication/store/teamsStore";
import { TrashIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DeleteProjectPage() {
  const project = useAuditStore((state) => state.project);
  const teamUuid = useTeamsStateStore((state) => state.currentTeamUuid);

  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const router = useRouter();
  const deleteProject = useDeleteProject(project?.uuid ?? "", teamUuid ?? "");

  if (!project || !teamUuid) {
    return null;
  }

  const handleConfirm = async () => {
    await deleteProject.mutateAsync();
    router.push("/");
  };

  return (
    <>
      <title>Supprimer le projet - Ohdit</title>
      <h2 className="h2 mb-5">Supprimer le projet</h2>

      <p className="mb-5">
        La suppression du projet est irréversible. Toutes les données associées
        (pages, données d'audit, recommandations) seront définitivement supprimées.
      </p>

      <Button onClick={() => setOpenDeleteModal(true)}>
        <TrashIcon />
        Supprimer le projet
      </Button>

      <Modal open={openDeleteModal} onClose={() => setOpenDeleteModal(false)}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            fontSize: "1.1rem",
          }}
        >
          <h2 className="h3">Suppression du projet "{project.name}"</h2>
          <p>
            Vous êtes sur le point de supprimer ce projet et toutes ses données
            associées (pages, données d'audit, recommandations).
          </p>
          <p>Cette action est irréversible. Êtes-vous sûr·e de vouloir continuer ?</p>
          <Button onClick={() => setOpenDeleteModal(false)}>
            <XMarkIcon />
            Non, je ne veux pas supprimer le projet
          </Button>
          <Button onClick={handleConfirm}>
            <TrashIcon />
            Oui, supprimer le projet et toutes les données associées
          </Button>
        </div>
      </Modal>
    </>
  );
}
