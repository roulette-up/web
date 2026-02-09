import type { ApiResponse } from '../types/api'
import type { ProductDetail, ProductPage } from '../types/product'
import { request } from './http'

type Pageable = {
  page: number
  size: number
  sort?: string[]
}

export async function getProducts(pageable: Pageable) {
  const params = new URLSearchParams()
  params.set('page', String(pageable.page))
  params.set('size', String(pageable.size))
  if (pageable.sort) {
    pageable.sort.forEach((value) => params.append('sort', value))
  }

  const response = await request<ProductPage>(`/api/v1/products?${params.toString()}`)
  return response as ApiResponse<ProductPage>
}

export async function getProductById(productId: number) {
  const response = await request<ProductDetail>(`/api/v1/products/${productId}`)
  return response as ApiResponse<ProductDetail>
}
