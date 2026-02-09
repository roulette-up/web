export type ApiResponse<T> = {
  code: number | string
  message: string
  data?: T
  errors?: Record<string, string>
}
