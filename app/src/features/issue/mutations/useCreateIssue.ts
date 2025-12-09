import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/src/lib/react-query/apiClient";
import {
  IssueInterface,
  Severity,
} from "../types/IssueInterface";
// import { queryClient } from "@/src/lib/react-query/queryClient";
// import { issuesCacheKeys } from "../queries/cacheKeys";

async function createIssue(data: {
  severity: Severity;
  text: string;
  ruleUuid: string;
  projectUuid: string;
  screenUuid: string;
}): Promise<IssueInterface> {
  return apiClient<IssueInterface>("/api/issues", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function useCreateIssue() {
  return useMutation({
    mutationFn: createIssue,
    onSuccess: () => {
      // Invalide le cache de la liste pour forcer un refetch
      // Pas nécessaire puisqu'on met à jour le store localement
      // queryClient.invalidateQueries({ queryKey: issuesCacheKeys.list() });
    },
  });
}
