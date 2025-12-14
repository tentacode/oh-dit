// queries/useUpdateProjectMetrics.ts
import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/src/lib/react-query/apiClient";
import { useAuditStore } from "../../audit/store/auditStore";

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
  const { project, setProject } = useAuditStore();

  return useMutation({
    mutationFn: fetchProjectMetrics,
    onSuccess: (metrics) => {
      if (!project) return;

      setProject({
        ...project,
        progress: metrics.progress,
        complianceRate: metrics.complianceRate,
        screens: project.screens.map((screen) => {
          const updated = metrics.screens.find((s) => s.uuid === screen.uuid);
          return updated
            ? { ...screen, progress: updated.progress, complianceRate: updated.complianceRate }
            : screen;
        }),
      });
    },
  });
}