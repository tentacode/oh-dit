import { apiClient } from "@/src/lib/react-query/apiClient";
import { useQuery } from '@tanstack/react-query';
import { IssueInterface } from "../types/IssueInterface";
import { issuesCacheKeys } from "./cacheKeys";

async function fetchProjectIssues(projectUuid: string): Promise<IssueInterface[]> {
  return apiClient<IssueInterface[]>(`/api/projects/${projectUuid}/issues`);
}

export function useFetchProjectIssues(projectUuid: string) {
  return useQuery({
    queryKey: issuesCacheKeys.list(),
    queryFn: () => fetchProjectIssues(projectUuid),
  });
}