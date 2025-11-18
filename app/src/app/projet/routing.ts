export const getProjectUrl = {
  dashboard: (projectUuid: string) => `/projet/${projectUuid}/resume` as const,
  audit: (projectUuid: string) => `/projet/${projectUuid}/audit` as const,
  auditWithRecommendation: (
    projectUuid: string,
    ruleUuid: string,
    screenUuid: string
  ) =>
    `/projet/${projectUuid}/audit/${ruleUuid}/${screenUuid}/recommendations` as const,
  auditWithComments: (
    projectUuid: string,
    ruleUuid: string,
    screenUuid: string
  ) =>
    `/projet/${projectUuid}/audit/${ruleUuid}/${screenUuid}/comments` as const,
  recommendations: (projectUuid: string) =>
    `/projet/${projectUuid}/recommandations` as const,
  deliverables: (projectUuid: string) =>
    `/projet/${projectUuid}/livrables` as const,
  settings: (projectUuid: string) =>
    `/projet/${projectUuid}/parametres` as const,
} as const;

export const isProjectRoute = {
  dashboard: (pathname: string) => pathname.endsWith("/resume"),
  audit: (pathname: string) => pathname.includes("/audit"),
  recommendations: (pathname: string) => pathname.includes("/recommandations"),
  deliverables: (pathname: string) => pathname.includes("/livrables"),
  settings: (pathname: string) => pathname.includes("/parametres"),
} as const;
