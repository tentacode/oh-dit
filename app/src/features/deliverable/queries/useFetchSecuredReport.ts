import { apiClient } from "@/src/lib/react-query/apiClient";
import { useQuery } from "@tanstack/react-query";
import { reports } from "./cacheKeys";
import { ProjectStatus } from "../../project/types/ProjectInterface";

export interface FetchSecuredReportResponse {
  project: {
    name: string;
    status: ProjectStatus;
    progress: number;
    complianceRate: number;
    updatedAt: string;
    ruleSet: {
      name: string;
      version: string;
      description: string;
      ruleCategories: Array<{
        prefix: string;
        name: string;
        rules: Array<{
          uuid: string;
          prefix: string;
          shortDescription: string;
        }>;
      }>;
    };
    screens: Array<{
      uuid: string;
      url: string;
      name: string;
      progress: number;
      complianceRate: number;
    }>;
  };
  issues: Array<{
    uuid: string;
    issueId: number;
    severity: 'blocking' | 'moderate' | 'low';
    status: 'pending' | 'fixed';
    text: string;
    updatedAt: string;
    ruleUuid: string;
    screenUuid: string;
  }>;
}

async function fetchSecuredReport(
  securedLinkToken: string,
  securedLinkJwtToken: string,
): Promise<FetchSecuredReportResponse> {
  return apiClient<FetchSecuredReportResponse>(
    `/api/secured-link/${securedLinkToken}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${securedLinkJwtToken}`,
      },
    },
  );
}

export function useFetchSecuredReport(
  securedLinkToken: string,
  securedLinkJwtToken: string,
) {
  return useQuery({
    queryKey: reports.detail(securedLinkToken),
    queryFn: () => fetchSecuredReport(securedLinkToken, securedLinkJwtToken),
  });
}
