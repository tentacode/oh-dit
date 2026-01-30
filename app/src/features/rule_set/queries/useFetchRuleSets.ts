import { apiClient } from "@/src/lib/react-query/apiClient";
import { useQuery } from '@tanstack/react-query';
import { RuleSet } from "../types/RuleSetTypes";

async function fetchRuleSets(): Promise<RuleSet[]> {
  return apiClient<RuleSet[]>(`/api/rule_sets`);
}

export function useFetchRuleSets(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ['ruleSets'],
    queryFn: () => fetchRuleSets(),
    enabled: options?.enabled ?? true,
  });
}