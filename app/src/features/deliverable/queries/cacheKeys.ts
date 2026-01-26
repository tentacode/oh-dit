export const reports = {
  all: ['reports'] as const,
  detail: (securedLinkToken: string) => ['reports', securedLinkToken] as const,
};