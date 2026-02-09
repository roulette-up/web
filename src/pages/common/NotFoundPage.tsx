import { useNavigate } from 'react-router-dom'
import ErrorPage from './ErrorPage'

function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <ErrorPage
      title="페이지를 찾을 수 없어요"
      message="요청한 페이지가 없습니다."
      onHome={() => navigate('/')}
    />
  )
}

export default NotFoundPage
