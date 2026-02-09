import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageState from '../../components/common/PageState'
import { usePointRecords } from '../../hooks/queries/usePointRecords'
import { useUserPoint } from '../../hooks/queries/useUserPoint'
import { storage } from '../../utils/storage'
import type { PointRecordStatus } from '../../types/point'
import { useNotificationDrawer } from '../../components/layout/NotificationContext'

const PAGE_SIZE = 10

const STATUS_LABEL: Record<PointRecordStatus, string> = {
  AVAILABLE: '사용 가능',
  EXPIRED: '만료',
  USED: '사용 완료',
  CANCELED: '취소됨',
}

function MyPage() {
  const auth = storage.getAuth()
  const nickname = auth?.nickname ?? '-'
  const [page, setPage] = useState(0)
  const { data: pointData } = useUserPoint()
  const userPoint = pointData?.data?.point ?? 0
  const navigate = useNavigate()
  const { open: openNotifications } = useNotificationDrawer()
  const { data, isLoading, isError, error, refetch } = usePointRecords({
    page,
    size: PAGE_SIZE,
  })

  const pageInfo = data?.data?.page
  const records = data?.data?.content ?? []
  const totalPages = pageInfo?.totalPages ?? 0

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
                onClick={() => navigate('/home')}
              >
                ←
              </button>
              <h1 className="text-2xl font-semibold">마이페이지</h1>
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

          <div className="border border-black px-6 py-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm">닉네임</p>
                <p className="mt-1 text-2xl font-semibold">{nickname}</p>
              </div>
              <div className="text-right">
                <p className="text-sm">잔여 포인트</p>
                <p className="mt-1 text-2xl font-semibold">{userPoint}p</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">포인트 기록</h2>
              <span className="text-sm">{pageLabel}</span>
            </div>
            <div className="flex flex-col gap-3">
              {records.length === 0 ? (
                <div className="border border-black px-6 py-6 text-center text-sm">
                  아직 포인트 기록이 없습니다.
                </div>
              ) : (
                records.map((record) => (
                  <div key={record.id} className="border border-black px-6 py-5 text-sm">
                    <div className="flex items-start justify-between gap-4 text-xs">
                      <div>
                        <p>룰렛 날짜</p>
                        <p className="mt-1 text-sm font-medium">{record.rouletteDate}</p>
                      </div>
                      <div className="text-right">
                        <p>만료기한</p>
                        <p className="mt-1 text-sm font-medium">{record.expiresAt}</p>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center justify-between gap-4">
                      <div>
                        <p className="text-xs">획득/잔여</p>
                        <p className="mt-1 text-base font-semibold">
                          {record.grantedPoint}/{record.remainingPoint}p
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs">상태</p>
                        <p className="mt-1 text-base font-semibold">
                          {STATUS_LABEL[record.status] ?? record.status}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
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
        </div>

      </div>
    </PageState>
  )
}

export default MyPage
