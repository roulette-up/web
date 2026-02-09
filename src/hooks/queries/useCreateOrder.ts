import { useMutation } from '@tanstack/react-query'
import { createOrder } from '../../apis/order'

export function useCreateOrder() {
  return useMutation({
    mutationFn: createOrder,
  })
}
