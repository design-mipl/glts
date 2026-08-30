import { Box } from '@mui/material'
import { useLocation, useSearchParams } from 'react-router-dom'
import { ApplicationFlowPolicyProvider } from '@/pages/customer/features/applications/context/ApplicationFlowPolicyContext'
import { getListingReturnHref } from '@/shared/utils/listingNavigationUtils'
import { WebsiteApplicationFlowLayout } from '@/pages/website/components/WebsiteApplicationFlowLayout'
import { RetailApplyFlowShell } from '@/pages/website/pages/RetailApplyFlowPage/RetailApplyFlowShell'
import { getCountryMasterById, getVisaOfferings } from '@/shared/services/countryMasterService'
import { getRetailWebsiteDraft } from '@/shared/services/retailWebsiteApplicationService'
import { mockSingleApplications } from '@/pages/customer/features/applications/data/applicationFlowData'
import type { CreateApplicationLocationState } from '@/pages/customer/features/applications/utils/createApplicationNavigation'

const RETAIL_LISTING_PATH = '/admin/application-management/retail'

export function RetailCreateApplicationPage() {
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const listingHref = getListingReturnHref(location, RETAIL_LISTING_PATH)
  const navState = (location.state ?? null) as CreateApplicationLocationState | null
  const startFresh = Boolean(navState?.freshStart) && !searchParams.get('application')

  const applicationId = searchParams.get('application')?.trim() || undefined
  const draft = applicationId ? getRetailWebsiteDraft(applicationId) : undefined
  const listingRow = applicationId
    ? mockSingleApplications.find(row => row.id === applicationId)
    : undefined

  const countryId =
    searchParams.get('country')?.trim() ||
    draft?.countryId ||
    listingRow?.retailApply?.countryId ||
    ''
  const requestedVisa =
    searchParams.get('visa')?.trim() ||
    draft?.visaOfferingId ||
    listingRow?.retailApply?.visaOfferingId ||
    ''

  const countryExists = Boolean(countryId && getCountryMasterById(countryId))
  const visaOfferingId = countryExists
    ? requestedVisa || getVisaOfferings(countryId, true, 'retail')[0]?.id || ''
    : ''

  return (
    <Box
      sx={{
        position: 'fixed',
        inset: 0,
        // Below MUI modal/Select menus (1300) so overlays inside the flow stay usable.
        zIndex: theme => theme.zIndex.modal - 1,
      }}
    >
      <WebsiteApplicationFlowLayout>
        <ApplicationFlowPolicyProvider
          policy="admin"
          listingPath={listingHref}
          customerSegment="retail"
          breadcrumbItems={[]}
        >
          <RetailApplyFlowShell
            key={applicationId ?? (startFresh ? 'fresh' : 'new')}
            initialCountryId={countryExists ? countryId : ''}
            initialVisaOfferingId={visaOfferingId}
            applicationId={applicationId}
            startFresh={startFresh}
          />
        </ApplicationFlowPolicyProvider>
      </WebsiteApplicationFlowLayout>
    </Box>
  )
}
