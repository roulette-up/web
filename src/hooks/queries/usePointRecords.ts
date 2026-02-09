import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { getPointRecords } from '../../apis/point'
import { storage } from '../../utils/storage'
import type { ApiResponse } from '../../types/api'
import type { PointRecordPage } from '../../types/point'

type UsePointRecordsParams = {
  page: number
  size: number
}

export function usePointRecords({ page, size }: UsePointRecordsParams) {
  const auth = storage.getAuth()
  const userId = auth?.id ?? null

  return useQuery<ApiResponse<PointRecordPage>>({
    queryKey: ['point-records', userId, page, size],
    queryFn: () => getPointRecords({ page, size, sort: ['id,DESC'] }),
    enabled: Boolean(userId),
    placeholderData: keepPreviousData,
  })
}
