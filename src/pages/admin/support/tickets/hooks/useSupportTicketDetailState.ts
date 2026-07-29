import { useEffect, useState } from 'react'
import { supportTicketService } from '@/shared/services/supportTicketService'
import type { SupportTicket } from '@/shared/types/supportTicket'

export function useSupportTicketDetailState(ticketId: string | undefined) {
  const [loading, setLoading] = useState(true)
  const [ticket, setTicket] = useState<SupportTicket | undefined>()

  const reload = () => {
    if (!ticketId) {
      setTicket(undefined)
      setLoading(false)
      return
    }
    setLoading(true)
    setTicket(supportTicketService.getById(ticketId))
    setLoading(false)
  }

  useEffect(() => {
    reload()
  }, [ticketId])

  return { loading, ticket, reload }
}
