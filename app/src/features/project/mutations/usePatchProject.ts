import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/src/lib/react-query/apiClient";
import { ProjectInterface } from "../types/ProjectInterface";
import { projectCacheKeys } from "../queries/cacheKeys";
import { queryClient } from "@/src/lib/react-query/queryClient";

export interface PatchProjectPayload {
  projectUuid?: string;
  name?: string;
  url?: string;
}

async function patchProject(
  data: PatchProjectPayload,
): Promise<ProjectInterface> {
  const projectUuid = data.projectUuid;
  const rest = { ...data };
  delete rest.projectUuid;

  return apiClient<ProjectInterface>(`/api/projects/${projectUuid}`, {
    method: "PATCH",
    body: JSON.stringify(rest),
  });
}

export function usePatchProject(projectUuid: string, teamUuid: string) {
  return useMutation({
    mutationFn: patchProject,
    onSuccess: () => {
      // Invalide le cache de la liste pour forcer un refetch
      queryClient.invalidateQueries({
        queryKey: projectCacheKeys.list(teamUuid),
      });
      // Invalide le cache du projet spécifique pour forcer un refetch
      queryClient.invalidateQueries({
        queryKey: projectCacheKeys.detail(projectUuid),
      });
    },
  });
}
