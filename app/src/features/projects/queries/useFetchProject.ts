import { apiClient } from "@/src/lib/react-query/apiClient";
import { useQuery } from '@tanstack/react-query';
import { ProjectInterface } from "../types/ProjectInterface";
import { projectCacheKeys } from "./cacheKeys";

async function fetchProject(projectUuid: string): Promise<ProjectInterface> {
  return apiClient<ProjectInterface>(`/api/projects/${projectUuid}`);
}

export function useFetchProject(projectUuid: string) {
  return useQuery({
    queryKey: projectCacheKeys.detail(projectUuid),
    queryFn: () => fetchProject(projectUuid),
  });
}