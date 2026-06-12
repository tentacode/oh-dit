import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/src/lib/react-query/apiClient";
import { queryClient } from "@/src/lib/react-query/queryClient";
import { projectCacheKeys } from "../queries/cacheKeys";

export function useDeleteProject(projectUuid: string, teamUuid: string) {
  return useMutation({
    mutationFn: () =>
      apiClient<void>(`/api/projects/${projectUuid}`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectCacheKeys.list(teamUuid) });
    },
  });
}
