import { useQuery } from '@tanstack/react-query'
import { getMyOrders } from '../../apis/order'
import type { ApiResponse } from '../../types/api'
import type { OrderPage } from '../../types/order'
import { storage } from '../../utils/storage'

type UseOrdersParams = {
  page: number
  size: number
}

export function useOrders({ page, size }: UseOrdersParams) {
  const auth = storage.getAuth()
  const userId = auth?.id ?? null

  return useQuery<ApiResponse<OrderPage>>({
    queryKey: ['orders', userId, page, size],
    queryFn: () => getMyOrders({ page, size, sort: ['id,DESC'] }),
    enabled: Boolean(userId),
  })
}
