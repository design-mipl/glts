import { useCallback } from 'react'
import { Grid, Stack, Typography } from '@mui/material'
import { Button, FormField, Input, Modal } from '@/design-system/UIComponents'
import { formatInr } from '@/shared/utils/invoiceCalculations'

export interface RecordPaymentModalValue {
  amount: string
  date: string
  method: string
  reference: string
  tdsPercentage: string
  tdsAmount: string
}

interface RecordPaymentModalProps {
  open: boolean
  onClose: () => void
  value: RecordPaymentModalValue
  onChange: (value: RecordPaymentModalValue) => void
  onSubmit: () => void
  loading?: boolean
  invoiceId?: string
  balancePayable?: number
  defaultTdsPercentage?: number
  tdsApplicable?: boolean
}

function parseAmount(raw: string): number {
  const n = Number.parseFloat(raw.replace(/,/g, ''))
  return Number.isFinite(n) ? n : 0
}

function formatTdsAmount(amount: number): string {
  if (!Number.isFinite(amount) || amount <= 0) return ''
  const rounded = Math.round(amount * 100) / 100
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(2)
}

function calcTdsFromPercentage(gross: number, percentage: number): number {
  if (gross <= 0 || percentage <= 0) return 0
  return Math.round(((gross * percentage) / 100) * 100) / 100
}

export function RecordPaymentModal({
  open,
  onClose,
  value,
  onChange,
  onSubmit,
  loading,
  invoiceId,
  balancePayable = 0,
  defaultTdsPercentage = 0,
  tdsApplicable = false,
}: RecordPaymentModalProps) {
  const patch = useCallback(
    (partial: Partial<RecordPaymentModalValue>) => onChange({ ...value, ...partial }),
    [onChange, value],
  )

  const amountNum = parseAmount(value.amount)
  const validAmount = amountNum > 0
  const canSubmit = validAmount && value.reference.trim().length > 0

  const applyTdsFromPercentage = useCallback(
    (amountRaw: string, percentageRaw: string) => {
      const gross = parseAmount(amountRaw)
      const pct = parseAmount(percentageRaw)
      return formatTdsAmount(calcTdsFromPercentage(gross, pct))
    },
    [],
  )

  const handleAmountChange = (amount: string) => {
    const tdsAmount = applyTdsFromPercentage(amount, value.tdsPercentage)
    patch({ amount, tdsAmount })
  }

  const handleTdsPercentageChange = (tdsPercentage: string) => {
    const tdsAmount = applyTdsFromPercentage(value.amount, tdsPercentage)
    patch({ tdsPercentage, tdsAmount })
  }

  const handleTdsAmountChange = (tdsAmount: string) => {
    const gross = parseAmount(value.amount)
    const tds = parseAmount(tdsAmount)
    if (gross > 0 && tds > 0) {
      const pct = Math.round((tds / gross) * 10000) / 100
      patch({ tdsAmount, tdsPercentage: String(pct) })
      return
    }
    patch({ tdsAmount })
  }

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
        {balancePayable > 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13 }}>
            Outstanding balance: <strong>{formatInr(balancePayable)}</strong>
            {tdsApplicable && defaultTdsPercentage > 0 ? (
              <>
                {' '}
                · Invoice TDS: <strong>{defaultTdsPercentage}%</strong>
              </>
            ) : null}
          </Typography>
        ) : null}
        <FormField label="Payment amount (INR)" required>
          <Input
            value={value.amount}
            onChange={handleAmountChange}
            size="sm"
            fullWidth
            placeholder="0.00"
          />
        </FormField>
        <Grid container spacing={1.5}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormField label="TDS percentage (%)" optional>
              <Input
                value={value.tdsPercentage}
                onChange={handleTdsPercentageChange}
                size="sm"
                fullWidth
                placeholder={tdsApplicable ? String(defaultTdsPercentage) : '0'}
              />
            </FormField>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormField label="TDS value (INR)" optional>
              <Input
                value={value.tdsAmount}
                onChange={handleTdsAmountChange}
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
