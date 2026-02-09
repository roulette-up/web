import { useQuery } from '@tanstack/react-query'
import { getProducts } from '../../apis/product'
import type { ApiResponse } from '../../types/api'
import type { ProductPage } from '../../types/product'

type UseProductsParams = {
  page: number
  size: number
}

export function useProducts({ page, size }: UseProductsParams) {
  return useQuery<ApiResponse<ProductPage>>({
    queryKey: ['products', page, size],
    queryFn: () => getProducts({ page, size, sort: ['id,DESC'] }),
  })
}
