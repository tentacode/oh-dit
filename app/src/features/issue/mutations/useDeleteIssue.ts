import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/src/lib/react-query/apiClient";
// import { queryClient } from "@/src/lib/react-query/queryClient";
// import { issuesCacheKeys } from "../queries/cacheKeys";

async function deleteIssue(data: {
  issueUuid?: string;
}): Promise<void> {
  return apiClient<void>("/api/issues/" + data.issueUuid, {
    method: "DELETE",
  });
}

export function useDeleteIssue() {
  return useMutation({
    mutationFn: deleteIssue,
    onSuccess: () => {
      // Invalide le cache de la liste pour forcer un refetch
      // Pas nécessaire puisqu'on met à jour le store localement
      // queryClient.invalidateQueries({ queryKey: issuesCacheKeys.list() });
    },
  });
}
