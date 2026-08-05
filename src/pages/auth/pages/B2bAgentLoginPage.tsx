import { BusinessSegmentLoginPage } from '../components/BusinessSegmentLoginPage'

export function B2bAgentLoginPage() {
  return (
    <BusinessSegmentLoginPage
      customerType="b2b_agent"
      copy={{
        portalTitle: 'B2B Agent Portal',
        portalSubtitle: 'Multi-client applications, bookers, and tracking.',
        headline: 'Agent workflows for multi-client visa programs.',
        subline: 'File for clients, manage bookers, and track bulk applications from one portal.',
        defaultEmail: 'agent@glts.com',
        forgotHref: '/sign-in/business/b2b/forgot-password',
      }}
    />
  )
}
