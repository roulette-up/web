import { useQuery } from '@tanstack/react-query'
import { getProductById } from '../../apis/product'
import type { ApiResponse } from '../../types/api'
import type { ProductDetail } from '../../types/product'

type UseProductDetailParams = {
  productId: number | null
}

export function useProductDetail({ productId }: UseProductDetailParams) {
  return useQuery<ApiResponse<ProductDetail>>({
    queryKey: ['product-detail', productId],
    queryFn: () => getProductById(productId as number),
    enabled: typeof productId === 'number',
  })
}
