import type { ReactNode } from 'react'
import { Box, Divider, Stack, Typography } from '@mui/material'
import { BaseCard, Button } from '@/design-system/UIComponents'
import type { FormAssistSubmissionDraft } from '@/shared/services/applicationFormAssistService'
import type { ApplicationDetailViewModel } from '@/pages/customer/features/applications/types/applicationDetail.types'
import type { UploadQueueRow } from '@/pages/customer/features/applications/data/applicationFlowData'
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
  readOnly?: boolean
  onChange: (patch: Partial<FormAssistSubmissionDraft>) => void
  onBack: () => void
  /** When true, omit outer back button (parent footer handles navigation). */
  hideFooter?: boolean
  headerActions?: ReactNode
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
  readOnly = false,
  onChange,
  onBack,
  hideFooter = false,
  headerActions,
}: PendingPaymentWorkspaceContentProps) {
  return (
    <Stack spacing={2}>
      {headerActions ? (
        <Stack direction="row" justifyContent="flex-end" spacing={1} useFlexGap sx={{ flexWrap: 'wrap' }}>
          {headerActions}
        </Stack>
      ) : null}

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
          {!hideFooter ? (
            <>
              <Divider />
              <Stack direction="row" spacing={1} justifyContent="flex-end" flexWrap="wrap" useFlexGap>
                <Button variant="outlined" onClick={onBack}>
                  Back to listing
                </Button>
              </Stack>
            </>
          ) : null}
        </Stack>
      </BaseCard>
    </Stack>
  )
}
