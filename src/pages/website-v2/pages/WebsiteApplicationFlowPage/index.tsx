import { useSearchParams } from 'react-router-dom'
import { CreateApplicationFlowPage } from '@/pages/customer/features/applications/pages/create/CreateApplicationFlowPage'
import {
  ApplicationFlowPolicyProvider,
  WEBSITE_APPLICATION_FLOW_STORAGE_KEY,
} from '@/pages/customer/features/applications/context/ApplicationFlowPolicyContext'
import { WebsiteApplicationFlowLayout } from '../../components/WebsiteApplicationFlowLayout'

const WEBSITE_APPLY_LISTING_PATH = '/countries'

export function WebsiteApplicationFlowPage() {
  const [searchParams] = useSearchParams()
  const preselectedCountryId = searchParams.get('country')?.trim() ?? ''

  return (
    <WebsiteApplicationFlowLayout>
      <ApplicationFlowPolicyProvider
        policy="website"
        listingPath={WEBSITE_APPLY_LISTING_PATH}
        storageKey={WEBSITE_APPLICATION_FLOW_STORAGE_KEY}
        breadcrumbItems={[
          { label: 'Home', href: '/' },
          { label: 'Destinations', href: '/countries' },
          { label: 'Apply' },
        ]}
      >
        <CreateApplicationFlowPage
          preselectedCountryId={preselectedCountryId || undefined}
          initialStep={preselectedCountryId ? 'visa' : 'country'}
        />
      </ApplicationFlowPolicyProvider>
    </WebsiteApplicationFlowLayout>
  )
}
