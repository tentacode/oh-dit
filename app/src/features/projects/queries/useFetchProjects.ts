import { apiClient } from "@/src/lib/react-query/apiClient";
import { useQuery } from '@tanstack/react-query';
import { ProjectInterface } from "../types/ProjectInterface";
import { projectCacheKeys } from "./cacheKeys";

async function fetchProjects(): Promise<ProjectInterface[]> {
  return apiClient<ProjectInterface[]>('/api/projects');
}

export function useFetchProjects() {
  return useQuery({
    queryKey: projectCacheKeys.list(),
    queryFn: fetchProjects,
  });
}