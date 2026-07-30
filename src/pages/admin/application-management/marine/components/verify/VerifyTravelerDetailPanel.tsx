import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { Box, Stack, Typography } from '@mui/material'
import { Badge, BaseCard, Button, Tabs } from '@/design-system/UIComponents'
import { ensureRowBasicDetails } from '@/pages/customer/features/applications/utils/applicantBasicDetailsUtils'
import { ApplicationSummaryContent } from '@/pages/customer/features/applications/components/ApplicationSummaryContent'
import { toApplicationReviewOverview } from '@/pages/customer/features/applications/utils/applicationReviewOverview'
import type { ApplicationDetailViewModel } from '@/pages/customer/features/applications/types/applicationDetail.types'
import type { UploadQueueRow } from '@/pages/customer/features/applications/data/applicationFlowData'
import type { ApplicationProcessingTimelineStep } from '@/shared/types/applicationProcessingTimeline'
import { ApplicationProcessingTimeline } from '@/pages/customer/features/applications/components/ApplicationProcessingTimeline'
import { getTravelerDocProgress, type VerifyOverviewData } from '../../utils/verifyDocumentsUtils'
import { UpdateProcessingStatusModal } from './UpdateProcessingStatusModal'

export interface VerifyDetailWorkTab {
  value: string
  label: string
  disabled?: boolean
  content: ReactNode
}

interface VerifyTravelerDetailPanelProps {
  selectedRow: UploadQueueRow | null
  timelineSteps: ApplicationProcessingTimelineStep[]
  overview?: VerifyOverviewData
  detail?: ApplicationDetailViewModel
  applicationId?: string
  singleListing?: boolean
  workTabs: VerifyDetailWorkTab[]
  /** Shown above work-tab content (e.g. form unlock hint). */
  workTabHint?: ReactNode
  headerActions?: ReactNode
  emptyMessage?: string
  /** When set, Timeline tab shows Update status for manual workflow advances. */
  processingStatus?: {
    currentStatusId: string
    countryId?: string
    countryName?: string
    visaTypeLabel?: string
    visaOfferingId?: string
    modalOpen: boolean
    onOpenModal: () => void
    onCloseModal: () => void
    onUpdated: () => void
  }
}

function progressBadgeColor(tone: ReturnType<typeof getTravelerDocProgress>['tone']) {
  if (tone === 'completed') return 'success' as const
  if (tone === 'correction') return 'error' as const
  return 'warning' as const
}

/** Badge color for the active processing-timeline status (not document progress). */
function processingStatusBadgeColor(
  stepId: string | undefined,
  label: string,
): 'success' | 'warning' | 'info' | 'error' | 'neutral' {
  const id = (stepId ?? '').toLowerCase()
  const text = label.toLowerCase()

  if (id.includes('on-hold') || text.includes('on hold')) return 'warning'
  if (
    id.includes('refus') ||
    id.includes('reject') ||
    text.includes('refus') ||
    text.includes('reject')
  ) {
    return 'error'
  }
  if (
    id.includes('all-documents-received') ||
    id.includes('visa-status-approved') ||
    id.includes('passport-collected') ||
    id.includes('delivered') ||
    text.includes('approved') ||
    text.includes('delivered') ||
    text.includes('passport collected') ||
    text.includes('all documents received')
  ) {
    return 'success'
  }
  if (id.includes('dispatch') || text.includes('dispatch')) return 'info'
  return 'info'
}

const PASSENGER_TAB = 'passenger'
const TIMELINE_TAB = 'timeline'

