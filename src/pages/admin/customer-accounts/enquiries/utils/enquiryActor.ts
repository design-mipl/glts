import { getCurrentUser } from '@/shared/services/authService'

export function getEnquiryActor(): string {
  const user = getCurrentUser()
  if (!user) return 'Admin User'
  return user.name?.trim() || user.email || 'Admin User'
}
