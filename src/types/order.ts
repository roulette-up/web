export type OrderReq = {
  productId: number
  price: number
  quantity: number
}

export type OrderStatus = 'COMPLETED' | 'USER_CANCELLED' | 'ADMIN_CANCELLED'

export type Order = {
  id: number
  quantity: number
  productPrice: number
  productName: string
  status: OrderStatus
}

export type OrderDetail = Order & {
  productId: number
  createdAt: string
}

export type OrderPage = {
  content: Order[]
  page: {
    size: number
    number: number
    totalElements: number
    totalPages: number
  }
}
