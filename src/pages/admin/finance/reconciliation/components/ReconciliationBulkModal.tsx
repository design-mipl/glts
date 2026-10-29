import { useEffect, useMemo, useState } from 'react'
import { Stack, Typography } from '@mui/material'
import { Button, FormField, Input, Modal } from '@/design-system/UIComponents'
import { getCurrentUser } from '@/shared/services/authService'
import type { ReconciliationItem } from '@/shared/types/reconciliation'
import { reconciliationRequiresBookEntry } from '../config/reconciliationListingConfig'

interface ReconciliationBulkModalProps {
  open: boolean
  items: ReconciliationItem[]
  onClose: () => void
  onConfirm: (bookEntryNumber: string) => void
}

function itemRequiresBookEntry(item: ReconciliationItem): boolean {
  if (item.sourceKind === 'claim_sheet' || item.sourceKind === 'payment_entry') return true
  return reconciliationRequiresBookEntry(item.tab)
}

export function ReconciliationBulkModal({
  open,
  items,
  onClose,
  onConfirm,
}: ReconciliationBulkModalProps) {
  const [bookEntryNumber, setBookEntryNumber] = useState('')
  const currentUserName = useMemo(() => getCurrentUser()?.name?.trim() || 'Accounts user', [])
  const pendingItems = useMemo(() => items.filter(item => item.status === 'pending'), [items])
  const requiresBookEntry = useMemo(
    () => pendingItems.some(item => itemRequiresBookEntry(item)),
    [pendingItems],
  )

  useEffect(() => {
    if (!open) return
    setBookEntryNumber('')
  }, [open, items])

  if (!open) return null

  const canSubmit =
    pendingItems.length > 0 && (!requiresBookEntry || Boolean(bookEntryNumber.trim()))

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
            onClick={() => onConfirm(bookEntryNumber.trim())}
            disabled={!canSubmit}
          />
        </Stack>
      }
    >
      <Stack spacing={2}>
        <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13 }}>
          Submit reconciliation for all selected pending rows. Already submitted rows are skipped.
        </Typography>
        <Typography variant="body2" sx={{ fontSize: 13 }}>
          User: <strong>{currentUserName}</strong>
        </Typography>
        {requiresBookEntry ? (
          <FormField label="Book entry number" required>
            <Input
              value={bookEntryNumber}
              onChange={setBookEntryNumber}
              placeholder="Enter book entry number for all selected rows"
              size="sm"
              fullWidth
            />
          </FormField>
        ) : null}
      </Stack>
    </Modal>
  )
}
