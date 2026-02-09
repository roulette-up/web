import { useMemo, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import PageState from '../../components/common/PageState'
import { useOrders } from '../../hooks/queries/useOrders'
import { useOrderDetail } from '../../hooks/queries/useOrderDetail'
import { useCancelOrder } from '../../hooks/queries/useCancelOrder'
import type { OrderStatus } from '../../types/order'
import { useNotificationDrawer } from '../../components/layout/NotificationContext'

const PAGE_SIZE = 12

const STATUS_LABEL: Record<OrderStatus, string> = {
  COMPLETED: '주문 완료',
  USER_CANCELLED: '주문 취소 (사용자)',
  ADMIN_CANCELLED: '주문 취소 (관리자)',
}

const formatDateTime = (value?: string) => {
  if (!value) return '-'
  const normalized = value.replace('T', ' ')
  const [datePart, timePart = ''] = normalized.split(' ')
  const time = timePart.split('.')[0]?.slice(0, 5) ?? ''
  if (!datePart || !time) return value
  return `${datePart} ${time}`
}

function OrderListPage() {
  const navigate = useNavigate()
  const [page, setPage] = useState(0)
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null)
  const { data, isLoading, isError, error, refetch } = useOrders({
    page,
    size: PAGE_SIZE,
  })
  const {
    data: detailData,
    isLoading: isDetailLoading,
    isError: isDetailError,
    error: detailError,
  } = useOrderDetail({ orderId: selectedOrderId })
  const { mutateAsync: cancelOrder, isPending: isCancelling } = useCancelOrder()
  const [cancelError, setCancelError] = useState('')
  const [cancelSuccess, setCancelSuccess] = useState(false)
  const queryClient = useQueryClient()
  const { open: openNotifications } = useNotificationDrawer()

  const pageInfo = data?.data?.page
  const orders = data?.data?.content ?? []
  const totalPages = pageInfo?.totalPages ?? 0

  const pageLabel = useMemo(() => {
    if (!pageInfo) return '1 / 1'
    return `${page + 1} / ${Math.max(totalPages, 1)}`
  }, [page, pageInfo, totalPages])

  const groupStart = Math.floor(page / 5) * 5
  const groupEnd = Math.min(groupStart + 5, Math.max(totalPages, 1))
  const canPrevGroup = groupStart > 0
  const canNextGroup = groupEnd < Math.max(totalPages, 1)

  const handleCancel = async () => {
    if (!selectedOrderId || isCancelling) return
    const confirmed = window.confirm('주문을 취소할까요?')
    if (!confirmed) return
    setCancelError('')
    setCancelSuccess(false)
    try {
      await cancelOrder(selectedOrderId)
      await refetch()
      queryClient.invalidateQueries({ queryKey: ['user-point'] })
      queryClient.invalidateQueries({ queryKey: ['products'] })
      queryClient.invalidateQueries({ queryKey: ['product-detail'] })
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      queryClient.invalidateQueries({ queryKey: ['order-detail'] })
      setSelectedOrderId(null)
      setCancelSuccess(true)
    } catch (err) {
      const message = err instanceof Error ? err.message : '주문 취소에 실패했습니다.'
      setCancelError(message)
    }
  }

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
                onClick={() => navigate(-1)}
              >
                ←
              </button>
              <h1 className="text-2xl font-semibold">주문 내역</h1>
              <button
                className="rounded-full border border-black bg-white px-3 py-2 text-xs"
                type="button"
                onClick={openNotifications}
                aria-label="알림 열기"
              >
                알림
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">전체 주문</h2>
            <span className="text-sm">{pageLabel}</span>
          </div>

          {orders.length === 0 ? (
            <div className="border border-black px-6 py-10 text-center text-sm">
              주문 내역이 없습니다.
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-4">
              {orders.map((order) => {
                const statusStyle =
                  order.status === 'USER_CANCELLED'
                    ? 'border-[#777777] bg-[#F2F2F2] hover:bg-[#E6E6E6]'
                    : order.status === 'ADMIN_CANCELLED'
                      ? 'border-[#E07B7B] bg-[#FDECEC] hover:bg-[#F9DCDC]'
                      : 'border-black bg-white hover:bg-[#D6FF00]'
                return (
                <button
                  key={order.id}
                  className={`border p-4 text-left text-sm transition ${statusStyle}`}
                  type="button"
                  onClick={() => setSelectedOrderId(order.id)}
                >
                  <p className="text-xs">상품명</p>
                  <p className="mt-1 text-base font-semibold">{order.productName}</p>
                  <div className="mt-4 flex flex-col gap-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span>가격</span>
                      <span>{order.productPrice}p</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>수량</span>
                      <span>{order.quantity}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>상태</span>
                      <span>{STATUS_LABEL[order.status] ?? order.status}</span>
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

        {selectedOrderId ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 px-6">
            <div className="w-full max-w-md border border-black bg-white p-6 text-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs">주문 상세</p>
                  <h2 className="mt-1 text-xl font-semibold">
                    {detailData?.data?.productName ?? '불러오는 중...'}
                  </h2>
                </div>
                <button
                  className="rounded-full border border-black bg-white px-2 py-1 text-xs"
                  type="button"
                  onClick={() => setSelectedOrderId(null)}
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
                      <span>{detailData?.data?.productPrice ?? '-'}p</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>수량</span>
                      <span>{detailData?.data?.quantity ?? '-'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>상태</span>
                      <span>
                        {detailData?.data?.status
                          ? STATUS_LABEL[detailData.data.status]
                          : '-'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>주문 번호</span>
                      <span>{detailData?.data?.id ?? '-'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>주문 날짜</span>
                      <span>{formatDateTime(detailData?.data?.createdAt)}</span>
                    </div>
                  </>
                )}
              </div>

              <button
                className="mt-6 w-full rounded-full bg-[#D6FF00] px-4 py-3 text-sm font-medium text-black transition hover:bg-[#C5EB00]"
                type="button"
                onClick={handleCancel}
                disabled={isCancelling}
              >
                {isCancelling ? '취소 중...' : '주문 취소'}
              </button>
              {cancelError ? <p className="mt-3 text-xs">{cancelError}</p> : null}
            </div>
          </div>
        ) : null}

        {cancelSuccess ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 px-6">
            <div className="w-full max-w-sm border border-black bg-white p-6 text-center text-sm">
              <h2 className="text-lg font-semibold">주문 취소 완료</h2>
              <p className="mt-2">주문이 취소되었습니다.</p>
              <button
                className="mt-6 w-full rounded-full bg-[#D6FF00] px-4 py-3 text-sm font-medium text-black transition hover:bg-[#C5EB00]"
                type="button"
                onClick={() => setCancelSuccess(false)}
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

export default OrderListPage
