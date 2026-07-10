import { useEffect, useMemo, useState } from 'react'
import { Box, Stack, Typography } from '@mui/material'
import dayjs from 'dayjs'
import { DatePicker, FormField, Select } from '@/design-system/UIComponents'
import { creditCardMasterService } from '@/shared/services/creditCardMasterService'
import { operationalCaseHandlingService } from '@/shared/services/operationalCaseHandlingService'
import type {
  OperationalCase,
  OperationalPaymentMode,
} from '@/shared/types/operationalCaseHandling'
import {
  getOperationalPaymentModeLabel,
  OPERATIONAL_PAYMENT_MODE_OPTIONS,
} from '@/shared/types/operationalCaseHandling'

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
  const [paymentDate, setPaymentDate] = useState(record.paymentDate ?? '')
  const [paymentMode, setPaymentMode] = useState<OperationalPaymentMode | ''>(
    record.paymentMode ?? '',
  )
  const [paymentCardId, setPaymentCardId] = useState(record.paymentCardId ?? '')

  const cardOptions = useMemo(
    () =>
      creditCardMasterService.list().map(card => ({
        value: card.id,
        label: card.cardName,
      })),
    [],
  )

  const selectedCardLabel = useMemo(() => {
    if (!record.paymentCardId) return '—'
    return (
      creditCardMasterService.getById(record.paymentCardId)?.cardName ??
      record.paymentCardId
    )
  }, [record.paymentCardId])

  const showCardField = paymentMode === 'card'

  useEffect(() => {
    setPaymentDate(record.paymentDate ?? '')
    setPaymentMode(record.paymentMode ?? '')
    setPaymentCardId(record.paymentCardId ?? '')
  }, [record.id, record.paymentDate, record.paymentMode, record.paymentCardId])

  const persist = (patch: {
    paymentDate?: string
    paymentMode?: OperationalPaymentMode
    paymentCardId?: string
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
    </Box>
  )
}
