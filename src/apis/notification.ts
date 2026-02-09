import type { ApiResponse } from '../types/api'
import type { NotificationPage } from '../types/notification'
import { request } from './http'

type NotificationQuery = {
  cursorId?: number | null
  limit?: number
}

export async function getNotifications({ cursorId, limit = 20 }: NotificationQuery) {
  const params = new URLSearchParams()
  if (cursorId !== null && cursorId !== undefined) {
    params.set('cursorId', String(cursorId))
  }
  params.set('limit', String(limit))

  const response = await request<NotificationPage>(
    `/api/v1/notifications?${params.toString()}`,
    { includeUserId: true },
  )

  return response as ApiResponse<NotificationPage>
}

export async function markNotificationAsRead(notificationId: number) {
  const response = await request<void>(
    `/api/v1/notifications/${notificationId}/read-confirm`,
    { method: 'PATCH', includeUserId: true },
  )

  return response as ApiResponse<void>
}
