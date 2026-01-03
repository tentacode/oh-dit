import { useMutation } from '@tanstack/react-query';
import { apiClient } from "@/src/lib/react-query/apiClient";

interface LoginResponse {
  token: string;
}

async function login(data: { 
  email: string;
  password: string;
 }): Promise<LoginResponse> {
  return apiClient<LoginResponse>('/api/login_check', {
    method: 'POST',
    body: JSON.stringify(data),
  }, true);
}

export function useLogin() {
  return useMutation({
    mutationFn: login,
    onSuccess: () => {
      // Invalide le cache de la liste pour forcer un refetch
      // queryClient.invalidateQueries({ queryKey: projectCacheKeys.list() });
    },
  });
}