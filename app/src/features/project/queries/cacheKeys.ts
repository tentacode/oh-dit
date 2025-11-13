export const projectCacheKeys = {
  all: ['projects'] as const,
  list: () => [...projectCacheKeys.all, 'list'] as const,
  detail: (uuid: string) => [...projectCacheKeys.all, 'detail', uuid] as const,
};