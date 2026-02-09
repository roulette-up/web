import { useMutation } from '@tanstack/react-query'
import { cancelOrder } from '../../apis/order'

export function useCancelOrder() {
  return useMutation({
    mutationFn: cancelOrder,
  })
}
