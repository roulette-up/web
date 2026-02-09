import { useQuery } from '@tanstack/react-query'
import { getUserPoint } from '../../apis/user'
import { storage } from '../../utils/storage'
import type { ApiResponse } from '../../types/api'
import type { UserPointRes } from '../../types/user'

export const userPointQueryKey = (userId: number | null) => ['user-point', userId]

export function useUserPoint() {
  const auth = storage.getAuth()
  const userId = auth?.id ?? null

  return useQuery<ApiResponse<UserPointRes>>({
    queryKey: userPointQueryKey(userId),
    queryFn: getUserPoint,
    enabled: Boolean(userId),
  })
}
