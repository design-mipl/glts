import { useCallback } from 'react'
import { Grid, Stack } from '@mui/material'
import { Button, DatePicker, FormField, Input, Modal, Select } from '@/design-system/UIComponents'

export interface VendorRecordPaymentModalValue {
  payableAmount: string
  tdsAmount: string
  netPaidAmount: string
  paymentDate: string
  paymentMode: string
  transactionReference: string
}

interface VendorRecordPaymentModalProps {
  open: boolean
  onClose: () => void
  value: VendorRecordPaymentModalValue
  onChange: (value: VendorRecordPaymentModalValue) => void
  onSubmit: () => void
  loading?: boolean
  vendorInvoiceNumber?: string
}

const VENDOR_PAYMENT_MODE_OPTIONS = [
  { value: 'NEFT', label: 'NEFT' },
  { value: 'RTGS', label: 'RTGS' },
  { value: 'IMPS', label: 'IMPS' },
  { value: 'UPI', label: 'UPI' },
  { value: 'Cheque', label: 'Cheque' },
  { value: 'Cash', label: 'Cash' },
  { value: 'Other', label: 'Other' },
]

function parseAmount(raw: string): number {
  const n = Number.parseFloat(raw.replace(/,/g, ''))
  return Number.isFinite(n) ? n : 0
}

function formatAmountField(amount: number): string {
  if (!Number.isFinite(amount) || amount <= 0) return ''
  const rounded = Math.round(amount * 100) / 100
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(2)
}

function deriveNetPaidAmount(payableAmount: string, tdsAmount: string): string {
  const payable = parseAmount(payableAmount)
  const tds = parseAmount(tdsAmount)
  return formatAmountField(Math.max(0, Math.round((payable - tds) * 100) / 100))
}

function parseDateString(value: string | undefined): Date | null {
  if (!value?.trim()) return null
  const parsed = new Date(value)
  return Number.isNaN(parsed.getTime()) ? null : parsed
}

function formatDateForStorage(date: Date | null): string {
  if (!date) return ''
  return date.toISOString().slice(0, 10)
}

export function VendorRecordPaymentModal({
  open,
  onClose,
  value,
  onChange,
  onSubmit,
  loading,
  vendorInvoiceNumber,
}: VendorRecordPaymentModalProps) {
  const patch = useCallback(
    (partial: Partial<VendorRecordPaymentModalValue>) => onChange({ ...value, ...partial }),
    [onChange, value],
  )

  const validPayableAmount = parseAmount(value.payableAmount) > 0
  const validNetPaidAmount = parseAmount(value.netPaidAmount) > 0
  const canSubmit =
    validPayableAmount &&
    validNetPaidAmount &&
    value.paymentDate.trim().length > 0 &&
    value.paymentMode.trim().length > 0 &&
    value.transactionReference.trim().length > 0

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={vendorInvoiceNumber ? `Record vendor payment · ${vendorInvoiceNumber}` : 'Record vendor payment'}
      loading={loading}
      footer={
        <Stack direction="row" spacing={1} justifyContent="flex-end">
          <Button label="Cancel" variant="neutral" onClick={onClose} />
          <Button label="Record payment" onClick={onSubmit} loading={loading} disabled={!canSubmit} />
        </Stack>
      }
    >
      <Stack spacing={2}>
        <Grid container spacing={1.5}>
          <Grid size={{ xs: 12, sm: 4 }}>
            <FormField label="Payable Amount" required>
              <Input
                value={value.payableAmount}
                onChange={payableAmount =>
                  patch({
                    payableAmount,
                    netPaidAmount: deriveNetPaidAmount(payableAmount, value.tdsAmount),
                  })
                }
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
                onChange={tdsAmount =>
                  patch({
                    tdsAmount,
                    netPaidAmount: deriveNetPaidAmount(value.payableAmount, tdsAmount),
                  })
                }
                size="sm"
                fullWidth
                placeholder="0.00"
              />
            </FormField>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <FormField label="Net Paid Amount" required>
              <Input
                value={value.netPaidAmount}
                onChange={netPaidAmount => patch({ netPaidAmount })}
                size="sm"
                fullWidth
                placeholder="0.00"
              />
            </FormField>
          </Grid>
        </Grid>
        <FormField label="Payment date" required>
          <DatePicker
            value={parseDateString(value.paymentDate)}
            onChange={date => patch({ paymentDate: formatDateForStorage(date) })}
            placeholder="Select payment date"
            size="sm"
            fullWidth
            disableFuture
          />
        </FormField>
        <FormField label="Payment mode" required>
          <Select
            value={value.paymentMode}
            onChange={paymentMode => patch({ paymentMode: String(paymentMode) })}
            options={VENDOR_PAYMENT_MODE_OPTIONS}
            size="sm"
            fullWidth
            placeholder="Select payment mode"
          />
        </FormField>
        <FormField label="UTR / Transaction reference" required>
          <Input
            value={value.transactionReference}
            onChange={transactionReference => patch({ transactionReference })}
            size="sm"
            fullWidth
            placeholder="Transaction reference"
          />
        </FormField>
      </Stack>
    </Modal>
  )
}
