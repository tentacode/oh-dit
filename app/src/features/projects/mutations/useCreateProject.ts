import { useMutation } from '@tanstack/react-query';
import { apiClient } from "@/src/lib/react-query/apiClient";
import { ProjectInterface } from "../types/ProjectInterface";
import { projectCacheKeys } from "../queries/cacheKeys";
import { queryClient } from "@/src/lib/react-query/queryClient";

async function createProject(data: { name: string; screens: string[] }): Promise<ProjectInterface> {
  return apiClient<ProjectInterface>('/api/projects', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function useCreateProject() {
  return useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      // Invalide le cache de la liste pour forcer un refetch
      queryClient.invalidateQueries({ queryKey: projectCacheKeys.list() });
    },
  });
}