import { Box, Stack, Typography } from '@mui/material'
import dayjs from 'dayjs'
import { Badge, EmptyState } from '@/design-system/UIComponents'
import {
  getFundTransferTypeLabel,
  type FundAllocationBatchRow,
} from '@/shared/types/fundAllocation'
import { resolveCardLabel } from '@/shared/utils/cardMasterOptions'
import { formatInr } from '@/shared/utils/invoiceCalculations'
import { customerSegmentDisplayLabel } from '@/pages/admin/finance/fund-allocation/config/fundAllocationStatusConfig'

interface FundUtilizationCardListProps {
  batches: FundAllocationBatchRow[]
  selectedId?: string | null
  onSelect: (batch: FundAllocationBatchRow) => void
}

function formatDisplayDateTime(value: string | undefined): string {
  if (!value?.trim()) return '—'
  const parsed = dayjs(value.trim())
  return parsed.isValid() ? parsed.format('DD MMM YYYY, HH:mm') : value
}

function formatAmount(value: number | undefined): string {
  if (value == null || !Number.isFinite(value) || value <= 0) return '—'
  return formatInr(value)
}

function resolveTransferLabel(batch: FundAllocationBatchRow): string {
  if (batch.fundTransfer?.transferType) {
    if (batch.fundTransfer.transferType === 'card' && batch.fundTransfer.assignedCardId) {
      return `${getFundTransferTypeLabel(batch.fundTransfer.transferType)} · ${resolveCardLabel(batch.fundTransfer.assignedCardId)}`
    }
    return getFundTransferTypeLabel(batch.fundTransfer.transferType)
  }
  return '—'
}

function ActionMeta({
  label,
  value,
  emphasize,
}: {
  label: string
  value: string
  emphasize?: boolean
}) {
  return (
    <Stack spacing={0.2} minWidth={0}>
      <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ fontSize: 11 }}>
        {label}
      </Typography>
      <Typography
        variant="body2"
        noWrap
        sx={{
          fontSize: 13,
          fontWeight: emphasize ? 700 : 500,
          color: 'text.primary',
          lineHeight: 1.35,
        }}
      >
        {value}
      </Typography>
    </Stack>
  )
}

function FundUtilizationCard({
  batch,
  isSelected,
  onSelect,
}: {
  batch: FundAllocationBatchRow
  isSelected: boolean
  onSelect: (batch: FundAllocationBatchRow) => void
}) {
  const services = [
    ...new Set(
      batch.passengers.flatMap(passenger => passenger.selectedServices.map(service => service.serviceName)),
    ),
  ].join(', ')

  return (
    <Box
      onClick={() => onSelect(batch)}
      sx={{
        px: 1.5,
        py: 1.25,
        borderRadius: 1.5,
        border: 1,
        borderColor: isSelected ? 'primary.main' : 'divider',
        bgcolor: isSelected ? 'action.selected' : 'background.paper',
        cursor: 'pointer',
        transition: 'border-color 0.15s, background-color 0.15s',
        '&:hover': {
          borderColor: isSelected ? 'primary.main' : 'action.focus',
          bgcolor: isSelected ? 'action.selected' : 'action.hover',
        },
      }}
    >
      <Stack spacing={1}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1}>
          <Stack spacing={0.25} minWidth={0} flex={1}>
            <Typography variant="subtitle2" fontWeight={700} sx={{ fontSize: 15, lineHeight: 1.3 }}>
              {batch.passengerLabel}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: 11, lineHeight: 1.4 }}>
              {batch.passengerCount} passenger{batch.passengerCount === 1 ? '' : 's'} · {batch.gltsApplicationId}
            </Typography>
          </Stack>
          <Stack
            direction="row"
            spacing={0.5}
            flexWrap="wrap"
            useFlexGap
            justifyContent="flex-end"
            sx={{ flexShrink: 0 }}
          >
            <Badge label="Allocated" color="success" size="sm" />
            <Badge
              label={customerSegmentDisplayLabel(batch.customerSegment)}
              color="info"
              size="sm"
            />
          </Stack>
        </Stack>

        <Typography
          variant="body2"
          noWrap
          sx={{ fontSize: 13, fontWeight: 600, color: 'text.primary', lineHeight: 1.45 }}
        >
          {[batch.country, batch.visaType, batch.jurisdiction, batch.assignedTeam].filter(Boolean).join(' · ')}
        </Typography>

        <Box
          sx={{
            px: 1.25,
            py: 1,
            borderRadius: 1.25,
            bgcolor: 'action.hover',
            border: 1,
            borderColor: 'divider',
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
            gap: 1,
          }}
        >
          <ActionMeta label="Requested total" value={formatAmount(batch.requestedTotal)} />
          <ActionMeta label="Allocated amount" value={formatAmount(batch.allocatedAmount)} emphasize />
          <ActionMeta label="Fund transfer" value={resolveTransferLabel(batch)} />
          <ActionMeta label="Fund holder" value={batch.allocatedTo || batch.assignedUser || '—'} />
          <ActionMeta label="Allocated at" value={formatDisplayDateTime(batch.allocatedAt)} />
        </Box>

        <Typography variant="caption" color="text.secondary" sx={{ fontSize: 11, lineHeight: 1.45 }} noWrap>
          {batch.companyName} · {services || '—'}
        </Typography>
      </Stack>
    </Box>
  )
}

export function FundUtilizationCardList({
  batches,
  selectedId,
  onSelect,
}: FundUtilizationCardListProps) {
  if (batches.length === 0) {
    return (
      <Box sx={{ p: 2 }}>
        <EmptyState
          title="No allocated funds"
          description="Allocated fund releases from Finance Fund Allocation will appear here."
        />
      </Box>
    )
  }

  return (
    <Stack spacing={1.25} sx={{ p: 2 }}>
      {batches.map(batch => (
        <FundUtilizationCard
          key={batch.id}
          batch={batch}
          isSelected={selectedId === batch.id}
          onSelect={onSelect}
        />
      ))}
    </Stack>
  )
}
