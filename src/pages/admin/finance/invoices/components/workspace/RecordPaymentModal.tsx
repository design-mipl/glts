import { useCallback } from 'react'
import { Grid, Stack } from '@mui/material'
import { Button, FormField, Input, Modal } from '@/design-system/UIComponents'

export interface RecordPaymentModalValue {
  amount: string
  date: string
  method: string
  reference: string
  tdsAmount: string
  netAmount: string
}

interface RecordPaymentModalProps {
  open: boolean
  onClose: () => void
  value: RecordPaymentModalValue
  onChange: (value: RecordPaymentModalValue) => void
  onSubmit: () => void
  loading?: boolean
  invoiceId?: string
}

function parseAmount(raw: string): number {
  const n = Number.parseFloat(raw.replace(/,/g, ''))
  return Number.isFinite(n) ? n : 0
}

function formatAmountField(amount: number): string {
  if (!Number.isFinite(amount) || amount <= 0) return ''
  const rounded = Math.round(amount * 100) / 100
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(2)
}

function deriveNetAmount(amount: string, tdsAmount: string): string {
  const invoiceAmount = parseAmount(amount)
  const tdsDeduction = parseAmount(tdsAmount)
  return formatAmountField(Math.max(0, Math.round((invoiceAmount - tdsDeduction) * 100) / 100))
}

export function RecordPaymentModal({
  open,
  onClose,
  value,
  onChange,
  onSubmit,
  loading,
  invoiceId,
}: RecordPaymentModalProps) {
  const patch = useCallback(
    (partial: Partial<RecordPaymentModalValue>) => onChange({ ...value, ...partial }),
    [onChange, value],
  )

  const invoiceAmount = parseAmount(value.amount)
  const netAmountReceived = parseAmount(value.netAmount)

  const validInvoiceAmount = invoiceAmount > 0
  const validNetAmount = netAmountReceived > 0
  const canSubmit = validInvoiceAmount && validNetAmount && value.reference.trim().length > 0

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={invoiceId ? `Record payment · ${invoiceId}` : 'Record payment'}
      loading={loading}
      footer={
        <Stack direction="row" spacing={1} justifyContent="flex-end">
          <Button label="Cancel" variant="outlined" onClick={onClose} />
          <Button label="Record payment" onClick={onSubmit} loading={loading} disabled={!canSubmit} />
        </Stack>
      }
    >
      <Stack spacing={2}>
        <Grid container spacing={1.5}>
          <Grid size={{ xs: 12, sm: 4 }}>
            <FormField label="Actual Balance Amount" required>
              <Input
                value={value.amount}
                onChange={amount => patch({ amount, netAmount: deriveNetAmount(amount, value.tdsAmount) })}
                size="sm"
                fullWidth
                placeholder="0.00"
              />
            </FormField>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <FormField label="TDS Deduction Amount" optional>
              <Input
                value={value.tdsAmount}
                onChange={tdsAmount => patch({ tdsAmount, netAmount: deriveNetAmount(value.amount, tdsAmount) })}
                size="sm"
                fullWidth
                placeholder="0.00"
              />
            </FormField>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <FormField label="Net Amount Received" required>
              <Input
                value={value.netAmount}
                onChange={netAmount => patch({ netAmount })}
                size="sm"
                fullWidth
                placeholder="0.00"
              />
            </FormField>
          </Grid>
        </Grid>
        <FormField label="Payment date" required>
          <Input
            value={value.date}
            onChange={v => patch({ date: v })}
            size="sm"
            fullWidth
            placeholder="YYYY-MM-DD"
          />
        </FormField>
        <FormField label="Payment method" required>
          <Input
            value={value.method}
            onChange={v => patch({ method: v })}
            size="sm"
            fullWidth
            placeholder="NEFT, RTGS, UPI, etc."
          />
        </FormField>
        <FormField label="Reference / UTR" required>
          <Input
            value={value.reference}
            onChange={v => patch({ reference: v })}
            size="sm"
            fullWidth
            placeholder="Transaction reference"
          />
        </FormField>
      </Stack>
    </Modal>
  )
}
