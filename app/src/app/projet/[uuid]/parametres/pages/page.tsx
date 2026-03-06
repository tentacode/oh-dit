"use client";

import Button from "@/src/design-system/components/button/Button";
import Modal from "@/src/design-system/components/modal/Modal";
import { useAuditSettingsStore } from "@/src/features/audit/store/auditSettingsStore";
import { useAuditStore } from "@/src/features/audit/store/auditStore";
import EditScreens from "@/src/features/project/components/NewProjectForm/EditScreens";
import { CreateScreenPayload } from "@/src/features/project/mutations/useCreateProject";
import { projectCacheKeys } from "@/src/features/project/queries/cacheKeys";
import { useUpdateProjectMetrics } from "@/src/features/project/queries/useUpdateProjectMetrics";
import { ScreenInterface } from "@/src/features/project/types/ScreenInterface";
import { apiClient } from "@/src/lib/react-query/apiClient";
import { TrashIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useState } from "react";

export default function PagesSettingsPage() {
  const project = useAuditStore((state) => state.project);
  const ruleSet = useAuditStore((state) => state.ruleSet);
  const getProjectSetting = useAuditSettingsStore(
    (state) => state.getProjectSetting,
  );
  const setProjectSetting = useAuditSettingsStore(
    (state) => state.setProjectSetting
  );

  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [screenToDelete, setScreenToDelete] =
    useState<CreateScreenPayload | null>(null);

  const queryClient = useQueryClient();

  const updateProjectMetrics = useUpdateProjectMetrics();

  const t = useTranslations();

  if (!project || !ruleSet) {
    return null;
  }

  let ruleSetType: "web" | "mobile" | "document" = "web";

  if (ruleSet.name === "RAAM") {
    ruleSetType = "mobile";
  }

  if (ruleSet.name === "RAPDF") {
    ruleSetType = "document";
  }

  const doDeleteScreen = async (screen: CreateScreenPayload) => {
    await apiClient(`/api/screens/${screen.uuid}`, {
      method: "DELETE",
    });

    queryClient.invalidateQueries({ queryKey: projectCacheKeys.detail(project.uuid) });

    // Need to update metric to get progress and compliance rate right
    updateProjectMetrics.mutateAsync(project.uuid);

    // Prevent bug where after deleting the screen that is currently selected in audit
    // the page selector would not work
    const projectSetting = getProjectSetting(project.uuid);
    if (projectSetting.currentScreenUuid === screen.uuid) {
      setProjectSetting({
        projectUuid: project.uuid,
        currentScreenUuid: null,
      });
    }
  }

  const onDeleteScreen = async (screen: CreateScreenPayload) => {
    const data = await queryClient.fetchQuery({
      queryKey: ["screen", screen.uuid],
      queryFn: () => apiClient<ScreenInterface>(`/api/screens/${screen.uuid}`),
    });

    if (data.issueCount === 0 && data.complianceCount === 0) {
      // We can safely delete the screen without showing the confirmation modal
      await doDeleteScreen(screen);
      return;
    }

    setScreenToDelete(screen);
    setOpenDeleteModal(true);
  };

  const deleteFromModal = async () => {
    if (!screenToDelete) {
      return;
    }

    await doDeleteScreen(screenToDelete);

    setOpenDeleteModal(false);
    setScreenToDelete(null);
  };

  const onScreensChange = async (screens: CreateScreenPayload[]) => {
    for (const screen of screens) {
      if (!screen.uuid) {
        await apiClient("/api/screens", {
          method: "POST",
          body: JSON.stringify({
            name: screen.name,
            url: screen.url,
            projectUuid: project.uuid,
            rank: screen.rank,
          }),
        });

        // Need to update metric to get progress right
        updateProjectMetrics.mutateAsync(project.uuid);
      } else {
        await apiClient(`/api/screens/${screen.uuid}`, {
          method: "PATCH",
          body: JSON.stringify({
            name: screen.name,
            url: screen.url,
            rank: screen.rank,
          }),
        });
      }
    }

    queryClient.invalidateQueries({ queryKey: projectCacheKeys.detail(project.uuid) });
  };

  return (
    <>
      <title>Pages du projet - Ohdit</title>
      <h2 className="h2 mb-5">
        {t(`ruleSet.${ruleSetType}.screens`)} du projet
      </h2>

      <EditScreens
        context="project_exists"
        onChange={onScreensChange}
        onDelete={(screen) => onDeleteScreen(screen)}
        values={project.screens as CreateScreenPayload[]}
        ruleSetName={ruleSet.name}
        showFieldSetTitle={false}
      />

      <Modal open={openDeleteModal} onClose={() => {
        setOpenDeleteModal(false);
        setScreenToDelete(null);
      }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            fontSize: "1.1rem",
          }}
        >
          <h2 className="h3">Suppression de la page "{screenToDelete?.name}"</h2>
          <p>
            La page que vous voulez supprimer contient des données d'audit
            (statut de conformité, discussion ou recommandations).
          </p>
          <p>
            Si vous supprimez cette page, toutes les données associées seront
            également supprimées.
          </p>
          <p>Êtes-vous sûr·e de vouloir supprimer cette page ?</p>
          <Button onClick={() => {
            setOpenDeleteModal(false);
            setScreenToDelete(null);
          }}>
            <XMarkIcon />
            Non, je ne veux pas supprimer la page
          </Button>
          <Button onClick={deleteFromModal}>
            <TrashIcon />
            Oui, supprimer la page et les données associées
          </Button>
        </div>
      </Modal>
    </>
  );
}
