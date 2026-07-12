import { useLocation } from 'react-router-dom'
import { CreateApplicationFlowPage } from '@/pages/customer/features/applications/pages/create/CreateApplicationFlowPage'
import {
  ADMIN_MARINE_APPLICATION_FLOW_STORAGE_KEY,
  ApplicationFlowPolicyProvider,
} from '@/pages/customer/features/applications/context/ApplicationFlowPolicyContext'
import { getListingReturnHref } from '@/shared/utils/listingNavigationUtils'

const MARINE_LISTING_PATH = '/admin/application-management/marine'

export function MarineCreateApplicationPage() {
  const location = useLocation()
  const listingHref = getListingReturnHref(location, MARINE_LISTING_PATH)

  return (
    <ApplicationFlowPolicyProvider
      policy="admin"
      listingPath={listingHref}
      storageKey={ADMIN_MARINE_APPLICATION_FLOW_STORAGE_KEY}
      breadcrumbItems={[
        { label: 'Marine applications', href: listingHref },
        { label: 'Create application' },
      ]}
    >
      <CreateApplicationFlowPage />
    </ApplicationFlowPolicyProvider>
  )
}
