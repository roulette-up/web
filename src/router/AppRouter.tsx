import { BrowserRouter, Route, Routes } from 'react-router-dom'
import ErrorBoundary from '../components/common/ErrorBoundary'
import LoginPage from '../pages/auth/LoginPage'
import HomePage from '../pages/home/HomePage'
import NotFoundPage from '../pages/common/NotFoundPage'

function AppRouter() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </ErrorBoundary>
    </BrowserRouter>
  )
}

export default AppRouter
