import { useMutation } from '@tanstack/react-query';
import { apiClient } from "@/src/lib/react-query/apiClient";

interface RegisterTeamData {
  uuid: string;
  name: string;
}

interface RegisterUserData {
  uuid: string;
  email: string;
  username: string;
  teams: RegisterTeamData[];
}

async function registerBetaUser(data: { 
  token: string;
  username: string;
  password: string;
  teamName: string;
 }): Promise<RegisterUserData> {
  return apiClient<RegisterUserData>('/api/register/beta', {
    method: 'POST',
    body: JSON.stringify(data),
  }, true);
}

export function useRegisterBetaUser() {
  return useMutation({
    mutationFn: registerBetaUser,
    onSuccess: () => {
      // Invalide le cache de la liste pour forcer un refetch
      // queryClient.invalidateQueries({ queryKey: projectCacheKeys.list() });
    },
  });
}