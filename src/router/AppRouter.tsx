import { BrowserRouter, Route, Routes } from 'react-router-dom'
import AppLayout from '../components/layout/AppLayout'
import RequireAuth from '../components/layout/RequireAuth'
import ErrorBoundary from '../components/common/ErrorBoundary'
import LoginPage from '../pages/auth/LoginPage'
import HomePage from '../pages/home/HomePage'
import MyPage from '../pages/point/MyPage'
import ProductListPage from '../pages/product/ProductListPage'
import OrderListPage from '../pages/order/OrderListPage'
import NotFoundPage from '../pages/common/NotFoundPage'

function AppRouter() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route
            element={
              <RequireAuth>
                <AppLayout />
              </RequireAuth>
            }
          >
            <Route path="/home" element={<HomePage />} />
            <Route path="/mypage" element={<MyPage />} />
            <Route path="/products" element={<ProductListPage />} />
            <Route path="/orders" element={<OrderListPage />} />
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </ErrorBoundary>
    </BrowserRouter>
  )
}

export default AppRouter
