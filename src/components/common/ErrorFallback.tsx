import { useNavigate } from 'react-router-dom'
import ErrorPage from '../../pages/common/ErrorPage'

type ErrorFallbackProps = {
  error: Error
  onRetry: () => void
}

function ErrorFallback({ error, onRetry }: ErrorFallbackProps) {
  const navigate = useNavigate()

  return (
    <ErrorPage
      title="문제가 발생했어요"
      message={error.message || '잠시 후 다시 시도해 주세요.'}
      onRetry={onRetry}
      onHome={() => navigate('/')}
    />
  )
}

export default ErrorFallback
