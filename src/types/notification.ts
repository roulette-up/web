export type NotificationType = 'D7' | 'D3'

export type NotificationItem = {
  id: number
  type: NotificationType
  expiringPoint: number
  expiresAt: string
  createdAt: string
  isRead: boolean
}

export type NotificationPage = {
  items: NotificationItem[]
  hasNext: boolean
  nextCursor: number | null
}
