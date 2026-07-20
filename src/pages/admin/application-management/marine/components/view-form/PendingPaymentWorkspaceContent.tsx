import type { ReactNode } from 'react'
import { Box, Divider, Stack, Typography } from '@mui/material'
import { BaseCard, Button } from '@/design-system/UIComponents'
import type { ApplicationProcessingTimelineStep } from '@/shared/types/applicationProcessingTimeline'
import type { FormAssistSubmissionDraft } from '@/shared/services/applicationFormAssistService'
import type { ApplicationDetailViewModel } from '@/pages/customer/features/applications/types/applicationDetail.types'
import type { UploadQueueRow } from '@/pages/customer/features/applications/data/applicationFlowData'
import { VerifyDocumentsTimeline } from '../verify/VerifyDocumentsTimeline'
import { ViewFormDocumentVault } from './ViewFormDocumentVault'
import { PendingPaymentSubmissionSection } from './PendingPaymentSubmissionSection'

export interface PendingPaymentWorkspaceContentProps {
  applicationId: string
  selectedRow: UploadQueueRow
  detail: ApplicationDetailViewModel
  submission: FormAssistSubmissionDraft
  country: string
  visaType: string
  countryId?: string
  visaOfferingId?: string
  timelineSteps: ApplicationProcessingTimelineStep[]
  multiTraveler: boolean
  readOnly?: boolean
  headerSlot?: ReactNode
  onChange: (patch: Partial<FormAssistSubmissionDraft>) => void
  onBack: () => void
}

export function PendingPaymentWorkspaceContent({
  applicationId,
  selectedRow,
  detail,
  submission,
  country,
  visaType,
  countryId,
  visaOfferingId,
  timelineSteps,
  multiTraveler,
  readOnly = false,
  headerSlot,
  onChange,
  onBack,
}: PendingPaymentWorkspaceContentProps) {
  return (
    <Stack spacing={2}>
      {headerSlot}

      <VerifyDocumentsTimeline steps={timelineSteps} multiTraveler={multiTraveler} />

      <ViewFormDocumentVault
        applicationId={applicationId}
        selectedRow={selectedRow}
        detail={detail}
        submission={submission}
      />

      <BaseCard sx={{ overflow: 'hidden' }}>
        <Stack spacing={2} sx={{ p: 2 }}>
          <Box sx={{ px: 0.5 }}>
            <Typography variant="subtitle2" fontWeight={600} sx={{ fontSize: 15 }}>
              Submission & Payment
            </Typography>
          </Box>
          <Divider />
          <Box sx={{ px: 0.5, pt: 0.5 }}>
            <PendingPaymentSubmissionSection
              submission={submission}
              country={country}
              visaType={visaType}
              countryId={countryId}
              visaOfferingId={visaOfferingId}
              readOnly={readOnly}
              onChange={onChange}
            />
          </Box>
          <Divider />
          <Stack direction="row" spacing={1} justifyContent="flex-end" flexWrap="wrap" useFlexGap>
            <Button variant="outlined" onClick={onBack}>
              Back to listing
            </Button>
          </Stack>
        </Stack>
      </BaseCard>
    </Stack>
  )
}
