import type { ApiResponse } from '../types/api'
import type { OrderDetail, OrderPage, OrderReq } from '../types/order'
import { request } from './http'

type Pageable = {
  page: number
  size: number
  sort?: string[]
}

export async function createOrder(payload: OrderReq) {
  const response = await request<void>('/api/v1/orders', {
    method: 'POST',
    body: payload,
    includeUserId: true,
  })

  return response as ApiResponse<void>
}

export async function getMyOrders(pageable: Pageable) {
  const params = new URLSearchParams()
  params.set('page', String(pageable.page))
  params.set('size', String(pageable.size))
  if (pageable.sort) {
    pageable.sort.forEach((value) => params.append('sort', value))
  }

  const response = await request<OrderPage>(`/api/v1/orders/my?${params.toString()}`, {
    includeUserId: true,
  })

  return response as ApiResponse<OrderPage>
}

export async function getOrderById(orderId: number) {
  const response = await request<OrderDetail>(`/api/v1/orders/${orderId}`, {
    includeUserId: true,
  })

  return response as ApiResponse<OrderDetail>
}

export async function cancelOrder(orderId: number) {
  const response = await request<void>(`/api/v1/orders/${orderId}/cancel`, {
    method: 'PATCH',
    includeUserId: true,
  })

  return response as ApiResponse<void>
}
