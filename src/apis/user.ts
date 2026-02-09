import type { ApiResponse } from '../types/api'
import type { UserPointRes } from '../types/user'
import { request } from './http'

export async function getUserPoint() {
  const response = await request<UserPointRes>('/api/v1/users/points', {
    includeUserId: true,
  })

  return response as ApiResponse<UserPointRes>
}
