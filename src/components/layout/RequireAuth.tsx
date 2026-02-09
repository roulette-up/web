import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { storage } from '../../utils/storage'

type RequireAuthProps = {
  children: ReactNode
}

function RequireAuth({ children }: RequireAuthProps) {
  const auth = storage.getAuth()

  if (!auth) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}

export default RequireAuth
