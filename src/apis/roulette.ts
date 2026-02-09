import type { ApiResponse } from '../types/api'
import type { ParticipateRes, TodayBudgetRes, TodayParticipationRes } from '../types/roulette'
import { request } from './http'

export async function getTodayBudget() {
  const response = await request<TodayBudgetRes>('/api/v1/roulettes/today')
  return response as ApiResponse<TodayBudgetRes>
}

export async function getTodayParticipation() {
  const response = await request<TodayParticipationRes>('/api/v1/roulettes/today/participation', {
    includeUserId: true,
  })
  return response as ApiResponse<TodayParticipationRes>
}

export async function participateRoulette() {
  const response = await request<ParticipateRes>('/api/v1/roulettes/today/participation', {
    method: 'POST',
    includeUserId: true,
  })
  return response as ApiResponse<ParticipateRes>
}
