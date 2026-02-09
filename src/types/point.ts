export type PointRecordStatus = 'AVAILABLE' | 'EXPIRED' | 'USED' | 'CANCELED'

export type PointRecord = {
  id: number
  grantedPoint: number
  remainingPoint: number
  status: PointRecordStatus
  rouletteDate: string
  expiresAt: string
}

export type PageMeta = {
  size: number
  number: number
  totalElements: number
  totalPages: number
}

export type PointRecordPage = {
  content: PointRecord[]
  page: PageMeta
}
