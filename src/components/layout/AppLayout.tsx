import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { Outlet, useNavigate } from 'react-router-dom'
import { storage } from '../../utils/storage'

function AppLayout() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [isMoreOpen, setIsMoreOpen] = useState(false)

  const handleLogout = () => {
    storage.clearAuth()
    queryClient.clear()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-white text-black">
      <Outlet />
      <nav className="fixed bottom-0 left-0 right-0 border-t border-black bg-[#D6FF00] text-sm">
        <div className="mx-auto flex w-full max-w-3xl items-center justify-between px-6 py-4">
          <button className="px-2 py-1" type="button">
            상품 목록
          </button>
          <button className="px-2 py-1" type="button">
            주문 내역
          </button>
          <div className="relative">
            <button
              className="px-2 py-1"
              onClick={() => setIsMoreOpen((prev) => !prev)}
              type="button"
            >
              더보기
            </button>
            {isMoreOpen ? (
              <div className="absolute bottom-12 right-0 w-44 border border-black bg-white shadow-sm">
                <button
                  className="w-full border-b border-black px-4 py-3 text-left text-sm"
                  type="button"
                  onClick={() => {
                    setIsMoreOpen(false)
                    navigate('/mypage')
                  }}
                >
                  마이페이지
                </button>
                <button
                  className="w-full bg-[#D6FF00] px-4 py-3 text-left text-sm"
                  type="button"
                  onClick={() => {
                    setIsMoreOpen(false)
                    handleLogout()
                  }}
                >
                  로그아웃
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </nav>
    </div>
  )
}

export default AppLayout
