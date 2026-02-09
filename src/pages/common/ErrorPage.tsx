type ErrorPageProps = {
  title?: string
  message?: string
  onRetry?: () => void
  retryLabel?: string
  onHome?: () => void
  homeLabel?: string
}

function ErrorPage({
  title = '문제가 발생했어요',
  message = '잠시 후 다시 시도해 주세요.',
  onRetry,
  retryLabel = '다시 시도',
  onHome,
  homeLabel = '홈으로',
}: ErrorPageProps) {
  return (
    <div className="min-h-screen bg-white text-black">
      <div className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center gap-6 px-6">
        <div className="flex w-full max-w-xl flex-col items-center gap-6 border border-black px-8 py-10 text-center">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-full border-2 border-black text-xl font-semibold">
            !
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold">{title}</h1>
            <p className="text-base">{message}</p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              className="rounded-full bg-[#D6FF00] px-4 py-2 text-sm font-medium text-black transition hover:bg-[#C5EB00]"
              onClick={onRetry}
              type="button"
            >
              {retryLabel}
            </button>
            {onHome ? (
              <button
                className="rounded-full border border-black bg-white px-4 py-2 text-sm font-medium text-black"
                onClick={onHome}
                type="button"
              >
                {homeLabel}
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ErrorPage
