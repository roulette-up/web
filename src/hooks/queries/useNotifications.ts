import { useInfiniteQuery } from '@tanstack/react-query'
import { getNotifications } from '../../apis/notification'
import type { ApiResponse } from '../../types/api'
import type { NotificationPage } from '../../types/notification'
import { storage } from '../../utils/storage'

export function useNotifications() {
  const auth = storage.getAuth()
  const userId = auth?.id ?? null

  return useInfiniteQuery<ApiResponse<NotificationPage>>({
    queryKey: ['notifications', userId],
    queryFn: ({ pageParam }) => getNotifications({ cursorId: pageParam as number | null }),
    initialPageParam: null,
    getNextPageParam: (lastPage) => {
      const data = lastPage.data
      if (!data?.hasNext) return undefined
      return data.nextCursor ?? undefined
    },
    enabled: Boolean(userId),
  })
}
