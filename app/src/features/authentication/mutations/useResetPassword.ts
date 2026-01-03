import { useMutation } from '@tanstack/react-query';
import { apiClient } from "@/src/lib/react-query/apiClient";

interface JwtTokenResponse {
  token: string;
}

async function resetPassword(data: { 
  token: string;
  newPassword: string;
 }): Promise<JwtTokenResponse> {
  return apiClient<JwtTokenResponse>('/api/reset_password', {
    method: 'POST',
    body: JSON.stringify(data),
  }, true);
}

export function useResetPassword() {
  return useMutation({
    mutationFn: resetPassword,
    onSuccess: () => {
      // Invalide le cache de la liste pour forcer un refetch
      // queryClient.invalidateQueries({ queryKey: projectCacheKeys.list() });
    },
  });
}