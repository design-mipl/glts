import { Box, Stack, Typography } from '@mui/material'
import type { ReactNode } from 'react'
import { Button, FormField, Input } from '@/design-system/UIComponents'
import type { FundAllocationPassengerRow } from '@/shared/types/fundAllocation'
import { formatInr } from '@/shared/utils/invoiceCalculations'
import { vfsServicePickerEmptyStateSx, vfsServicePickerLayout } from '@/shared/utils/vfsServicePickerLayout'

export function AllocateContextLine({ label, value }: { label: string; value: string }) {
  return (
    <Stack spacing={0.2} minWidth={0}>
      <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ fontSize: 11 }}>
        {label}
      </Typography>
      <Typography variant="body2" sx={{ fontSize: 13, fontWeight: 600, lineHeight: 1.35 }} noWrap>
        {value || '—'}
      </Typography>
    </Stack>
  )
}

export function AllocateContextGrid({
  items,
}: {
  items: Array<{ label: string; value: string }>
}) {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
        columnGap: 2,
        rowGap: 1.25,
        p: 1.25,
        border: 1,
        borderColor: 'divider',
        borderRadius: 1.5,
        bgcolor: 'background.paper',
      }}
    >
      {items.map(item => (
        <AllocateContextLine key={item.label} label={item.label} value={item.value} />
      ))}
    </Box>
  )
}

function formatPassengerApplicationRef(record: FundAllocationPassengerRow): string {
  const parts = [record.gltsApplicationId]
  if (record.gltsApplicantId?.trim()) {
    parts.push(record.gltsApplicantId.trim())
  } else if (record.sequenceNo > 0) {
    parts.push(`Seq ${record.sequenceNo}`)
  }
  return parts.join(' · ')
}

function formatRequestedServiceNames(record: FundAllocationPassengerRow): string {
  return record.selectedServices.map(service => service.serviceName).join(', ') || '—'
}

export function RequestedPassengerSummaryCard({ record }: { record: FundAllocationPassengerRow }) {
  const passport = record.passportNo?.trim() || '—'
  const serviceNames = formatRequestedServiceNames(record)

  return (
    <Box
      sx={{
        border: 1,
        borderColor: 'divider',
        borderRadius: 1.5,
        px: 1.5,
        py: 1.25,
        bgcolor: 'background.paper',
      }}
    >
      <Stack spacing={0.5}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1}>
          <Typography
            variant="body2"
            sx={{ fontSize: 13, fontWeight: 600, lineHeight: 1.35, minWidth: 0 }}
            noWrap
          >
            {record.passengerName}
            <Box component="span" sx={{ color: 'text.secondary', fontWeight: 500 }}>
              {` · ${passport}`}
            </Box>
          </Typography>
          <Typography
            variant="body2"
            sx={{ fontSize: 13, fontWeight: 600, flexShrink: 0, fontVariantNumeric: 'tabular-nums' }}
          >
            {record.totalAmount > 0 ? formatInr(record.totalAmount) : '—'}
          </Typography>
        </Stack>

        <Typography variant="body2" color="text.secondary" sx={{ fontSize: 12, lineHeight: 1.35 }} noWrap>
          {formatPassengerApplicationRef(record)}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ fontSize: 12, lineHeight: 1.4, wordBreak: 'break-word' }}
        >
          {serviceNames}
        </Typography>
      </Stack>
    </Box>
  )
}

interface RequestedServicesSectionProps {
  serviceCount: number
  emptyMessage: string
  children: ReactNode
}

export function RequestedServicesSection({
  serviceCount,
  emptyMessage,
  children,
}: RequestedServicesSectionProps) {
  return (
    <>
      <Stack spacing={1}>
        <Typography variant="body2" fontWeight={600} sx={{ fontSize: vfsServicePickerLayout.bodyFontSize }}>
          Requested funds
        </Typography>
      </Stack>

      {serviceCount === 0 ? (
        <Box sx={vfsServicePickerEmptyStateSx}>
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: vfsServicePickerLayout.bodyFontSize }}>
            {emptyMessage}
          </Typography>
        </Box>
      ) : (
        <Stack spacing={1}>{children}</Stack>
      )}
    </>
  )
}

