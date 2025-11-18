export const compliancesCacheKeys = {
  all: ['compliances'] as const,
  list: () => [...compliancesCacheKeys.all, 'list'] as const,
  detail: (uuid: string) => [...compliancesCacheKeys.all, 'detail', uuid] as const,
};