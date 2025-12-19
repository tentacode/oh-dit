export const projectCacheKeys = {
  all: ['projects'] as const,
  list: (teamUuid: string) => [...projectCacheKeys.all, 'list', teamUuid] as const,
  detail: (uuid: string) => [...projectCacheKeys.all, 'detail', uuid] as const,
};