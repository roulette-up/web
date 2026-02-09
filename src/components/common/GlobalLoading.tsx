import { useIsFetching } from '@tanstack/react-query'

function GlobalLoading() {
  const isFetching = useIsFetching()

  if (!isFetching) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/90 text-black">
      <div className="flex flex-col items-center gap-4 border border-black px-8 py-6">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-black border-t-[#D6FF00]" />
        <p className="text-sm">로딩 중...</p>
      </div>
    </div>
  )
}

export default GlobalLoading
