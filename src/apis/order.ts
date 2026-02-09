import type { ApiResponse } from '../types/api'
import type { OrderReq } from '../types/order'
import { request } from './http'

export async function createOrder(payload: OrderReq) {
  const response = await request<void>('/api/v1/orders', {
    method: 'POST',
    body: payload,
    includeUserId: true,
  })

  return response as ApiResponse<void>
}
