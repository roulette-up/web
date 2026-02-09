import { useMemo, useState } from 'react'
import PageState from '../../components/common/PageState'
import { useQueryClient } from '@tanstack/react-query'
import { useProducts } from '../../hooks/queries/useProducts'
import { useProductDetail } from '../../hooks/queries/useProductDetail'
import { useCreateOrder } from '../../hooks/queries/useCreateOrder'
import { useUserPoint } from '../../hooks/queries/useUserPoint'

const PAGE_SIZE = 12

const formatDateTime = (value?: string) => {
  if (!value) return '-'
  const normalized = value.replace('T', ' ')
  const [datePart, timePart = ''] = normalized.split(' ')
  const time = timePart.split('.')[0]?.slice(0, 5) ?? ''
  if (!datePart || !time) return value
  return `${datePart} ${time}`
}

function ProductListPage() {
  const [page, setPage] = useState(0)
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null)
  const [isOrderOpen, setIsOrderOpen] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [orderError, setOrderError] = useState('')
  const [orderSuccess, setOrderSuccess] = useState(false)
  const { data, isLoading, isError, error, refetch } = useProducts({
    page,
    size: PAGE_SIZE,
  })
  const {
    data: detailData,
    isLoading: isDetailLoading,
    isError: isDetailError,
    error: detailError,
  } = useProductDetail({ productId: selectedProductId })
  const { data: pointData } = useUserPoint()
  const { mutateAsync, isPending: isOrdering } = useCreateOrder()
  const queryClient = useQueryClient()

  const pageInfo = data?.data?.page
  const products = data?.data?.content ?? []
  const totalPages = pageInfo?.totalPages ?? 0
  const userPoint = pointData?.data?.point ?? 0
  const product = detailData?.data
  const maxStock = product?.stockQuantity ?? 0
  const totalPrice = product ? product.price * quantity : 0
  const canOrder =
    product &&
    quantity > 0 &&
    quantity <= maxStock &&
    totalPrice > 0 &&
    totalPrice <= userPoint

  const handleOpenOrder = () => {
    setQuantity(1)
    setOrderError('')
    setOrderSuccess(false)
    setIsOrderOpen(true)
  }

  const handleCloseDetail = () => {
    setSelectedProductId(null)
    setIsOrderOpen(false)
  }

  const handleSubmitOrder = async () => {
    if (!product || !canOrder || isOrdering) return
    setOrderError('')
    try {
      await mutateAsync({
        productId: product.id,
        price: product.price,
        quantity,
      })
      setIsOrderOpen(false)
      setOrderSuccess(true)
      queryClient.invalidateQueries({ queryKey: ['user-point'] })
      queryClient.invalidateQueries({ queryKey: ['products'] })
      queryClient.invalidateQueries({ queryKey: ['product-detail', product.id] })
    } catch (err) {
      const message = err instanceof Error ? err.message : '주문에 실패했습니다.'
      setOrderError(message)
    }
  }

  const pageLabel = useMemo(() => {
    if (!pageInfo) return '1 / 1'
    return `${page + 1} / ${Math.max(totalPages, 1)}`
  }, [page, pageInfo, totalPages])

  const groupStart = Math.floor(page / 5) * 5
  const groupEnd = Math.min(groupStart + 5, Math.max(totalPages, 1))
  const canPrevGroup = groupStart > 0
  const canNextGroup = groupEnd < Math.max(totalPages, 1)

  return (
    <PageState
      isLoading={isLoading}
      isError={isError}
      error={error as Error | null}
      onRetry={refetch}
    >
      <div className="min-h-screen bg-white text-black">
        <div className="mx-auto flex min-h-screen max-w-3xl flex-col gap-8 px-6 py-10 pb-24">
          <div className="border border-black bg-[#D6FF00] px-6 py-4">
            <div className="flex items-center justify-between">
              <button
                className="rounded-full border border-black bg-white px-3 py-1 text-lg"
                type="button"
                onClick={() => window.history.back()}
              >
                ←
              </button>
              <h1 className="text-2xl font-semibold">상품 목록</h1>
              <span className="w-12" />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">전체 상품</h2>
            <span className="text-sm">{pageLabel}</span>
          </div>

          {products.length === 0 ? (
            <div className="border border-black px-6 py-10 text-center text-sm">
              등록된 상품이 없습니다.
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-4">
              {products.map((product) => {
                const isOutOfStock = product.stockQuantity === 0
                return (
                <button
                  key={product.id}
                  className={`border border-black p-4 text-left text-sm transition ${
                    isOutOfStock ? 'bg-[#F2F2F2] text-black/60 hover:bg-[#ECECEC]' : 'hover:bg-[#D6FF00]'
                  }`}
                  type="button"
                  onClick={() => setSelectedProductId(product.id)}
                >
                  <p className="text-xs">상품명</p>
                  <p className="mt-1 text-base font-semibold">{product.name}</p>
                  <div className="mt-4 flex flex-col gap-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span>가격</span>
                      <span>{product.price}p</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>재고</span>
                      <span>{product.stockQuantity}</span>
                    </div>
                  </div>
                </button>
              )})}
            </div>
          )}

          <div className="flex flex-wrap items-center justify-center gap-2 border-t border-black pt-4 text-sm">
            <button
              className="h-9 w-9 rounded-full border border-black text-sm disabled:opacity-40"
              type="button"
              onClick={() => setPage(Math.max(groupStart - 1, 0))}
              disabled={!canPrevGroup}
              aria-label="이전 5페이지"
            >
              ‹
            </button>
            {Array.from({ length: Math.max(totalPages, 1) }, (_, index) => index)
              .slice(groupStart, groupEnd)
              .map((index) => (
                <button
                  key={index}
                  className={`h-9 w-9 rounded-full border border-black text-sm ${
                    index === page ? 'bg-[#D6FF00]' : 'bg-white'
                  }`}
                  type="button"
                  onClick={() => setPage(index)}
                  disabled={index === page}
                >
                  {index + 1}
                </button>
              ))}
            <button
              className="h-9 w-9 rounded-full border border-black text-sm disabled:opacity-40"
              type="button"
              onClick={() => setPage(groupEnd)}
              disabled={!canNextGroup}
              aria-label="다음 5페이지"
            >
              ›
            </button>
          </div>
        </div>

        {selectedProductId ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 px-6">
            <div className="w-full max-w-md border border-black bg-white p-6 text-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs">상품 상세</p>
                  <h2 className="mt-1 text-xl font-semibold">
                    {detailData?.data?.name ?? '불러오는 중...'}
                  </h2>
                </div>
                <button
                  className="rounded-full border border-black bg-white px-2 py-1 text-xs"
                  type="button"
                  onClick={handleCloseDetail}
                >
                  닫기
                </button>
              </div>

              <div className="mt-6 flex flex-col gap-3 border border-black px-4 py-4">
                {isDetailLoading ? (
                  <p>불러오는 중...</p>
                ) : isDetailError ? (
                  <p>{detailError instanceof Error ? detailError.message : '불러오기 실패'}</p>
                ) : (
                  <>
                    <div className="flex items-center justify-between">
                      <span>가격</span>
                      <span>{detailData?.data?.price ?? '-'}p</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>재고</span>
                      <span>{detailData?.data?.stockQuantity ?? '-'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>등록</span>
                      <span>{formatDateTime(detailData?.data?.createdAt)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>수정</span>
                      <span>{formatDateTime(detailData?.data?.modifiedAt)}</span>
                    </div>
                  </>
                )}
              </div>

              <button
                className="mt-6 w-full rounded-full bg-[#D6FF00] px-4 py-3 text-sm font-medium text-black transition hover:bg-[#C5EB00] disabled:cursor-not-allowed disabled:opacity-70"
                type="button"
                onClick={handleOpenOrder}
                disabled={!product || maxStock === 0}
              >
                {maxStock === 0 ? '재고 없음' : '주문하기'}
              </button>
            </div>
          </div>
        ) : null}

        {isOrderOpen && product ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 px-6">
            <div className="w-full max-w-md border border-black bg-white p-6 text-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs">주문하기</p>
                  <h2 className="mt-1 text-xl font-semibold">{product.name}</h2>
                </div>
                <button
                  className="rounded-full border border-black bg-white px-2 py-1 text-xs"
                  type="button"
                  onClick={() => setIsOrderOpen(false)}
                >
                  닫기
                </button>
              </div>

              <div className="mt-6 flex flex-col gap-3 border border-black px-4 py-4">
                <div className="flex items-center justify-between">
                  <span>가격</span>
                  <span>{product.price}p</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>재고</span>
                  <span>{product.stockQuantity}</span>
                </div>
                <label className="mt-2 flex flex-col gap-2 text-xs">
                  수량
                  <input
                    type="number"
                    min={1}
                    max={maxStock}
                    value={quantity}
                    onChange={(event) => {
                      const value = Number(event.target.value)
                      if (Number.isNaN(value)) {
                        setQuantity(1)
                        return
                      }
                      const clamped = Math.min(Math.max(value, 1), maxStock)
                      setQuantity(clamped)
                    }}
                    className="border border-black px-3 py-2 text-sm"
                  />
                </label>
                <div className="mt-2 flex items-center justify-between text-sm">
                  <span>총 금액</span>
                  <span>{totalPrice}p</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>내 포인트</span>
                  <span>{userPoint}p</span>
                </div>
                {!canOrder ? (
                  <p className="text-xs">
                    수량이나 포인트가 부족합니다.
                  </p>
                ) : null}
              </div>

              {orderError ? <p className="mt-3 text-xs">{orderError}</p> : null}

              <button
                className="mt-6 w-full rounded-full bg-[#D6FF00] px-4 py-3 text-sm font-medium text-black transition hover:bg-[#C5EB00] disabled:cursor-not-allowed disabled:opacity-70"
                type="button"
                onClick={handleSubmitOrder}
                disabled={!canOrder || isOrdering}
              >
                {isOrdering ? '주문 중...' : '주문하기'}
              </button>
            </div>
          </div>
        ) : null}

        {orderSuccess ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 px-6">
            <div className="w-full max-w-sm border border-black bg-white p-6 text-center text-sm">
              <h2 className="text-lg font-semibold">주문 완료</h2>
              <p className="mt-2">주문이 성공적으로 처리되었습니다.</p>
              <button
                className="mt-6 w-full rounded-full bg-[#D6FF00] px-4 py-3 text-sm font-medium text-black transition hover:bg-[#C5EB00]"
                type="button"
                onClick={() => setOrderSuccess(false)}
              >
                확인
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </PageState>
  )
}

export default ProductListPage
