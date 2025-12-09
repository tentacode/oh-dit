export const issuesCacheKeys = {
  all: ['issues'] as const,
  list: () => [...issuesCacheKeys.all, 'list'] as const,
  detail: (uuid: string) => [...issuesCacheKeys.all, 'detail', uuid] as const,
};