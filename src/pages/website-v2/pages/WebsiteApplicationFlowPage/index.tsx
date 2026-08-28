import {
  ApplicationFlowPolicyProvider,
  WEBSITE_APPLICATION_FLOW_STORAGE_KEY,
} from '@/pages/customer/features/applications/context/ApplicationFlowPolicyContext'
import { WebsiteApplicationFlowLayout } from '../../components/WebsiteApplicationFlowLayout'
import { RetailApplyFlowPage } from '../RetailApplyFlowPage'

const WEBSITE_APPLY_LISTING_PATH = '/countries'

/**
 * `/apply/new` renders the retail apply flow in `../RetailApplyFlowPage`.
 *
 * `WebsiteApplicationFlowLayout` supplies the canvas and centres the flow panel; it
 * intentionally renders no site header — the panel's own rail carries the brand mark,
 * destination context and exit.
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
