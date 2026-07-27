import { useEffect, useMemo, useState } from 'react'
import { Stack, Typography } from '@mui/material'
import { Button, FormField, Modal, Select, Textarea } from '@/design-system/UIComponents'
import { applicationProcessingStatusService } from '@/shared/services/applicationProcessingStatusService'
import { statusMasterService } from '@/shared/services/statusMasterService'
import type { ApplicationProcessingStatusAction } from '@/shared/types/applicationProcessingStatus'

export interface UpdateProcessingStatusModalProps {
  open: boolean
  applicationId: string
  travelerRowId: string
  currentStatusId: string
  countryId?: string
  countryName?: string
  visaTypeLabel?: string
  visaOfferingId?: string
  onClose: () => void
  onUpdated: () => void
}

function actionHint(action: ApplicationProcessingStatusAction): string {
  if (action === 'reject') return 'Reject / refuse path'
  if (action === 'hold') return 'Put on hold'
  if (action === 'resume') return 'Resume from hold'
  return 'Advance'
}

export function UpdateProcessingStatusModal({
  open,
  applicationId,
  travelerRowId,
  currentStatusId,
  countryId,
  countryName,
  visaTypeLabel,
  visaOfferingId,
  onClose,
  onUpdated,
}: UpdateProcessingStatusModalProps) {
  const options = useMemo(
    () =>
      applicationProcessingStatusService.listTransitionOptions({
        applicationId,
        travelerRowId,
        countryId,
        countryName,
        visaTypeLabel,
        visaOfferingId,
      }),
    [applicationId, travelerRowId, countryId, countryName, visaTypeLabel, visaOfferingId, open, currentStatusId],
  )

  const selectOptions = useMemo(
    () =>
      options.map((opt) => ({
        value: `${opt.action}::${opt.statusId}`,
        label: `${opt.label} (${actionHint(opt.action)})`,
      })),
    [options],
  )

  const [selectedKey, setSelectedKey] = useState('')
  const [note, setNote] = useState('')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!open) return
    setSelectedKey(selectOptions[0]?.value ?? '')
    setNote('')
    setError(null)
  }, [open, selectOptions])

  const currentLabel = statusMasterService.getById(currentStatusId)?.name ?? currentStatusId

  const handleSubmit = () => {
    const [action, statusId] = selectedKey.split('::') as [
      ApplicationProcessingStatusAction,
      string,
    ]
    if (!action || !statusId) {
      setError('Select a status to continue.')
      return
    }

    const result = applicationProcessingStatusService.setStatus({
      applicationId,
      travelerRowId,
      nextStatusId: statusId,
      action,
      note,
      countryId,
      countryName,
      visaTypeLabel,
      visaOfferingId,
    })

    if (!result.ok) {
      setError(result.error)
      return
    }

    onUpdated()
    onClose()
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Update processing status"
      subtitle={`Current: ${currentLabel}`}
      footer={
        <Stack direction="row" spacing={1} justifyContent="flex-end">
          <Button label="Cancel" variant="neutral" onClick={onClose} />
          <Button
            label="Update"
            onClick={handleSubmit}
            disabled={!selectOptions.length || !selectedKey}
          />
        </Stack>
      }
    >
      <Stack spacing={1.5}>
        <FormField label="Next status" required>
          <Select
            value={selectedKey}
            onChange={(v) => setSelectedKey(String(v))}
            options={selectOptions}
            placeholder={selectOptions.length ? 'Select status' : 'No transitions available'}
            disabled={!selectOptions.length}
          />
        </FormField>
        <FormField label="Note (optional)">
          <Textarea
            value={note}
            onChange={setNote}
            rows={3}
            placeholder="Reason for reject, hold, or status change…"
          />
        </FormField>
        {error ? (
          <Typography sx={{ fontSize: 12, color: 'error.main' }}>{error}</Typography>
        ) : null}
        {!selectOptions.length ? (
          <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>
            This traveler is at a terminal status. No further updates are available.
          </Typography>
        ) : null}
      </Stack>
    </Modal>
  )
}
