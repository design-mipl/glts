import { Box, Divider, Grid, Stack, Typography } from '@mui/material'
import { Badge, Button, Modal } from '@/design-system/UIComponents'
import type { ApplicationExpenseRecord } from '@/shared/types/applicationExpenseManagement'
import { formatInr } from '@/shared/utils/invoiceCalculations'
import {
  computeExpenseIwAmount,
  getBillToLabel,
  getExpenseInvoiceStatusLabel,
  getExpensePaymentModeLabel,
  getPaidByLabel,
  getProofDocumentTypeLabel,
  resolveExpenseCostAmount,
  resolveExpenseInvoiceStatus,
} from '../../config/expenseDetailFormConfig'
import {
  expenseInvoiceStatusColor,
  expenseProofStatusColor,
  expenseProofStatusLabel,
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

  const cost = resolveExpenseCostAmount(expense)
  const total = expense.amount
  const iw = computeExpenseIwAmount(cost, total)
  const invoiceStatus = resolveExpenseInvoiceStatus(expense)

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
            label={getExpenseInvoiceStatusLabel(invoiceStatus)}
            color={expenseInvoiceStatusColor[invoiceStatus]}
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
            <Field label="Bill to" value={getBillToLabel(expense.billTo)} />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Field label="Cost" value={formatInr(cost)} />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Field label="IW" value={formatInr(iw)} />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Field label="Total amount" value={formatInr(total)} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Field label="GST" value={expense.gstAmount > 0 ? formatInr(expense.gstAmount) : '—'} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Field label="Payable" value={formatInr(expense.netPayableAmount)} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Field label="User name" value={expense.paidByUser?.trim() || '—'} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Field label="Department" value={expense.paidByDepartment?.trim() || '—'} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Field label="Team" value={expense.paidByTeam?.trim() || '—'} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Field label="Paid by type" value={getPaidByLabel(expense.paidBy)} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Field label="Payment mode" value={getExpensePaymentModeLabel(expense.paymentMode)} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Field label="Invoice" value={getExpenseInvoiceStatusLabel(invoiceStatus)} />
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
