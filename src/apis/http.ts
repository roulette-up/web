import type { ApiResponse } from '../types/api'
import { storage } from '../utils/storage'

type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE'

type RequestOptions = {
  method?: HttpMethod
  body?: unknown
  headers?: Record<string, string>
  includeUserId?: boolean
}

const BASE_URL = import.meta.env.VITE_API_BASE_URL

if (!BASE_URL) {
  throw new Error('VITE_API_BASE_URL is not set.')
}

export async function request<T>(path: string, options: RequestOptions = {}) {
  const { method = 'GET', body, headers, includeUserId = false } = options
  const finalHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...headers,
  }

  if (includeUserId) {
    const auth = storage.getAuth()
    if (auth?.id) {
      finalHeaders['X-User-Id'] = String(auth.id)
    }
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: finalHeaders,
    body: body ? JSON.stringify(body) : undefined,
  })

  const payload = (await response.json()) as ApiResponse<T>

  if (!response.ok) {
    const message = payload.message || '요청에 실패했습니다.'
    const error = new Error(message)
    ;(error as Error & { payload?: ApiResponse<T> }).payload = payload
    throw error
  }

  return payload
}
