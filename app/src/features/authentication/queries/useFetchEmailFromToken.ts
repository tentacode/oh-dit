import { apiClient } from "@/src/lib/react-query/apiClient";
import { useQuery } from '@tanstack/react-query';
import { emailTokenKeys } from "./cacheKeys";

interface FetchEmailFromTokenResponse {
  email: string;
}

async function fetchEmailFromToken(token: string): Promise<FetchEmailFromTokenResponse> {
  return apiClient<FetchEmailFromTokenResponse>(`/api/register/decode-email-token`, {
    method: "POST",
    body: JSON.stringify({ token: token }),
  }, true);
}

export function useFetchEmailFromToken(token: string) {
  return useQuery({
    queryKey: emailTokenKeys.all,
    queryFn: () => fetchEmailFromToken(token),
  });
}