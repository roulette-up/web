const AUTH_KEY = 'auth'

export type AuthStorage = {
  id: number
  nickname: string
}

export const storage = {
  setAuth(auth: AuthStorage) {
    localStorage.setItem(AUTH_KEY, JSON.stringify(auth))
  },
  getAuth(): AuthStorage | null {
    const raw = localStorage.getItem(AUTH_KEY)
    if (!raw) return null
    try {
      return JSON.parse(raw) as AuthStorage
    } catch {
      return null
    }
  },
  clearAuth() {
    localStorage.removeItem(AUTH_KEY)
  },
}
