import { useMutation } from '@tanstack/react-query'
import { markNotificationAsRead } from '../../apis/notification'

export function useMarkNotificationAsRead() {
  return useMutation({
    mutationFn: markNotificationAsRead,
  })
}
