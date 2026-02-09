import { createContext, useContext } from 'react'

type NotificationContextValue = {
  open: () => void
}

const NotificationContext = createContext<NotificationContextValue | null>(null)

export function useNotificationDrawer() {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('NotificationContext not found')
  }
  return context
}

export default NotificationContext
