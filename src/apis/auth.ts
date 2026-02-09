import type { ApiResponse } from '../types/api'
import type { SignInReq, SignInRes } from '../types/auth'
import { request } from './http'

export async function signIn(payload: SignInReq) {
  const response = await request<SignInRes>('/api/v1/auth/sign-in', {
    method: 'POST',
    body: payload,
  })

  return response as ApiResponse<SignInRes>
}
