import { useQuery } from '@tanstack/react-query'
import { getTodayParticipation } from '../../apis/roulette'
import { storage } from '../../utils/storage'

export function useTodayParticipation() {
  const auth = storage.getAuth()
  const userId = auth?.id ?? null

  return useQuery({
    queryKey: ['today-participation', userId],
    queryFn: getTodayParticipation,
    enabled: Boolean(userId),
  })
}
