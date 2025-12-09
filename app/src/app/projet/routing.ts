export const getProjectUrl = {
  dashboard: (projectUuid: string) => `/projet/${projectUuid}/resume` as const,
  new: () => `/projet/nouveau` as const,
  auditScreen: (projectUuid: string, screenUuid?: string) => `/projet/${projectUuid}/audit/screen/${screenUuid ?? "default"}` as const,
  auditWithIssue: (
    projectUuid: string,
    ruleUuid: string,
    screenUuid: string
  ) =>
    `/projet/${projectUuid}/audit/screen/${screenUuid}/rule/${ruleUuid}/issues` as const,
  auditWithComments: (
    projectUuid: string,
    ruleUuid: string,
    screenUuid: string
  ) =>
    `/projet/${projectUuid}/audit/screen/${screenUuid}/rule/${ruleUuid}/comments` as const,
  issues: (projectUuid: string) =>
    `/projet/${projectUuid}/recommandations` as const,
  deliverables: (projectUuid: string) =>
    `/projet/${projectUuid}/livrables` as const,
  settings: (projectUuid: string) =>
    `/projet/${projectUuid}/parametres` as const,
} as const;

export const isProjectRoute = {
  dashboard: (pathname: string) => pathname.endsWith("/resume"),
  audit: (pathname: string) => pathname.includes("/audit"),
  issues: (pathname: string) => pathname.includes("/recommandations"),
  deliverables: (pathname: string) => pathname.includes("/livrables"),
  settings: (pathname: string) => pathname.includes("/parametres"),
} as const;
