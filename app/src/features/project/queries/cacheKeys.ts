export const projectCacheKeys = {
  all: ['projects'] as const,
  list: (teamUuid: string) => [...projectCacheKeys.all, 'list', teamUuid] as const,
  detail: (uuid: string) => [...projectCacheKeys.all, 'detail', uuid] as const,
};

export const screenCacheKeys = {
  all: ['screens'] as const,
  list: (projectUuid: string) => [...screenCacheKeys.all, 'list', projectUuid] as const,
  detail: (uuid: string) => [...screenCacheKeys.all, 'detail', uuid] as const,
};