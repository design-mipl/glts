import { BusinessSegmentLoginPage } from '../components/BusinessSegmentLoginPage'

export function CorporateLoginPage() {
  return (
    <BusinessSegmentLoginPage
      customerType="corporate"
      copy={{
        portalTitle: 'Corporate Portal',
        portalSubtitle: 'Enterprise travel visas, travelers, and compliance.',
        headline: 'Corporate travel visas, built for policy teams.',
        subline: 'Create applications, manage bookers, and keep enterprise travel compliant.',
        defaultEmail: 'corporate@glts.com',
        forgotHref: '/sign-in/business/corporate/forgot-password',
      }}
    />
  )
}
