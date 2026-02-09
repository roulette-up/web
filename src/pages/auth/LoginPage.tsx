import { useMemo, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { signIn } from '../../apis/auth'
import { storage } from '../../utils/storage'
import type { ApiResponse } from '../../types/api'
import type { SignInRes } from '../../types/auth'

const MIN_NICKNAME = 2
const MAX_NICKNAME = 30

function LoginPage() {
  const navigate = useNavigate()
  const [nickname, setNickname] = useState('')
  const [localError, setLocalError] = useState('')

  const trimmedNickname = useMemo(() => nickname.trim(), [nickname])

  const { mutateAsync, isPending, error } = useMutation({
    mutationFn: signIn,
  })

  const apiError = error as (Error & { payload?: ApiResponse<SignInRes> }) | null
  const nicknameError = apiError?.payload?.errors?.nickname
  const message = nicknameError || apiError?.message || localError

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (trimmedNickname.length < MIN_NICKNAME || trimmedNickname.length > MAX_NICKNAME) {
      setLocalError('닉네임은 2~30자여야 합니다.')
      return
    }

    setLocalError('')

    const response = await mutateAsync({ nickname: trimmedNickname })
    const userId = response.data?.id

    if (userId) {
      storage.setAuth({ id: userId, nickname: trimmedNickname })
      navigate('/home')
    }
  }

  return (
    <div className="min-h-screen bg-white text-black">
      <div className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center gap-8 px-6">
        <div className="w-full max-w-md border border-black p-8">
          <h1 className="text-center text-3xl font-semibold">Roulette-Up</h1>

          <form className="mt-8 flex flex-col gap-4" onSubmit={handleSubmit}>
            <label className="flex flex-col gap-2 text-sm font-medium" htmlFor="nickname">
              닉네임
              <input
                id="nickname"
                type="text"
                value={nickname}
                onChange={(event) => setNickname(event.target.value)}
                minLength={MIN_NICKNAME}
                maxLength={MAX_NICKNAME}
                placeholder="2~30자 입력"
                className="w-full border border-black px-4 py-3 text-base focus:outline-none"
              />
            </label>

            {message ? <p className="text-sm">{message}</p> : null}

            <button
              type="submit"
              disabled={isPending}
              className="rounded-full bg-[#D6FF00] px-4 py-3 text-sm font-medium text-black transition hover:bg-[#C5EB00] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isPending ? '로그인 중...' : '로그인'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
