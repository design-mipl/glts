import { loadSession } from '@/shared/auth/session'

export function getCustomerActor(): string {
  const session = loadSession()
  if (!session) return 'Customer User'
  return session.contactName?.trim() || session.email || 'Customer User'
}
