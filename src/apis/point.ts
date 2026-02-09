import type { ApiResponse } from '../types/api'
import type { PointRecordPage } from '../types/point'
import { request } from './http'

type Pageable = {
  page: number
  size: number
  sort?: string[]
}

export async function getPointRecords(pageable: Pageable) {
  const params = new URLSearchParams()
  params.set('page', String(pageable.page))
  params.set('size', String(pageable.size))
  if (pageable.sort) {
    pageable.sort.forEach((value) => params.append('sort', value))
  }

  const response = await request<PointRecordPage>(`/api/v1/points/records?${params.toString()}`,
    {
      includeUserId: true,
    },
  )

  return response as ApiResponse<PointRecordPage>
}
