import { useEffect, useMemo, useRef } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useNotifications } from '../../hooks/queries/useNotifications'
import { useMarkNotificationAsRead } from '../../hooks/queries/useMarkNotificationAsRead'
import type { NotificationType } from '../../types/notification'

const TYPE_LABEL: Record<NotificationType, string> = {
  D7: '7일 뒤 만료',
  D3: '3일 뒤 만료',
}

const formatDate = (value?: string) => {
  if (!value) return '-'
  return value.split('T')[0]
}

type NotificationDrawerProps = {
  isOpen: boolean
  onClose: () => void
}

function NotificationDrawer({ isOpen, onClose }: NotificationDrawerProps) {
  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useNotifications()
  const { mutateAsync: markAsRead, isPending: isMarking } = useMarkNotificationAsRead()
  const queryClient = useQueryClient()

  const sentinelRef = useRef<HTMLDivElement | null>(null)

  const items = useMemo(() => {
    return data?.pages.flatMap((page) => page.data?.items ?? []) ?? []
  }, [data])

  useEffect(() => {
    if (!isOpen) return
    const target = sentinelRef.current
    if (!target) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
            fetchNextPage()
          }
        })
      },
      { rootMargin: '120px' },
    )

    observer.observe(target)
    return () => observer.disconnect()
  }, [fetchNextPage, hasNextPage, isFetchingNextPage, isOpen])

  return (
    <div
      className={`fixed inset-0 z-50 ${
        isOpen ? 'pointer-events-auto' : 'pointer-events-none'
      }`}
    >
      <button
        className={`absolute inset-0 bg-black/20 transition-opacity ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
        type="button"
        aria-label="알림 닫기"
        onClick={onClose}
      />
      <aside
        className={`absolute right-0 top-0 h-full w-1/2 min-w-[280px] max-w-md border-l border-black bg-white transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-black px-4 py-3">
          <h2 className="text-lg font-semibold">알림함</h2>
          <button
            className="rounded-full border border-black bg-white px-2 py-1 text-xs"
            type="button"
            onClick={onClose}
          >
            닫기
          </button>
        </div>
        <div className="h-[calc(100%-52px)] overflow-y-auto px-4 py-4">
          {isLoading ? (
            <p className="text-sm">불러오는 중...</p>
          ) : isError ? (
            <p className="text-sm">
              {error instanceof Error ? error.message : '불러오기 실패'}
            </p>
          ) : items.length === 0 ? (
            <p className="text-sm">알림이 없습니다.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {items.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={`border p-4 text-left text-sm transition ${
                    item.isRead
                      ? 'border-black bg-[#F2F2F2] text-black/70 hover:bg-[#E6E6E6]'
                      : 'border-black bg-[#D6FF00] hover:bg-[#C5EB00]'
                  }`}
                  onClick={async () => {
                    if (item.isRead || isMarking) return
                    await markAsRead(item.id)
                    queryClient.invalidateQueries({ queryKey: ['notifications'] })
                  }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs">{TYPE_LABEL[item.type]}</p>
                      <p className="mt-1 text-base font-semibold">
                        {item.expiringPoint}p 만료 예정
                      </p>
                    </div>
                    {!item.isRead ? (
                      <span className="mt-1 h-2 w-2 rounded-full bg-red-500" />
                    ) : null}
                  </div>
                  <div className="mt-3 flex items-center justify-between text-xs">
                    <span>만료일</span>
                    <span>{formatDate(item.expiresAt)}</span>
                  </div>
                </button>
              ))}
              <div ref={sentinelRef} />
              {isFetchingNextPage ? (
                <p className="text-xs">더 불러오는 중...</p>
              ) : null}
            </div>
          )}
        </div>
      </aside>
    </div>
  )
}

export default NotificationDrawer
