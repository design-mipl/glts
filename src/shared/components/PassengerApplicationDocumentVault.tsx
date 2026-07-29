import { useMemo } from 'react'
import { Stack, Typography } from '@mui/material'
import { ViewFormDocumentVault } from '@/pages/admin/application-management/marine/components/view-form/ViewFormDocumentVault'
import { applicationFormAssistService } from '@/shared/services/applicationFormAssistService'
import { marineApplicationAdminService } from '@/shared/services/marineApplicationAdminService'

export interface PassengerDocumentVaultIdentity {
  applicationId: string
  gltsApplicantId: string
  sequenceNo: number
}

export function resolvePassengerDocumentVaultContext(identity: PassengerDocumentVaultIdentity) {
  const detail = marineApplicationAdminService.getDetail(identity.applicationId)
  const queueRows = detail.uploadQueueRows.filter(row => row.status !== 'processing')
  const queueRow =
    queueRows.find(row => row.gltsApplicantId === identity.gltsApplicantId) ??
    queueRows.find(row => row.sequenceNo === identity.sequenceNo)
  const travelerRowId = queueRow?.id ?? `q${identity.sequenceNo}`
  const submission = applicationFormAssistService.getRecord(
    identity.applicationId,
    travelerRowId,
  ).submission

  return { detail, queueRow, submission }
}

/** Application document vault shared across Assignment, Fund Allocation, and Ground Ops drawers. */
export function PassengerApplicationDocumentVault({
  applicationId,
  gltsApplicantId,
  sequenceNo,
}: PassengerDocumentVaultIdentity) {
  const context = useMemo(
    () => resolvePassengerDocumentVaultContext({ applicationId, gltsApplicantId, sequenceNo }),
    [applicationId, gltsApplicantId, sequenceNo],
  )

  if (!context.queueRow) {
    return (
      <Typography variant="body2" color="text.secondary" sx={{ fontSize: 12 }}>
        Traveler upload queue is not available for this passenger yet.
      </Typography>
    )
  }

  return (
    <Stack spacing={0}>
      <ViewFormDocumentVault
        applicationId={applicationId}
        selectedRow={context.queueRow}
        detail={context.detail}
        submission={context.submission}
        defaultExpanded
      />
    </Stack>
  )
}
