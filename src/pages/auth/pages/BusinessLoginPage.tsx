import { BusinessSegmentLoginPage } from '../components/BusinessSegmentLoginPage'

/**
 * @deprecated Prefer segment logins (`/sign-in/business/marine|corporate|b2b`).
 * Kept for deep links; defaults to marine demo credentials.
 */
export function BusinessLoginPage() {
  return (
    <BusinessSegmentLoginPage
      customerType="marine"
      copy={{
        portalTitle: 'Business Portal',
        portalSubtitle: 'Log in to manage applications and travelers.',
        headline: 'Visa workflows built for global teams.',
        subline: 'Corporate travel, marine crew, and B2B agents — one secure portal for applications, tracking, and compliance.',
        defaultEmail: 'admin@glts.com',
        forgotHref: '/sign-in/business/forgot-password',
      }}
    />
  )
}
