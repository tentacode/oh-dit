import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/src/lib/react-query/apiClient";
import {
  IssueInterface,
  Severity,
} from "../types/IssueInterface";
// import { queryClient } from "@/src/lib/react-query/queryClient";
// import { issuesCacheKeys } from "../queries/cacheKeys";

async function updateIssue(data: {
  issueUuid?: string;
  severity: Severity;
  text: string;
  status: 'pending' | 'fixed';
}): Promise<IssueInterface> {
  const issueUuid = data.issueUuid;
  delete data.issueUuid;

  return apiClient<IssueInterface>("/api/issues/" + issueUuid, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export function useUpdateIssue() {
  return useMutation({
    mutationFn: updateIssue,
    onSuccess: () => {
      // Invalide le cache de la liste pour forcer un refetch
      // Pas nécessaire puisqu'on met à jour le store localement
      // queryClient.invalidateQueries({ queryKey: issuesCacheKeys.list() });
    },
  });
}
