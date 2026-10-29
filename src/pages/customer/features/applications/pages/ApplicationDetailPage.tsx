import { Stack } from '@mui/material'
import { useParams, useNavigate } from 'react-router-dom'
import { MapPin, PlayCircle, Upload } from 'lucide-react'
import { Breadcrumb, Button } from '@/design-system/UIComponents'
import { useCustomerPortalBase } from '@/pages/customer/features/shared/hooks/useCustomerPortalBase'
import {
  navigateToContinueRetailApplication,
  navigateToResumeApplication,
} from '../utils/createApplicationNavigation'
import { customerPortalService } from '@/pages/customer/features/shared/services/customerPortalService'
import { CustomerEmptyState } from '@/pages/customer/features/shared/components/CustomerPrimitives'
import { ApplicationReviewPanels } from '../components/ApplicationReviewPanels'
import type { CustomerChecklistItem } from '@/pages/customer/features/shared/components/CustomerPrimitives'
import { resolveApplicationReferenceDisplay } from '../utils/gltsReferenceIds'
import { mockSingleApplications } from '../data/applicationFlowData'
import { getSavedDraftListingRows } from '@/shared/services/applicationListingDraftStorage'

export function ApplicationDetailPage() {
  const { applicationId } = useParams()
  const navigate = useNavigate()
  const { base, isBusiness } = useCustomerPortalBase()
  const isRetail = !isBusiness
  const detail = customerPortalService.getApplicationDetail(applicationId)
  const app = detail.application
  const isBulk = detail.isBulkBatch

  if (!app) {
    return (
      <CustomerEmptyState
        title="Application not found"
        description="The application may have been moved or you may not have access to it."
        actionLabel="Back to applications"
        onAction={() => navigate(`${base}/applications`)}
      />
    )
  }

  const listingRow = [...getSavedDraftListingRows(), ...mockSingleApplications].find(
    row => row.id === (detail.resolvedId ?? app.id),
  )

  const showContinue = app.statusLabel === 'Draft' || app.statusLabel === 'Correction Required'

  const handleContinue = () => {
    if (isRetail && listingRow) {
      navigateToContinueRetailApplication(navigate, listingRow, base)
      return
    }
    navigateToResumeApplication(navigate, base)
  }

  const handleReuploadDocument = (_item: CustomerChecklistItem) => {
    handleContinue()
  }

  const { primaryId } = resolveApplicationReferenceDisplay(
    isBulk ? undefined : detail.resolvedId ?? app.id,
    isBulk ? detail.resolvedId ?? app.id : undefined,
  )

  return (
    <Stack spacing={2}>
      <Breadcrumb
        sx={{ mb: 0.5 }}
        items={[
          { label: isRetail ? 'My applications' : 'Application Management', href: `${base}/applications` },
          { label: primaryId ?? app.country },
        ]}
      />

      <ApplicationReviewPanels
        rows={detail.uploadQueueRows}
        applicationId={detail.resolvedId ?? app.id}
        isBulk={isBulk}
        detail={detail}
        corrections={detail.corrections}
        overview={{
          countryName: app.country,
          countryFlag: app.countryFlag ?? '',
          visaTypeLabel: app.visaType,
          travelDate: app.travelDate,
          jurisdiction: app.jurisdiction,
          gltsApplicationId: isBulk ? undefined : detail.resolvedId ?? app.id,
          gltsBatchId: isBulk ? detail.resolvedId ?? app.id : undefined,
        }}
        globalDocumentUploads={detail.globalDocumentUploads}
        onReuploadDocument={handleReuploadDocument}
      />

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
        {showContinue ? (
          <Button variant="contained" startIcon={<PlayCircle size={16} />} onClick={handleContinue}>
            {isRetail && app.statusLabel === 'Draft' ? 'Continue application' : 'Continue processing'}
          </Button>
        ) : (
          <Button
            variant="contained"
            startIcon={<Upload size={16} />}
            onClick={handleContinue}
          >
            Upload documents
          </Button>
        )}
        <Button
          variant="outlined"
          startIcon={<MapPin size={16} />}
          onClick={() => navigate(`${base}/tracking?ref=${encodeURIComponent(app.id)}`)}
        >
          View tracking
        </Button>
      </Stack>
    </Stack>
  )
}
