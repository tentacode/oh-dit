import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/src/lib/react-query/apiClient";
import {
  ComplianceInterface,
  ComplianceStatus,
} from "../types/ComplianceInterface";

async function createCompliance(data: {
  status: ComplianceStatus;
  ruleUuid: string;
  projectUuid: string;
  screenUuid: string;
}): Promise<ComplianceInterface> {
  return apiClient<ComplianceInterface>("/api/compliances", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function useCreateCompliance() {
  return useMutation({
    mutationFn: createCompliance,
    onSuccess: () => {
      // Invalide le cache de la liste pour forcer un refetch
      // Pas nécessaire puisqu'on met à jour le store localement avant l'appel API
      // queryClient.invalidateQueries({ queryKey: compliancesCacheKeys.list() });
    },
  });
}
