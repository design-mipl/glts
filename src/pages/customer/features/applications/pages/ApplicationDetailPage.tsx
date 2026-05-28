import { Box, Stack, Typography } from '@mui/material'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, MapPin, PlayCircle, Upload } from 'lucide-react'
import { Button } from '@/design-system/UIComponents'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'
import { useCustomerPortalBase } from '@/pages/customer/features/shared/hooks/useCustomerPortalBase'
import { navigateToResumeApplication } from '../utils/createApplicationNavigation'
import { customerPortalService } from '@/pages/customer/features/shared/services/customerPortalService'
import { CustomerEmptyState } from '@/pages/customer/features/shared/components/CustomerPrimitives'
import { ApplicationReviewPanels } from '../components/ApplicationReviewPanels'
import type { SubmitTimelineStatus } from '../types/applicationDetail.types'
import type { CustomerChecklistItem } from '@/pages/customer/features/shared/components/CustomerPrimitives'

function mapStatusToTimelineStatus(status: 'done' | 'completed' | 'in_progress' | 'pending'): SubmitTimelineStatus {
  if (status === 'done' || status === 'completed') return 'completed'
  if (status === 'in_progress') return 'active'
  return 'pending'
}

export function ApplicationDetailPage() {
  const colors = usePublicBrandColors()
  const { applicationId } = useParams()
  const navigate = useNavigate()
  const { base } = useCustomerPortalBase()
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

  const showContinue = app.statusLabel === 'Draft' || app.statusLabel === 'Correction Required'
  const timelineSteps = detail.timeline.map(stage => ({
    id: stage.id,
    label: stage.title,
    status: mapStatusToTimelineStatus(stage.status),
  }))
  const handleReuploadDocument = (_item: CustomerChecklistItem) => {
    navigateToResumeApplication(navigate, base)
  }

  return (
    <Box>
      <Button variant="text" startIcon={<ArrowLeft size={16} />} onClick={() => navigate(`${base}/applications`)} sx={{ mb: 2 }}>
        Back to applications
      </Button>

      <ApplicationReviewPanels
        rows={detail.uploadQueueRows}
        overview={{
          countryName: app.country,
          countryFlag: app.countryFlag ?? '',
          visaTypeLabel: app.visaType,
          travelDate: app.travelDate,
          gltsApplicationId: detail.resolvedId ?? app.id,
          gltsBatchId: isBulk ? (detail.resolvedId ?? app.id) : undefined,
        }}
        globalDocumentUploads={detail.globalDocumentUploads}
        timelineSteps={timelineSteps}
        onReuploadDocument={handleReuploadDocument}
      />

      {detail.corrections.length > 0 && showContinue ? (
        <Box sx={{ mb: 2, p: 2, borderRadius: '12px', border: `1px solid ${colors.border}`, bgcolor: colors.surfaceAlt }}>
          <Typography sx={{ fontWeight: 700, fontSize: 13, mb: 1 }}>Corrections requested</Typography>
          <Stack spacing={0.75}>
            {detail.corrections.map(correction => (
              <Typography key={correction.id} sx={{ fontSize: 12.5, color: colors.textSecondary }}>
                {correction.field}: {correction.reason}
              </Typography>
            ))}
          </Stack>
        </Box>
      ) : null}

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ mb: 1 }}>
        {showContinue ? (
          <Button variant="contained" startIcon={<PlayCircle size={16} />} onClick={() => navigateToResumeApplication(navigate, base)}>
            Continue processing
          </Button>
        ) : (
          <Button variant="contained" startIcon={<Upload size={16} />} onClick={() => navigateToResumeApplication(navigate, base)}>
            Upload documents
          </Button>
        )}
        <Button variant="outlined" startIcon={<MapPin size={16} />} onClick={() => navigate(`${base}/tracking?ref=${encodeURIComponent(app.id)}`)}>
          View tracking
        </Button>
        <Button variant="text" onClick={() => navigate(`${base}/applications`)}>
          Back to applications
        </Button>
      </Stack>
    </Box>
  )
}