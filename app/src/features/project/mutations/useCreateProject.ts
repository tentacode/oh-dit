import { useMutation } from '@tanstack/react-query';
import { apiClient } from "@/src/lib/react-query/apiClient";
import { ProjectInterface } from "../types/ProjectInterface";
import { projectCacheKeys } from "../queries/cacheKeys";
import { queryClient } from "@/src/lib/react-query/queryClient";

export interface CreateScreenPayload {
  name: string;
  url: string;
  rank: number;
  uuid?: string;
}

export interface CreateProjectPayload {
  teamUuid: string;
  name: string;
  url: string;
  ruleSetUuid: string;
  screens: CreateScreenPayload[];
}

async function createProject(data: CreateProjectPayload): Promise<ProjectInterface> {
  return apiClient<ProjectInterface>('/api/projects', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function useCreateProject(teamUuid: string) {
  return useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      // Invalide le cache de la liste pour forcer un refetch
      queryClient.invalidateQueries({ queryKey: projectCacheKeys.list(teamUuid) });
    },
  });
}