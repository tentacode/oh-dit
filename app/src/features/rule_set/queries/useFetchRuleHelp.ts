import { apiClient } from "@/src/lib/react-query/apiClient";
import { useQuery } from '@tanstack/react-query';

interface RuleHelp {
  content: string;
}

async function fetchRuleHelp(ruleUuid: string): Promise<RuleHelp> {
  return apiClient<RuleHelp>(`/api/documentation/rule/${ruleUuid}`);
}

export function useFetchRuleHelp(ruleUuid: string) {
  return useQuery({
    queryKey: ['documentation', ruleUuid],
    queryFn: () => fetchRuleHelp(ruleUuid),
  });
}