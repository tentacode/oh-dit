import { apiClient } from "@/src/lib/react-query/apiClient";
import { useQuery } from '@tanstack/react-query';
import { ProjectInterface } from "../types/ProjectInterface";
import { projectCacheKeys } from "./cacheKeys";

async function fetchProjects(teamUuid: string): Promise<ProjectInterface[]> {
  return apiClient<ProjectInterface[]>(`/api/teams/${teamUuid}/projects`);
}

export function useFetchProjects(teamUuid: string) {
  return useQuery({
    queryKey: projectCacheKeys.list(teamUuid),
    queryFn: () => fetchProjects(teamUuid),
  });
}