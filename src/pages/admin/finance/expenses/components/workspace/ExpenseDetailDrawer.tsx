import { Grid, Stack, Typography } from '@mui/material'
import { Button, Modal } from '@/design-system/UIComponents'
import type { ApplicationExpenseRecord } from '@/shared/types/applicationExpenseManagement'
import { formatInr } from '@/shared/utils/invoiceCalculations'
import {
  getBillToLabel,
  getPaidByLabel,
  getProofDocumentTypeLabel,
} from '../../config/expenseDetailFormConfig'
import { expenseProofStatusLabel } from '../../config/expenseStatusConfig'

interface ExpenseDetailDrawerProps {
  open: boolean
  expense: ApplicationExpenseRecord | null
  onClose: () => void
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <Stack spacing={0.25}>
      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
        {label}
      </Typography>
      <Typography variant="body2">{value || '—'}</Typography>
    </Stack>
  )
}

export function ExpenseDetailDrawer({ open, expense, onClose }: ExpenseDetailDrawerProps) {
  if (!expense) return null

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`Expense · ${expense.expenseId}`}
      footer={
        <Stack direction="row" justifyContent="flex-end">
          <Button label="Close" variant="neutral" onClick={onClose} />
        </Stack>
      }
    >
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Field label="Service" value={expense.expenseTypeLabel || expense.expenseName} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Field label="Vendor / Provider" value={expense.vendorStaffPartner ?? '—'} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Field label="Passenger Mapping" value={expense.passengerMapping.displayLabel} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Field label="Amount" value={formatInr(expense.amount)} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Field label="GST" value={expense.gstAmount > 0 ? formatInr(expense.gstAmount) : '—'} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Field label="Total" value={formatInr(expense.netPayableAmount)} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Field label="Paid By" value={getPaidByLabel(expense.paidBy)} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Field label="Bill To" value={getBillToLabel(expense.billTo)} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Field
            label="Proof"
            value={
              expense.proofFileName
                ? `${getProofDocumentTypeLabel(expense.proofDocumentType)} · ${expense.proofFileName} (${expenseProofStatusLabel[expense.proofStatus]})`
                : expenseProofStatusLabel[expense.proofStatus]
            }
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <Field label="Notes" value={expense.remarks ?? expense.internalRemarks ?? '—'} />
        </Grid>
      </Grid>
    </Modal>
  )
}