export function VerifyTravelerDetailPanel({
  selectedRow,
  timelineSteps,
  overview,
  detail,
  applicationId,
  singleListing = false,
  workTabs,
  workTabHint,
  headerActions,
  emptyMessage = 'Select a passenger to continue.',
  processingStatus,
}: VerifyTravelerDetailPanelProps) {
  const firstWorkTab = workTabs[0]?.value
  const [activeTab, setActiveTab] = useState(firstWorkTab ?? PASSENGER_TAB)

  useEffect(() => {
    setActiveTab(firstWorkTab ?? PASSENGER_TAB)
  }, [selectedRow?.id, firstWorkTab])

  useEffect(() => {
    const stillValid =
      activeTab === PASSENGER_TAB ||
      activeTab === TIMELINE_TAB ||
      workTabs.some(tab => tab.value === activeTab && !tab.disabled)
    if (!stillValid) {
      setActiveTab(firstWorkTab ?? PASSENGER_TAB)
    }
  }, [workTabs, activeTab, firstWorkTab])

  const tabItems = useMemo(
    () => [
      { value: PASSENGER_TAB, label: 'Passenger' },
      { value: TIMELINE_TAB, label: 'Timeline' },
      ...workTabs.map(tab => ({
        value: tab.value,
        label: tab.label,
        disabled: tab.disabled,
      })),
    ],
    [workTabs],
  )

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
          {emptyMessage}
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
  const statusBadgeColor = activeStep
    ? processingStatusBadgeColor(activeStep.id, activeStep.label)
    : progressBadgeColor(progress.tone)
  const showApplicantSummary = Boolean(overview && detail && applicationId)
  const activeWorkTab = workTabs.find(tab => tab.value === activeTab)

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
                color: 'text.primary',
                wordBreak: 'break-word',
                lineHeight: 1.3,
              }}
            >
              {selectedRow.travelerName}
            </Typography>
            <Typography sx={{ mt: 0.25, fontSize: 12, color: 'text.secondary', wordBreak: 'break-word' }}>
              Passport: {passport} · Nationality: {nationality}
            </Typography>
          </Box>
          <Stack direction="row" spacing={0.75} alignItems="center" useFlexGap sx={{ flexWrap: 'wrap' }}>
            <Badge label={statusLabel} color={statusBadgeColor} size="sm" />
            {headerActions}
          </Stack>
        </Stack>
      </Box>

      <Box
        sx={{
          px: 2,
          borderBottom: 1,
          borderColor: 'divider',
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          minWidth: 0,
        }}
      >
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Tabs
            value={activeTab}
            onChange={setActiveTab}
            variant="underline"
            size="sm"
            items={tabItems}
          />
        </Box>
        {processingStatus && applicationId && activeTab === TIMELINE_TAB ? (
          <Button
            label="Update status"
            size="sm"
            variant="neutral"
            onClick={processingStatus.onOpenModal}
            sx={{ flexShrink: 0, mb: 0.25 }}
          />
        ) : null}
      </Box>

      <Box
        sx={{
          flex: 1,
          height: 0,
          minHeight: 0,
          overflow: activeWorkTab ? 'hidden' : 'auto',
          p: 2,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {activeTab === PASSENGER_TAB ? (
          showApplicantSummary ? (
            <ApplicationSummaryContent
              overview={toApplicationReviewOverview(overview!)}
              row={selectedRow}
              singleListing={singleListing}
              verifyContext={{ detail: detail!, applicationId: applicationId! }}
            />
          ) : (
            <Stack spacing={1.5}>
              <Typography sx={{ fontSize: 13, fontWeight: 600 }}>Passenger</Typography>
              <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>
                {selectedRow.travelerName} · {passport} · {nationality}
              </Typography>
            </Stack>
          )
        ) : null}

        {activeTab === TIMELINE_TAB ? (
          <Stack spacing={1.5} sx={{ flex: 1, height: 0, minHeight: 0 }}>
            <Box sx={{ flex: 1, height: 0, minHeight: 0, overflow: 'auto' }}>
              <ApplicationProcessingTimeline steps={timelineSteps} orientation="vertical" />
            </Box>
            {processingStatus && applicationId ? (
              <UpdateProcessingStatusModal
                open={processingStatus.modalOpen}
                applicationId={applicationId}
                travelerRowId={selectedRow.id}
                currentStatusId={processingStatus.currentStatusId}
                countryId={processingStatus.countryId}
                countryName={processingStatus.countryName}
                visaTypeLabel={processingStatus.visaTypeLabel}
                visaOfferingId={processingStatus.visaOfferingId}
                onClose={processingStatus.onCloseModal}
                onUpdated={processingStatus.onUpdated}
              />
            ) : null}
          </Stack>
        ) : null}

        {activeWorkTab ? (
          <Stack spacing={1.5} sx={{ flex: 1, height: 0, minHeight: 0, overflow: 'hidden' }}>
            {workTabHint ? <Box sx={{ flexShrink: 0 }}>{workTabHint}</Box> : null}
            <Box
              sx={{
                flex: 1,
                height: 0,
                minHeight: 0,
                display: 'flex',
                flexDirection: 'column',
                // Nested panes may scroll internally; auto also covers work-tab
                // content that grows with the page (payment, form, etc.).
                overflow: 'auto',
              }}
            >
              {activeWorkTab.content}
            </Box>
          </Stack>
        ) : null}
      </Box>
    </BaseCard>
  )
}
