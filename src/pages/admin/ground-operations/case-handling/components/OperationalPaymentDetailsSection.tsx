import { useEffect, useMemo, useState } from 'react'
import { Box, Stack, Typography } from '@mui/material'
import dayjs from 'dayjs'
import { DatePicker, FormField, Input, Select } from '@/design-system/UIComponents'
import { cardMasterService } from '@/shared/services/cardMasterService'
import { operationalCaseHandlingService } from '@/shared/services/operationalCaseHandlingService'
import type {
  GroundServiceLine,
  OperationalCase,
  OperationalPaymentMode,
} from '@/shared/types/operationalCaseHandling'
import {
  getOperationalPaymentModeLabel,
  OPERATIONAL_PAYMENT_MODE_OPTIONS,
} from '@/shared/types/operationalCaseHandling'
import {
  findSubmissionPaidCharge,
  resolveOperationalCaseSubmissionSnapshot,
  type OperationalCaseSubmissionSnapshot,
} from '@/shared/utils/operationalCaseSubmissionUtils'

function parseDateString(value: string | undefined): Date | null {
  if (!value?.trim()) return null
  const parsed = dayjs(value.trim(), ['YYYY-MM-DD', 'DD/MM/YYYY'], true)
  return parsed.isValid() ? parsed.toDate() : null
}

function formatDateForStorage(date: Date | null): string {
  if (!date) return ''
  return dayjs(date).format('YYYY-MM-DD')
}

function formatDisplayDate(value: string | undefined): string {
  if (!value?.trim()) return '—'
  const parsed = dayjs(value.trim(), ['YYYY-MM-DD', 'DD/MM/YYYY'], true)
  return parsed.isValid() ? parsed.format('DD MMM YYYY') : value
}

function formatDisplayAmount(value: string | undefined): string {
  if (!value?.trim()) return '—'
  const amount = Number.parseFloat(value.replace(/,/g, ''))
  if (!Number.isFinite(amount)) return value
  return `₹${amount.toLocaleString('en-IN')}`
}

/** Sum of selected on-site + GLTS ops fees that are not already paid at submission. */
export function getSelectedApplicationFeesTotal(
  fees: GroundServiceLine[],
  snapshot: OperationalCaseSubmissionSnapshot | null = null,
  gltsOpsFees: GroundServiceLine[] = [],
): number {
  const onSite = fees
    .filter(fee => fee.selected && !findSubmissionPaidCharge(fee.serviceName, snapshot))
    .reduce((sum, fee) => sum + (fee.actualAmount || fee.prefilledAmount), 0)
  const glts = gltsOpsFees
    .filter(fee => fee.selected)
    .reduce((sum, fee) => sum + (fee.actualAmount || fee.prefilledAmount), 0)
  return onSite + glts
}

function formatAmountField(amount: number): string {
  if (!Number.isFinite(amount) || amount <= 0) return ''
  const rounded = Math.round(amount * 100) / 100
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(2)
}

function ReadField({ label, value }: { label: string; value: string }) {
  return (
    <Stack spacing={0.2}>
      <Typography variant="caption" color="text.secondary" fontWeight={600}>
        {label}
      </Typography>
      <Typography variant="body2" sx={{ fontSize: 12 }}>
        {value || '—'}
      </Typography>
    </Stack>
  )
}

interface OperationalPaymentDetailsSectionProps {
  record: OperationalCase
  readOnly?: boolean
  onUpdated: () => void
}

