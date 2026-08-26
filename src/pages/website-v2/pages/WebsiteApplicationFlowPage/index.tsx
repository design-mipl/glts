import {
  ApplicationFlowPolicyProvider,
  WEBSITE_APPLICATION_FLOW_STORAGE_KEY,
} from '@/pages/customer/features/applications/context/ApplicationFlowPolicyContext'
import { WebsiteApplicationFlowLayout } from '../../components/WebsiteApplicationFlowLayout'
import { RetailApplyFlowPage } from '../RetailApplyFlowPage'

const WEBSITE_APPLY_LISTING_PATH = '/countries'

export function WebsiteApplicationFlowPage() {
  return (
    <WebsiteApplicationFlowLayout>
      <ApplicationFlowPolicyProvider
        policy="website"
        listingPath={WEBSITE_APPLY_LISTING_PATH}
        storageKey={WEBSITE_APPLICATION_FLOW_STORAGE_KEY}
        breadcrumbItems={[]}
      >
        <RetailApplyFlowPage />
      </ApplicationFlowPolicyProvider>
    </WebsiteApplicationFlowLayout>
  )
}
