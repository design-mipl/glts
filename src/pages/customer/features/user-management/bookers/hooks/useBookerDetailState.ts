import { useCallback, useEffect, useState } from 'react'
import { bookerManagementService } from '@/shared/services/bookerManagementService'
import type { BookerUser } from '@/shared/types/bookerUser'

export function useBookerDetailState(bookerId?: string) {
  const [booker, setBooker] = useState<BookerUser | undefined>(() =>
    bookerId ? bookerManagementService.getById(bookerId) : undefined,
  )

  const reload = useCallback(() => {
    if (!bookerId) {
      setBooker(undefined)
      return
    }
    setBooker(bookerManagementService.getById(bookerId))
  }, [bookerId])

  useEffect(() => {
    reload()
  }, [reload])

  return { booker, reload }
}
