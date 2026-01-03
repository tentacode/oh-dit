import { useMutation } from '@tanstack/react-query';
import { apiClient } from "@/src/lib/react-query/apiClient";

async function forgotPassword(data: { 
  email: string;
 }): Promise<void> {
  return apiClient<void>('/api/forgot_password', {
    method: 'POST',
    body: JSON.stringify(data),
  }, true);
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: forgotPassword,
    onSuccess: () => {
      // Invalide le cache de la liste pour forcer un refetch
      // queryClient.invalidateQueries({ queryKey: projectCacheKeys.list() });
    },
  });
}