import { useLocation } from 'react-router-dom'
import { CreateApplicationFlowPage } from '@/pages/customer/features/applications/pages/create/CreateApplicationFlowPage'
import {
  ADMIN_B2B_APPLICATION_FLOW_STORAGE_KEY,
  ApplicationFlowPolicyProvider,
} from '@/pages/customer/features/applications/context/ApplicationFlowPolicyContext'
import { getListingReturnHref } from '@/shared/utils/listingNavigationUtils'

const B2B_LISTING_PATH = '/admin/application-management/b2b-agents'

export function B2bCreateApplicationPage() {
  const location = useLocation()
  const listingHref = getListingReturnHref(location, B2B_LISTING_PATH)

  return (
    <ApplicationFlowPolicyProvider
      policy="admin"
      listingPath={listingHref}
      storageKey={ADMIN_B2B_APPLICATION_FLOW_STORAGE_KEY}
      customerSegment="b2bAgents"
      breadcrumbItems={[
        { label: 'B2B agents applications', href: listingHref },
        { label: 'Create application' },
      ]}
    >
      <CreateApplicationFlowPage />
    </ApplicationFlowPolicyProvider>
  )
}
