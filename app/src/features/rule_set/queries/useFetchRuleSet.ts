import { apiClient } from "@/src/lib/react-query/apiClient";
import { useQuery } from '@tanstack/react-query';
import { RuleSet } from "../types/RuleSetTypes";

async function fetchRuleSet(ruleSetUuid: string): Promise<RuleSet> {
  return apiClient<RuleSet>(`/api/rule_sets/${ruleSetUuid}`);
}

export function useFetchRuleSet(ruleSetUuid: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ['ruleSet', ruleSetUuid],
    queryFn: () => fetchRuleSet(ruleSetUuid),
    enabled: options?.enabled ?? true,
  });
}