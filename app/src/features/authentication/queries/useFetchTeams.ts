import { apiClient } from "@/src/lib/react-query/apiClient";
import { useQuery } from '@tanstack/react-query';
import { teams } from "./cacheKeys";

interface FetchTeamResponse {
  uuid: string;
  name: string;
}

async function fetchTeams(): Promise<FetchTeamResponse[]> {
  return apiClient<FetchTeamResponse[]>(`/api/teams`, {
    method: "GET",
  });
}

export function useFetchTeams() {
  return useQuery({
    queryKey: teams.all,
    queryFn: () => fetchTeams(),
  });
}