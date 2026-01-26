import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/src/lib/react-query/apiClient";

interface LoginSecuredLinkResponse {
  token: string;
}

async function loginSecuredLink(data: {
  linkToken: string;
  password: string;
}): Promise<LoginSecuredLinkResponse> {
  const { linkToken, ...rest } = data;

  return apiClient<LoginSecuredLinkResponse>("/api/secured-link/" + linkToken + "/login", {
    method: "POST",
    body: JSON.stringify(rest),
  });
}

export function useLoginSecuredLink() {
  return useMutation({
    mutationFn: loginSecuredLink,
    onSuccess: () => {
      // Nothing to do on success for now
    },
  });
}
