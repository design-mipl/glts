import type { AuthSession } from '@/shared/auth/session'
import { corporateAccountService } from '@/shared/services/corporateAccountService'
import { commercialAgreementService } from '@/shared/services/commercialAgreementService'
import type { CommercialAgreement } from '@/shared/types/commercialAgreement'

/** Default agreement for portal demos when session email does not match a corporate account. */
export const CUSTOMER_PORTAL_AGREEMENT_ID = 'AGR-009'

function normalizeEmail(email: string | undefined): string {
  return email?.trim().toLowerCase() ?? ''
}

function accountMatchesEmail(
  account: ReturnType<typeof corporateAccountService.list>[number],
  email: string,
): boolean {
  if (account.superAdmin?.emailAddress && normalizeEmail(account.superAdmin.emailAddress) === email) {
    return true
  }
  return account.admins.some(a => normalizeEmail(a.emailAddress) === email)
}

export function resolvePortalAgreementId(session: AuthSession | null): string {
  const email = normalizeEmail(session?.email)
  if (email) {
    const account = corporateAccountService.list().find(a => accountMatchesEmail(a, email))
    if (account?.agreementId) return account.agreementId
  }
  return CUSTOMER_PORTAL_AGREEMENT_ID
}

/** Returns the active commercial agreement for the signed-in customer portal session. */
export function resolveCustomerPortalAgreement(session: AuthSession | null): CommercialAgreement | undefined {
  const agreementId = resolvePortalAgreementId(session)
  const agreement = commercialAgreementService.getById(agreementId)
  if (!agreement || agreement.status !== 'active') return undefined
  return agreement
}
