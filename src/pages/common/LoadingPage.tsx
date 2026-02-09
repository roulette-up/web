type LoadingPageProps = {
  title?: string
  description?: string
}

function LoadingPage({
  title = '잠시만 기다려 주세요',
  description = '데이터를 불러오는 중입니다.',
}: LoadingPageProps) {
  return (
    <div className="min-h-screen bg-white text-black">
      <div className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center gap-6 px-6">
        <div className="flex flex-col items-center gap-4 border border-black px-8 py-10 text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-black border-t-[#D6FF00]" />
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold">{title}</h1>
            <p className="text-base">{description}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoadingPage
