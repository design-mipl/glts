import { useEffect, useState, type ReactNode } from 'react'
import { Box, Collapse, Divider, Stack, Typography } from '@mui/material'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { Badge, BaseCard, Button } from '@/design-system/UIComponents'
import { ensureRowBasicDetails } from '@/pages/customer/features/applications/utils/applicantBasicDetailsUtils'
import { ApplicationSummaryContent } from '@/pages/customer/features/applications/components/ApplicationSummaryContent'
import { toApplicationReviewOverview } from '@/pages/customer/features/applications/utils/applicationReviewOverview'
import type { ApplicationDetailViewModel } from '@/pages/customer/features/applications/types/applicationDetail.types'
import type { UploadQueueRow } from '@/pages/customer/features/applications/data/applicationFlowData'
import type { ApplicationProcessingTimelineStep } from '@/shared/types/applicationProcessingTimeline'
import { ApplicationProcessingTimeline } from '@/pages/customer/features/applications/components/ApplicationProcessingTimeline'
import { getTravelerDocProgress, type VerifyOverviewData } from '../../utils/verifyDocumentsUtils'

interface VerifyTravelerDetailPanelProps {
  selectedRow: UploadQueueRow | null
  timelineSteps: ApplicationProcessingTimelineStep[]
  multiTraveler: boolean
  overview?: VerifyOverviewData
  detail?: ApplicationDetailViewModel
  applicationId?: string
  singleListing?: boolean
  children: ReactNode
}

function progressBadgeColor(tone: ReturnType<typeof getTravelerDocProgress>['tone']) {
  if (tone === 'completed') return 'success' as const
  if (tone === 'correction') return 'error' as const
  return 'warning' as const
}

export function VerifyTravelerDetailPanel({
  selectedRow,
  timelineSteps,
  multiTraveler,
  overview,
  detail,
  applicationId,
  singleListing = false,
  children,
}: VerifyTravelerDetailPanelProps) {
  const [timelineOpen, setTimelineOpen] = useState(false)
  const [detailsOpen, setDetailsOpen] = useState(false)

  useEffect(() => {
    setDetailsOpen(false)
    setTimelineOpen(false)
  }, [selectedRow?.id])

  if (!selectedRow) {
    return (
      <BaseCard
        sx={{
          p: 2.5,
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 280,
        }}
      >
        <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13, textAlign: 'center' }}>
          Select a passenger to review documents and complete verification.
        </Typography>
      </BaseCard>
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
  const showApplicantSummary = Boolean(overview && detail && applicationId)

  return (
    <BaseCard
      sx={{
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        minHeight: 0,
        height: '100%',
        overflow: 'hidden',
      }}
    >
      <Box sx={{ px: 2, pt: 1.75, pb: 1.25, flexShrink: 0 }}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          justifyContent="space-between"
          alignItems={{ xs: 'flex-start', sm: 'center' }}
          spacing={1}
        >
          <Box sx={{ minWidth: 0 }}>
            <Typography sx={{ fontWeight: 700, fontSize: 14, lineHeight: 1.3 }}>
              Passenger details
            </Typography>
            <Typography
              sx={{
                mt: 0.35,
                fontSize: 13,
                fontWeight: 600,
                color: 'text.primary',
                wordBreak: 'break-word',
              }}
            >
              {selectedRow.travelerName}
            </Typography>
            <Typography sx={{ mt: 0.25, fontSize: 12, color: 'text.secondary', wordBreak: 'break-word' }}>
              Passport: {passport} · Nationality: {nationality}
            </Typography>
          </Box>
          <Stack direction="row" spacing={0.75} alignItems="center" useFlexGap sx={{ flexWrap: 'wrap' }}>
            <Badge label={statusLabel} color={progressBadgeColor(progress.tone)} size="sm" />
            {showApplicantSummary ? (
              <Button
                label={detailsOpen ? 'Hide details' : 'Additional details'}
                variant="neutral"
                size="sm"
                endIcon={detailsOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                onClick={() => setDetailsOpen(open => !open)}
              />
            ) : null}
          </Stack>
        </Stack>

        {showApplicantSummary ? (
          <Collapse in={detailsOpen}>
            <Box sx={{ pt: 1.5 }}>
              <ApplicationSummaryContent
                overview={toApplicationReviewOverview(overview!)}
                row={selectedRow}
                singleListing={singleListing}
                verifyContext={{ detail: detail!, applicationId: applicationId! }}
              />
            </Box>
          </Collapse>
        ) : null}
      </Box>

      <Divider />

      <Box sx={{ px: 2, py: 1, flexShrink: 0 }}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          spacing={1}
          sx={{ cursor: 'pointer' }}
          onClick={() => setTimelineOpen(open => !open)}
          role="button"
          tabIndex={0}
          onKeyDown={event => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault()
              setTimelineOpen(open => !open)
            }
          }}
        >
          <Box sx={{ minWidth: 0 }}>
            <Typography sx={{ fontWeight: 700, fontSize: 13 }}>Processing timeline</Typography>
            {!timelineOpen && activeStep ? (
              <Typography sx={{ fontSize: 11, color: 'text.secondary', mt: 0.15 }}>
                Current: {activeStep.label}
                {activeStep.date ? ` · ${activeStep.date}` : ''}
                {multiTraveler ? ' · Selected traveler' : ''}
              </Typography>
            ) : null}
          </Box>
          <Button
            label={timelineOpen ? 'Hide' : 'Show'}
            variant="neutral"
            size="sm"
            endIcon={timelineOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            onClick={event => {
              event.stopPropagation()
              setTimelineOpen(open => !open)
            }}
          />
        </Stack>
        <Collapse in={timelineOpen}>
          <Box sx={{ pt: 1.25 }}>
            <ApplicationProcessingTimeline steps={timelineSteps} />
          </Box>
        </Collapse>
      </Box>

      <Divider />

      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          overflow: 'auto',
          p: 2,
        }}
      >
        {children}
      </Box>
    </BaseCard>
  )
}
