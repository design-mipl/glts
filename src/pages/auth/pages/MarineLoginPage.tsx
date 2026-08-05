import { BusinessSegmentLoginPage } from '../components/BusinessSegmentLoginPage'

export function MarineLoginPage() {
  return (
    <BusinessSegmentLoginPage
      customerType="marine"
      copy={{
        portalTitle: 'Marine Portal',
        portalSubtitle: 'Crew manifests, vessel assignments, and marine visas.',
        headline: 'Crew visa workflows for marine operators.',
        subline: 'Upload manifests, manage vessels, and track crew applications in one place.',
        defaultEmail: 'admin@glts.com',
        forgotHref: '/sign-in/business/marine/forgot-password',
      }}
    />
  )
}
