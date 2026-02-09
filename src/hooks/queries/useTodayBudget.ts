import { useQuery } from '@tanstack/react-query'
import { getTodayBudget } from '../../apis/roulette'

export function useTodayBudget() {
  return useQuery({
    queryKey: ['today-budget'],
    queryFn: getTodayBudget,
  })
}
