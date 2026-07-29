import { Box, Divider, Grid, Stack, Typography } from '@mui/material'
import { Badge, Button, Modal } from '@/design-system/UIComponents'
import type { ApplicationExpenseRecord } from '@/shared/types/applicationExpenseManagement'
import { paymentStatusLabel } from '@/shared/utils/applicationExpenseManagementUtils'
import { formatInr } from '@/shared/utils/invoiceCalculations'
import {
  getBillToLabel,
  getPaidByLabel,
  getProofDocumentTypeLabel,
} from '../../config/expenseDetailFormConfig'
import {
  expenseProofStatusColor,
  expenseProofStatusLabel,
  expenseRollupPaymentColor,
} from '../../config/expenseStatusConfig'

interface ExpenseDetailDrawerProps {
  open: boolean
  expense: ApplicationExpenseRecord | null
  onClose: () => void
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <Stack spacing={0.25} minWidth={0}>
      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, fontSize: 11 }}>
        {label}
      </Typography>
      <Typography variant="body2" sx={{ fontSize: 13, wordBreak: 'break-word' }}>
        {value || '—'}
      </Typography>
    </Stack>
  )
}

export function ExpenseDetailDrawer({ open, expense, onClose }: ExpenseDetailDrawerProps) {
  if (!expense) return null

  const paymentColor =
    expense.paymentStatus === 'paid'
      ? expenseRollupPaymentColor.paid
      : expense.paymentStatus === 'partially_paid'
        ? expenseRollupPaymentColor.partially_paid
        : expense.paymentStatus === 'pending_reimbursement'
          ? expenseRollupPaymentColor.pending_reimbursement
          : expenseRollupPaymentColor.not_paid

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={expense.expenseTypeLabel || expense.expenseName}
      footer={
        <Stack direction="row" justifyContent="flex-end">
          <Button label="Close" variant="neutral" onClick={onClose} />
        </Stack>
      }
    >
      <Stack spacing={2}>
        <Stack direction="row" spacing={0.75} flexWrap="wrap" useFlexGap>
          <Badge label={expense.expenseId} color="neutral" size="sm" />
          <Badge
            label={paymentStatusLabel(expense.paymentStatus)}
            color={paymentColor}
            size="sm"
          />
          <Badge
            label={expenseProofStatusLabel[expense.proofStatus]}
            color={expenseProofStatusColor[expense.proofStatus]}
            size="sm"
          />
        </Stack>

        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Field label="Vendor / provider" value={expense.vendorStaffPartner ?? '—'} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Field label="Source" value={expense.serviceSourceLabel} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Field label="Passenger mapping" value={expense.passengerMapping.displayLabel} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Field label="Paid by" value={getPaidByLabel(expense.paidBy)} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Field label="Bill to" value={getBillToLabel(expense.billTo)} />
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
        </Grid>

        <Divider />

        <Box>
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, fontSize: 11 }}>
            Proof
          </Typography>
          <Typography variant="body2" sx={{ fontSize: 13, mt: 0.5 }}>
            {expense.proofFileName
              ? `${getProofDocumentTypeLabel(expense.proofDocumentType)} · ${expense.proofFileName}`
              : expenseProofStatusLabel[expense.proofStatus]}
          </Typography>
        </Box>

        <Box>
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, fontSize: 11 }}>
            Notes
          </Typography>
          <Typography variant="body2" sx={{ fontSize: 13, mt: 0.5, whiteSpace: 'pre-wrap' }}>
            {expense.remarks ?? expense.internalRemarks ?? '—'}
          </Typography>
        </Box>
      </Stack>
    </Modal>
  )
}
