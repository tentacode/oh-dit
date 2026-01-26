import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/src/lib/react-query/apiClient";
import { queryClient } from "@/src/lib/react-query/queryClient";
import { projectCacheKeys } from "../../project/queries/cacheKeys";

async function deleteSecuredLink(data: {
  projectUuid?: string;
}): Promise<void> {
  return apiClient<void>("/api/projects/" + data.projectUuid + "/secured-link", {
    method: "DELETE",
  });
}

export function useDeleteSecuredLink(projectUuid?: string) {
  return useMutation({
    mutationFn: deleteSecuredLink,
    onSuccess: () => {
      if (!projectUuid) {
        return;
      }

      queryClient.invalidateQueries({ queryKey: projectCacheKeys.detail(projectUuid) });
    },
  });
}
