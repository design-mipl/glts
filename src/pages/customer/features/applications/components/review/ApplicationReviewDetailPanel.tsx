import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { Box, Stack, Typography } from '@mui/material'
import { Badge } from '@/design-system/UIComponents'
import { BORDER_RADIUS, BORDER_WIDTH } from '@/design-system/tokens'
import { CustomerTabs } from '@/pages/customer/features/shared/components/CustomerPrimitives'
import { ensureRowBasicDetails } from '../../utils/applicantBasicDetailsUtils'
import { ApplicationSummaryContent } from '../ApplicationSummaryContent'
import { ApplicationProcessingTimeline } from '../ApplicationProcessingTimeline'
import type { UploadQueueRow } from '../../data/applicationFlowData'
import type { ApplicationReviewOverview } from '../../utils/applicationReviewOverview'
import type { ApplicationDetailViewModel } from '../../types/applicationDetail.types'
import type { ApplicationProcessingTimelineStep } from '@/shared/types/applicationProcessingTimeline'
import { getTravelerDocProgress } from '@/pages/admin/application-management/marine/utils/verifyDocumentsUtils'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'

const PASSENGER_TAB = 'passenger'
const TIMELINE_TAB = 'timeline'
const DOCUMENTS_TAB = 'documents'

interface ApplicationReviewDetailPanelProps {
  selectedRow: UploadQueueRow | null
  overview: ApplicationReviewOverview
  timelineSteps: ApplicationProcessingTimelineStep[]
  singleListing: boolean
  detail?: ApplicationDetailViewModel
  applicationId?: string
  documentsContent: ReactNode
}

function progressBadgeColor(tone: ReturnType<typeof getTravelerDocProgress>['tone']) {
  if (tone === 'completed') return 'success' as const
  if (tone === 'correction') return 'error' as const
  return 'warning' as const
}

export function ApplicationReviewDetailPanel({
  selectedRow,
  overview,
  timelineSteps,
  singleListing,
  detail,
  applicationId,
  documentsContent,
}: ApplicationReviewDetailPanelProps) {
  const colors = usePublicBrandColors()
  const [activeTab, setActiveTab] = useState(DOCUMENTS_TAB)

  useEffect(() => {
    setActiveTab(DOCUMENTS_TAB)
  }, [selectedRow?.id])

  const tabItems = useMemo(
    () => [
      { value: PASSENGER_TAB, label: 'Passenger' },
      { value: DOCUMENTS_TAB, label: 'Documents' },
      { value: TIMELINE_TAB, label: 'Timeline' },
    ],
    [],
  )

  if (!selectedRow) {
    return (
      <Box
        sx={{
          p: 2.5,
          borderRadius: BORDER_RADIUS.xl,
          border: `${BORDER_WIDTH.thin} solid ${colors.border}`,
          bgcolor: colors.white,
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 280,
        }}
      >
        <Typography sx={{ fontSize: 13, color: colors.textSecondary, textAlign: 'center' }}>
          Select a passenger to view details, timeline, and documents.
        </Typography>
      </Box>
    )
  }

  const basic = ensureRowBasicDetails(selectedRow)
  const passport =
    basic.basicDetails?.passportNumber?.trim() || selectedRow.passportNo || '—'
  const nationality =
    basic.basicDetails?.nationality?.trim() ||
    (selectedRow.nationality !== '—' ? selectedRow.nationality : '') ||
    '—'
  const progress = getTravelerDocProgress(selectedRow)
  const activeStep = timelineSteps.find(step => step.status === 'active')
  const statusLabel = activeStep?.label ?? progress.label
  const showFullSummary = Boolean(detail && applicationId)

  return (
    <Box
      sx={{
        borderRadius: BORDER_RADIUS.xl,
        border: `${BORDER_WIDTH.thin} solid ${colors.border}`,
        bgcolor: colors.white,
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        minHeight: 0,
        height: '100%',
        overflow: 'hidden',
      }}
    >
      <Box sx={{ px: 2, pt: 1.75, pb: 1, flexShrink: 0 }}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          justifyContent="space-between"
          alignItems={{ xs: 'flex-start', sm: 'center' }}
          spacing={1}
        >
          <Box sx={{ minWidth: 0 }}>
            <Typography
              sx={{
                fontSize: 13,
                fontWeight: 700,
                color: colors.navy,
                wordBreak: 'break-word',
                lineHeight: 1.3,
              }}
            >
              {selectedRow.travelerName}
            </Typography>
            <Typography sx={{ mt: 0.25, fontSize: 12, color: colors.textSecondary, wordBreak: 'break-word' }}>
              Passport: {passport} · Nationality: {nationality}
            </Typography>
          </Box>
          <Badge label={statusLabel} color={progressBadgeColor(progress.tone)} size="sm" />
        </Stack>
      </Box>

      <Box sx={{ px: 2, flexShrink: 0 }}>
        <CustomerTabs value={activeTab} onChange={setActiveTab} items={tabItems} />
      </Box>

      <Box sx={{ flex: 1, minHeight: 0, overflow: 'auto', px: 2, pb: 2 }}>
        {activeTab === PASSENGER_TAB ? (
          showFullSummary ? (
            <ApplicationSummaryContent
              overview={overview}
              row={selectedRow}
              singleListing={singleListing}
              verifyContext={{ detail: detail!, applicationId: applicationId! }}
            />
          ) : (
            <ApplicationSummaryContent
              overview={overview}
              row={selectedRow}
              singleListing={singleListing}
            />
          )
        ) : null}

        {activeTab === DOCUMENTS_TAB ? documentsContent : null}

        {activeTab === TIMELINE_TAB ? (
          <ApplicationProcessingTimeline steps={timelineSteps} orientation="vertical" />
        ) : null}
      </Box>
    </Box>
  )
}