interface AllocateFundsFormFieldsProps {
  requestedTotal: number
  allocatedAmount: string
  onAllocatedAmountChange: (value: string) => void
}

export function AllocateFundsFormFields({
  requestedTotal,
  allocatedAmount,
  onAllocatedAmountChange,
}: AllocateFundsFormFieldsProps) {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
        columnGap: 1.5,
        rowGap: 1.5,
        alignItems: 'start',
      }}
    >
      <FormField label="Requested total">
        <Input value={requestedTotal > 0 ? formatInr(requestedTotal) : '—'} disabled size="sm" fullWidth />
      </FormField>
      <FormField label="Allocated fund value" required>
        <Input
          value={allocatedAmount}
          onChange={value => onAllocatedAmountChange(value.replace(/[^\d.]/g, ''))}
          placeholder="Enter allocated fund value"
          size="sm"
          fullWidth
        />
      </FormField>
    </Box>
  )
}

interface AllocateFundsTwoPanelLayoutProps {
  contextItems: Array<{ label: string; value: string }>
  leftPanel: ReactNode
  rightPanel: ReactNode
}

export function AllocateFundsTwoPanelLayout({
  contextItems,
  leftPanel,
  rightPanel,
}: AllocateFundsTwoPanelLayoutProps) {
  return (
    <Stack spacing={2} sx={{ pt: 0.5 }}>
      <AllocateContextGrid items={contextItems} />

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 1fr) minmax(0, 1.15fr)' },
          gap: 2,
          alignItems: 'stretch',
          minHeight: { md: 360 },
        }}
      >
        <Box
          sx={{
            p: 1.5,
            minHeight: 0,
            maxHeight: { xs: 280, md: 480 },
            overflow: 'auto',
            border: 1,
            borderColor: 'divider',
            borderRadius: 1.5,
            bgcolor: 'background.paper',
          }}
        >
          {leftPanel}
        </Box>
        <Box
          sx={{
            p: 1.5,
            minHeight: 0,
            maxHeight: { md: 480 },
            overflow: 'auto',
            border: 1,
            borderColor: 'divider',
            borderRadius: 1.5,
            bgcolor: 'background.paper',
          }}
        >
          {rightPanel}
        </Box>
      </Box>
    </Stack>
  )
}

interface AllocateFundsModalFooterProps {
  requestedTotal: number
  allocatedAmount: string
  onCancel: () => void
  onConfirm: () => void
  canSubmit: boolean
}

function formatFooterAmount(value: string): string {
  const parsed = Number(value)
  if (!value.trim() || !Number.isFinite(parsed) || parsed <= 0) return '—'
  return formatInr(parsed)
}

export function AllocateFundsModalFooter({
  requestedTotal,
  allocatedAmount,
  onCancel,
  onConfirm,
  canSubmit,
}: AllocateFundsModalFooterProps) {
  return (
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      alignItems={{ xs: 'stretch', sm: 'center' }}
      justifyContent="space-between"
      spacing={1.5}
      sx={{ width: '100%' }}
    >
      <Stack spacing={0.25}>
        <Typography variant="body2" color="text.secondary" sx={{ fontSize: vfsServicePickerLayout.bodyFontSize }}>
          Requested total: {requestedTotal > 0 ? formatInr(requestedTotal) : '—'}
        </Typography>
        <Typography variant="body2" fontWeight={600} sx={{ fontSize: vfsServicePickerLayout.bodyFontSize }}>
          Allocated total: {formatFooterAmount(allocatedAmount)}
        </Typography>
      </Stack>
      <Stack direction="row" spacing={1} justifyContent="flex-end">
        <Button label="Cancel" variant="neutral" onClick={onCancel} />
        <Button label="Allocate funds" onClick={onConfirm} disabled={!canSubmit} />
      </Stack>
    </Stack>
  )
}
