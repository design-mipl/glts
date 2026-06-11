export type PortalKind = 'business' | 'operations'

export type CustomerType = 'marine' | 'corporate' | 'b2b_agent'

export type CustomerPortalRole = 'super_admin' | 'admin' | 'booker'

/** @deprecated Use CustomerPortalRole */
export type PortalUserRole = CustomerPortalRole

const SESSION_KEY = 'glts:auth'

const ADMIN_DEMO_EMAILS = new Set([
  'sneha.patel@glts.com',
  'arun.krishnan@glts.com',
])

export interface AuthSession {
  portal: PortalKind
  email: string
  customerType?: CustomerType
  companyName?: string
  contactName?: string
  userRole?: CustomerPortalRole
}

function migrateLegacyRole(role: string | undefined): CustomerPortalRole | undefined {
  if (!role) return undefined
  if (role === 'corporate_admin') return 'super_admin'
  if (role === 'super_admin' || role === 'admin' || role === 'booker') return role
  return undefined
}

/** Prototype: infer customer portal role from email pattern */
export function inferUserRole(email: string): CustomerPortalRole {
  const e = email.toLowerCase()
  if (
    e.startsWith('admin@') ||
    e.startsWith('owner@') ||
    e.includes('corporate.admin')
  ) {
    return 'super_admin'
  }
  if (ADMIN_DEMO_EMAILS.has(e) || e.includes('.portaladmin@')) {
    return 'admin'
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
  if (
    e === 'admin@glts.com' ||
    e.includes('marine') ||
    e.includes('crew') ||
    e.includes('vessel') ||
    e.includes('ship')
  ) {
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
    const session = JSON.parse(raw) as AuthSession & { userRole?: string }
    let changed = false

    const migratedRole = migrateLegacyRole(session.userRole)
    if (migratedRole && migratedRole !== session.userRole) {
      session.userRole = migratedRole
      changed = true
    }

    if (session.portal === 'business') {
      if (session.companyName?.toLowerCase() === 'interics') {
        session.companyName = BUSINESS_WORKSPACE_ID
        changed = true
      }
      if (session.email?.toLowerCase().includes('@interics.')) {
        session.email = session.email.replace(/@interics\./i, '@glts.')
        changed = true
      }
      const inferredCustomerType = inferCustomerType(session.email)
      if (session.customerType !== inferredCustomerType) {
        session.customerType = inferredCustomerType
        changed = true
      }
    }

    if (changed) saveSession(session)
    return session
  } catch {
    return null
  }
}

export function clearSession(): void {
  localStorage.removeItem(SESSION_KEY)
}
