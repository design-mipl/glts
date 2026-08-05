import { useLocation } from 'react-router-dom'
import { CreateApplicationFlowPage } from '@/pages/customer/features/applications/pages/create/CreateApplicationFlowPage'
import {
  ADMIN_CORPORATE_APPLICATION_FLOW_STORAGE_KEY,
  ApplicationFlowPolicyProvider,
} from '@/pages/customer/features/applications/context/ApplicationFlowPolicyContext'
import { getListingReturnHref } from '@/shared/utils/listingNavigationUtils'

const CORPORATE_LISTING_PATH = '/admin/application-management/corporate'

export function CorporateCreateApplicationPage() {
  const location = useLocation()
  const listingHref = getListingReturnHref(location, CORPORATE_LISTING_PATH)

  return (
    <ApplicationFlowPolicyProvider
      policy="admin"
      listingPath={listingHref}
      storageKey={ADMIN_CORPORATE_APPLICATION_FLOW_STORAGE_KEY}
      customerSegment="corporate"
      breadcrumbItems={[
        { label: 'Corporate applications', href: listingHref },
        { label: 'Create application' },
      ]}
    >
      <CreateApplicationFlowPage />
    </ApplicationFlowPolicyProvider>
  )
}
