import { useLocation } from 'react-router-dom'
import { CreateApplicationFlowPage } from '@/pages/customer/features/applications/pages/create/CreateApplicationFlowPage'
import {
  ADMIN_RETAIL_APPLICATION_FLOW_STORAGE_KEY,
  ApplicationFlowPolicyProvider,
} from '@/pages/customer/features/applications/context/ApplicationFlowPolicyContext'
import { getListingReturnHref } from '@/shared/utils/listingNavigationUtils'

const RETAIL_LISTING_PATH = '/admin/application-management/retail'

export function RetailCreateApplicationPage() {
  const location = useLocation()
  const listingHref = getListingReturnHref(location, RETAIL_LISTING_PATH)

  return (
    <ApplicationFlowPolicyProvider
      policy="admin"
      listingPath={listingHref}
      storageKey={ADMIN_RETAIL_APPLICATION_FLOW_STORAGE_KEY}
      customerSegment="retail"
      breadcrumbItems={[
        { label: 'Retail applications', href: listingHref },
        { label: 'Create application' },
      ]}
    >
      <CreateApplicationFlowPage />
    </ApplicationFlowPolicyProvider>
  )
}
