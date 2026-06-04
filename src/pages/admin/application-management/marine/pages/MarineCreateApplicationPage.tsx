import { CreateApplicationFlowPage } from '@/pages/customer/features/applications/pages/create/CreateApplicationFlowPage'
import {
  ADMIN_MARINE_APPLICATION_FLOW_STORAGE_KEY,
  ApplicationFlowPolicyProvider,
} from '@/pages/customer/features/applications/context/ApplicationFlowPolicyContext'

const MARINE_LISTING_PATH = '/admin/application-management/marine'

export function MarineCreateApplicationPage() {
  return (
    <ApplicationFlowPolicyProvider
      policy="admin"
      listingPath={MARINE_LISTING_PATH}
      storageKey={ADMIN_MARINE_APPLICATION_FLOW_STORAGE_KEY}
      breadcrumbItems={[
        { label: 'Marine applications', href: MARINE_LISTING_PATH },
        { label: 'Create application' },
      ]}
    >
      <CreateApplicationFlowPage />
    </ApplicationFlowPolicyProvider>
  )
}
