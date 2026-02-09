import type { ReactNode } from 'react'
import LoadingPage from '../../pages/common/LoadingPage'
import ErrorPage from '../../pages/common/ErrorPage'

type PageStateProps = {
  isLoading: boolean
  isError: boolean
  error?: Error | null
  onRetry?: () => void
  children: ReactNode
}

function PageState({ isLoading, isError, error, onRetry, children }: PageStateProps) {
  if (isLoading) {
    return <LoadingPage />
  }

  if (isError) {
    return (
      <ErrorPage
        title="문제가 발생했어요"
        message={error?.message || '잠시 후 다시 시도해 주세요.'}
        onRetry={onRetry}
      />
    )
  }

  return <>{children}</>
}

export default PageState
