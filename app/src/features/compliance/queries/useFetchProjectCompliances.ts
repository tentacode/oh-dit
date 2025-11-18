import { apiClient } from "@/src/lib/react-query/apiClient";
import { useQuery } from '@tanstack/react-query';
import { ComplianceInterface } from "../types/ComplianceInterface";
import { compliancesCacheKeys } from "./cacheKeys";

async function fetchProjectCompliances(projectUuid: string): Promise<ComplianceInterface[]> {
  return apiClient<ComplianceInterface[]>(`/api/projects/${projectUuid}/compliances`);
}

export function useFetchProjectCompliances(projectUuid: string) {
  return useQuery({
    queryKey: compliancesCacheKeys.list(),
    queryFn: () => fetchProjectCompliances(projectUuid),
  });
}