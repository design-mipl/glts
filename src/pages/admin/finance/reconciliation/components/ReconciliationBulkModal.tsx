import { useEffect, useMemo, useState } from 'react'
import { Stack, Typography } from '@mui/material'
import { Button, FormField, Input, Modal } from '@/design-system/UIComponents'
import { getCurrentUser } from '@/shared/services/authService'
import type { ReconciliationItem, ReconciliationTab } from '@/shared/types/reconciliation'
import {
  getReconciliationReferenceLabel,
  reconciliationRequiresBookEntry,
} from '../config/reconciliationListingConfig'

interface ReconciliationBulkModalProps {
  open: boolean
  items: ReconciliationItem[]
  tab: ReconciliationTab
  onClose: () => void
  onConfirm: (referenceNumber: string) => void
}

export function ReconciliationBulkModal({
  open,
  items,
  tab,
  onClose,
  onConfirm,
}: ReconciliationBulkModalProps) {
  const [referenceNumber, setReferenceNumber] = useState('')
  const referenceLabel = getReconciliationReferenceLabel(tab)
  const requiresBookEntry = reconciliationRequiresBookEntry(tab)
  const currentUserName = useMemo(() => getCurrentUser()?.name?.trim() || 'Accounts user', [])

  const pendingItems = useMemo(() => items.filter(item => item.status === 'pending'), [items])

  useEffect(() => {
    if (!open) return
    setReferenceNumber('')
  }, [open, items])

  if (!open) return null

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Bulk reconcile"
      subtitle={`${pendingItems.length} pending record${pendingItems.length === 1 ? '' : 's'} selected`}
      footer={
        <Stack direction="row" spacing={1} justifyContent="flex-end">
          <Button label="Cancel" variant="neutral" onClick={onClose} />
          <Button
            label="Submit"
            variant="contained"
            onClick={() => onConfirm(referenceNumber)}
            disabled={pendingItems.length === 0 || (requiresBookEntry && !referenceNumber.trim())}
          />
        </Stack>
      }
    >
      <Stack spacing={2}>
        <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13 }}>
          {requiresBookEntry
            ? `Apply one ${referenceLabel.toLowerCase()} to all selected pending rows. Already submitted rows are skipped.`
            : 'Submit reconciliation for all selected pending rows. Already submitted rows are skipped.'}
        </Typography>
        <Typography variant="body2" sx={{ fontSize: 13 }}>
          User: <strong>{currentUserName}</strong>
        </Typography>
        {requiresBookEntry ? (
          <FormField label={referenceLabel} required>
            <Input
              value={referenceNumber}
              onChange={setReferenceNumber}
              placeholder={`Enter ${referenceLabel.toLowerCase()}`}
              size="sm"
              fullWidth
            />
          </FormField>
        ) : null}
      </Stack>
    </Modal>
  )
}
