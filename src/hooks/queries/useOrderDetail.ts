import { useQuery } from '@tanstack/react-query'
import { getOrderById } from '../../apis/order'
import type { ApiResponse } from '../../types/api'
import type { OrderDetail } from '../../types/order'

type UseOrderDetailParams = {
  orderId: number | null
}

export function useOrderDetail({ orderId }: UseOrderDetailParams) {
  return useQuery<ApiResponse<OrderDetail>>({
    queryKey: ['order-detail', orderId],
    queryFn: () => getOrderById(orderId as number),
    enabled: typeof orderId === 'number',
  })
}
