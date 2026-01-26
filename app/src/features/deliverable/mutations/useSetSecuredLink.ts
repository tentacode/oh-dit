import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/src/lib/react-query/apiClient";
import { queryClient } from "@/src/lib/react-query/queryClient";
import { projectCacheKeys } from "../../project/queries/cacheKeys";

export interface SetSecuredLinkResponse {
  token: string;
}

async function setSecuredLink(data: {
  projectUuid: string;
  password: string;
}): Promise<SetSecuredLinkResponse> {
  const { projectUuid, ...rest } = data;

  return apiClient<SetSecuredLinkResponse>(`/api/projects/${projectUuid}/secured-link`, {
    method: "POST",
    body: JSON.stringify(rest),
  });
}

export function useSetSecuredLink(projectUuid: string | undefined) {
  return useMutation({
    mutationFn: setSecuredLink,
    onSuccess: () => {
      if (!projectUuid) return;
      
      queryClient.invalidateQueries({ queryKey: projectCacheKeys.detail(projectUuid) });
    },
  });
}
