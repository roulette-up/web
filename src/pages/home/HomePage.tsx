import { useMemo, useRef, useState } from 'react'
import PageState from '../../components/common/PageState'
import RouletteWheel from '../../components/roulette/RouletteWheel'
import { useNotificationDrawer } from '../../components/layout/NotificationContext'
import { useTodayBudget } from '../../hooks/queries/useTodayBudget'
import { useTodayParticipation } from '../../hooks/queries/useTodayParticipation'
import { useParticipateRoulette } from '../../hooks/queries/useParticipateRoulette'
import type { ParticipateRes } from '../../types/roulette'

function HomePage() {
  const {
    data: budgetData,
    isLoading: isBudgetLoading,
    isError: isBudgetError,
    error: budgetError,
    refetch: refetchBudget,
  } = useTodayBudget()
  const {
    data: participationData,
    isLoading: isParticipationLoading,
    isError: isParticipationError,
    error: participationError,
    refetch: refetchParticipation,
  } = useTodayParticipation()
  const { mutateAsync, isPending } = useParticipateRoulette()
  const { open: openNotifications } = useNotificationDrawer()
  const [isSpinning, setIsSpinning] = useState(false)
  const [spinCompleted, setSpinCompleted] = useState(false)
  const [result, setResult] = useState<ParticipateRes | null>(null)
  const [pendingResult, setPendingResult] = useState<ParticipateRes | null>(null)
  const [resultOpen, setResultOpen] = useState(false)
  const [actionError, setActionError] = useState('')
  const isSubmittingRef = useRef(false)

  const totalBudget = budgetData?.data?.totalBudget
  const usedBudget = budgetData?.data?.usedBudget
  const remainingBudget =
    typeof totalBudget === 'number' && typeof usedBudget === 'number'
      ? totalBudget - usedBudget
      : null
  const isClosed = typeof remainingBudget === 'number' && remainingBudget < 100
  const participated = participationData?.data?.participated ?? false

  const isLoading = isBudgetLoading || isParticipationLoading
  const isError = isBudgetError || isParticipationError
  const error = (budgetError || participationError) as Error | null

  const disabledReason = useMemo(() => {
    if (isClosed) return '오늘 룰렛 종료'
    if (participated) return '오늘 이미 참여했어요'
    return null
  }, [isClosed, participated])

  const handleSpin = async () => {
    if (isSubmittingRef.current || isSpinning || isClosed || participated || isPending) return
    isSubmittingRef.current = true
    setActionError('')
    setSpinCompleted(false)
    setResult(null)
    setPendingResult(null)
    setIsSpinning(true)
    try {
      const response = await mutateAsync()
      const payload = response.data
      if (payload) {
        if (spinCompleted) {
          setResult(payload)
          setResultOpen(true)
        } else {
          setPendingResult(payload)
        }
      }
      await Promise.all([refetchBudget(), refetchParticipation()])
    } catch (err) {
      const message = err instanceof Error ? err.message : '요청에 실패했습니다.'
      setActionError(message)
      setIsSpinning(false)
    } finally {
      isSubmittingRef.current = false
    }
  }

  const handleSpinEnd = () => {
    setIsSpinning(false)
    setSpinCompleted(true)
    if (pendingResult) {
      setResult(pendingResult)
      setResultOpen(true)
      setPendingResult(null)
    }
  }

  return (
    <PageState isLoading={isLoading} isError={isError} error={error} onRetry={() => {
      refetchBudget()
      refetchParticipation()
    }}>
      <div className="min-h-screen bg-white text-black">
        <div className="mx-auto flex min-h-screen max-w-3xl flex-col items-center px-6 py-10 pb-24">
          <div className="flex w-full flex-col items-center gap-8">
            <div className="w-full border border-black bg-[#D6FF00] px-6 py-4">
              <div className="flex items-center justify-between">
                <span className="w-10" />
                <h1 className="text-3xl font-semibold">Roulette-Up</h1>
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

            <div className="w-full border border-black px-6 py-10">
              <div className="flex flex-col items-center gap-6">
                <RouletteWheel
                  isSpinning={isSpinning}
                  onSpinEnd={handleSpinEnd}
                />
                <div className="flex w-full flex-col gap-2 border border-black px-6 py-4 text-sm">
                  <span>
                    남은 포인트:{' '}
                    {remainingBudget === null ? '-' : isClosed ? 0 : remainingBudget}원
                  </span>
                  {isClosed ? (
                    <span className="text-sm">금일 룰렛이 종료되었습니다.</span>
                  ) : participated ? (
                    <span className="text-sm">오늘 이미 룰렛에 참여했습니다.</span>
                  ) : null}
                </div>
                <button
                  className="w-full rounded-full bg-[#D6FF00] px-6 py-3 text-sm font-medium text-black transition hover:bg-[#C5EB00] disabled:cursor-not-allowed disabled:opacity-70"
                  onClick={handleSpin}
                  disabled={isSpinning || isClosed || participated || isPending}
                  type="button"
                >
                  {disabledReason
                    ? disabledReason
                    : isPending || isSpinning
                    ? '돌리는 중...'
                    : '룰렛 돌리기'}
                </button>
                {actionError ? <p className="text-sm">{actionError}</p> : null}
              </div>
            </div>
          </div>

        </div>

        {resultOpen && result ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/90 px-6">
            <div className="w-full max-w-sm border border-black bg-white p-6 text-center">
              <h2 className="text-xl font-semibold">당첨 결과</h2>
              <p className="mt-4 text-3xl font-semibold">{result.reward}포인트</p>
              {result.reward !== result.credit ? (
                <>
                  <p className="mt-3 text-sm">
                    포인트 부채 {result.reward - result.credit} 차감
                  </p>
                  <p className="mt-2 text-sm">실제 적립: {result.credit}포인트</p>
                </>
              ) : null}
              <button
                className="mt-6 w-full rounded-full bg-[#D6FF00] px-4 py-2 text-sm font-medium text-black transition hover:bg-[#C5EB00]"
                onClick={() => setResultOpen(false)}
                type="button"
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

export default HomePage
