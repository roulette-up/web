import { useMutation } from '@tanstack/react-query'
import { participateRoulette } from '../../apis/roulette'

export function useParticipateRoulette() {
  return useMutation({
    mutationFn: participateRoulette,
  })
}
