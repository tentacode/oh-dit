import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/src/lib/react-query/apiClient";
import { Project, useAuditStore } from "../../audit/store/auditStore";
import { queryClient } from "@/src/lib/react-query/queryClient";
import { projectCacheKeys } from "./cacheKeys";

interface ProjectMetrics {
  progress: number;
  complianceRate: number;
  screens: {
    uuid: string;
    progress: number;
    complianceRate: number;
  }[];
}

async function fetchProjectMetrics(projectUuid: string): Promise<ProjectMetrics> {
  return apiClient<ProjectMetrics>(`/api/projects/${projectUuid}/update-metrics`, {
    method: 'POST',
  });
}

export function useUpdateProjectMetrics() {
  const { project } = useAuditStore();

  return useMutation({
    mutationFn: fetchProjectMetrics,
    onSuccess: (metrics) => {
      if (!project) return;

      // Met à jour le cache React Query, pas le store
      queryClient.setQueryData(
        projectCacheKeys.detail(project.uuid),
        (old: Project | undefined) => {
          if (!old) return old;
          return {
            ...old,
            progress: metrics.progress,
            complianceRate: metrics.complianceRate,
            screens: old.screens.map((screen) => {
              const updated = metrics.screens.find((s) => s.uuid === screen.uuid);
              return updated
                ? { ...screen, progress: updated.progress, complianceRate: updated.complianceRate }
                : screen;
            }),
          };
        }
      );
      
      // queryClient.invalidateQueries({ queryKey: projectCacheKeys.detail(project.uuid) });
    },
  });
}