export function OperationalPaymentDetailsSection({
  record,
  readOnly = false,
  onUpdated,
}: OperationalPaymentDetailsSectionProps) {
  const submissionSnapshot = useMemo(
    () => resolveOperationalCaseSubmissionSnapshot(record),
    [record],
  )

  const autoAmountPaid = useMemo(
    () =>
      formatAmountField(
        getSelectedApplicationFeesTotal(
          record.applicationFees,
          submissionSnapshot,
          record.gltsOpsFees ?? [],
        ),
      ),
    [record.applicationFees, record.gltsOpsFees, submissionSnapshot],
  )

  const [paymentDate, setPaymentDate] = useState(record.paymentDate ?? '')
  const [paymentMode, setPaymentMode] = useState<OperationalPaymentMode | ''>(
    record.paymentMode ?? '',
  )
  const [paymentCardId, setPaymentCardId] = useState(record.paymentCardId ?? '')
  const [transactionReference, setTransactionReference] = useState(
    record.transactionReference ?? '',
  )

  const cardOptions = useMemo(
    () =>
      cardMasterService.list().map(card => ({
        value: card.id,
        label: card.cardName,
      })),
    [],
  )

  const selectedCardLabel = useMemo(() => {
    if (!record.paymentCardId) return '—'
    return (
      cardMasterService.getById(record.paymentCardId)?.cardName ??
      record.paymentCardId
    )
  }, [record.paymentCardId])

  const showCardField = paymentMode === 'card'

  useEffect(() => {
    setPaymentDate(record.paymentDate ?? '')
    setPaymentMode(record.paymentMode ?? '')
    setPaymentCardId(record.paymentCardId ?? '')
    setTransactionReference(record.transactionReference ?? '')
  }, [
    record.id,
    record.paymentDate,
    record.paymentMode,
    record.paymentCardId,
    record.transactionReference,
  ])

  const persist = (patch: {
    paymentDate?: string
    paymentMode?: OperationalPaymentMode
    paymentCardId?: string
    transactionReference?: string
  }) => {
    operationalCaseHandlingService.updatePaymentDetails(record.id, patch)
    onUpdated()
  }

  if (readOnly) {
    return (
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.25 }}>
        <ReadField label="Payment Date" value={formatDisplayDate(record.paymentDate)} />
        <ReadField
          label="Payment Mode"
          value={getOperationalPaymentModeLabel(record.paymentMode)}
        />
        {record.paymentMode === 'card' ? (
          <ReadField label="Card" value={selectedCardLabel} />
        ) : null}
        <ReadField label="Amount Paid" value={formatDisplayAmount(autoAmountPaid)} />
        <ReadField label="Transaction Reference" value={record.transactionReference?.trim() || '—'} />
      </Box>
    )
  }

  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.25 }}>
      <FormField label="Payment Date">
        <DatePicker
          value={parseDateString(paymentDate)}
          onChange={date => {
            const next = formatDateForStorage(date)
            setPaymentDate(next)
            persist({ paymentDate: next })
          }}
          placeholder="Select payment date"
          size="sm"
          fullWidth
        />
      </FormField>
      <FormField label="Payment Mode">
        <Select
          value={paymentMode}
          onChange={value => {
            const next = String(value) as OperationalPaymentMode
            setPaymentMode(next)
            if (next !== 'card') {
              setPaymentCardId('')
            }
            persist({ paymentMode: next })
          }}
          options={OPERATIONAL_PAYMENT_MODE_OPTIONS}
          placeholder="Select payment mode"
          size="sm"
          fullWidth
        />
      </FormField>
      {showCardField ? (
        <FormField label="Card">
          <Select
            value={paymentCardId}
            onChange={value => {
              const next = String(value)
              setPaymentCardId(next)
              persist({ paymentCardId: next })
            }}
            options={cardOptions}
            placeholder="Select card"
            size="sm"
            fullWidth
            clearable
          />
        </FormField>
      ) : null}
      <FormField label="Amount Paid" helperText="Auto-filled from selected on-site fees">
        <Input
          type="number"
          value={autoAmountPaid}
          disabled
          placeholder="0.00"
          size="sm"
          fullWidth
        />
      </FormField>
      <FormField label="Transaction Reference">
        <Input
          value={transactionReference}
          onChange={value => {
            const next = String(value)
            setTransactionReference(next)
            persist({ transactionReference: next })
          }}
          placeholder="e.g. UTR / TXN reference"
          size="sm"
          fullWidth
        />
      </FormField>
    </Box>
  )
}
