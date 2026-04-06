import { useMutation } from '@tanstack/react-query';
import { apiClient } from "@/src/lib/react-query/apiClient";

async function sendConfirmationLink(data: { 
  email: string;
 }): Promise<void> {
  return apiClient<void>('/api/register/send-confirmation-link', {
    method: 'POST',
    body: JSON.stringify(data),
  }, true);
}

export function useSendConfirmationLink() {
  return useMutation({
    mutationFn: sendConfirmationLink,
    onSuccess: () => {
      // Invalide le cache de la liste pour forcer un refetch
      // queryClient.invalidateQueries({ queryKey: projectCacheKeys.list() });
    },
  });
}