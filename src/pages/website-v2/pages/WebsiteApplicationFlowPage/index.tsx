import {
  ApplicationFlowPolicyProvider,
  WEBSITE_APPLICATION_FLOW_STORAGE_KEY,
} from '@/pages/customer/features/applications/context/ApplicationFlowPolicyContext'
import { WebsiteApplicationFlowLayout } from '@/pages/website/components/WebsiteApplicationFlowLayout'
import { RetailApplyFlowPage } from '@/pages/website/pages/RetailApplyFlowPage'

const WEBSITE_APPLY_LISTING_PATH = '/countries'

/**
 * `/apply/new` renders main's retail apply flow.
 * Marketing UI stays on website-v2; the apply wizard comes from `src/pages/website`.
 */
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
