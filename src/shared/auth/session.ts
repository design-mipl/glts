export type PortalKind = 'business' | 'operations'

export type CustomerType = 'marine' | 'corporate' | 'b2b_agent'

export type PortalUserRole = 'corporate_admin' | 'booker'

const SESSION_KEY = 'glts:auth'

export interface AuthSession {
  portal: PortalKind
  email: string
  customerType?: CustomerType
  companyName?: string
  contactName?: string
  userRole?: PortalUserRole
}

/** Prototype: corporate admin vs booker from email pattern */
export function inferUserRole(email: string): PortalUserRole {
  const e = email.toLowerCase()
  if (
    e.startsWith('admin@') ||
    e.startsWith('owner@') ||
    e.includes('.admin@') ||
    e.includes('corporate.admin')
  ) {
    return 'corporate_admin'
  }
  return 'booker'
}

/** Business portal workspace label — always GLTS (not derived from email domain). */
export const BUSINESS_WORKSPACE_ID = 'GLTS'

export function contactNameFromEmail(email: string): string {
  const local = email.split('@')[0] ?? 'User'
  return local
    .replace(/[._-]/g, ' ')
    .split(' ')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

/** Prototype: infer customer segment from email — no user selection at login */
export function inferCustomerType(email: string): CustomerType {
  const e = email.toLowerCase()
  if (e.includes('marine') || e.includes('crew') || e.includes('vessel') || e.includes('ship')) {
    return 'marine'
  }
  if (e.includes('agent') || e.includes('b2b') || e.includes('traveldesk')) {
    return 'b2b_agent'
  }
  return 'corporate'
}

export function saveSession(session: AuthSession): void {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session))
}

export function loadSession(): AuthSession | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    if (!raw) return null
    const session = JSON.parse(raw) as AuthSession
    if (session.portal === 'business') {
      let changed = false
      if (session.companyName?.toLowerCase() === 'interics') {
        session.companyName = BUSINESS_WORKSPACE_ID
        changed = true
      }
      if (session.email?.toLowerCase().includes('@interics.')) {
        session.email = session.email.replace(/@interics\./i, '@glts.')
        changed = true
      }
      if (changed) saveSession(session)
    }
    return session
  } catch {
    return null
  }
}

export function clearSession(): void {
  localStorage.removeItem(SESSION_KEY)
}
