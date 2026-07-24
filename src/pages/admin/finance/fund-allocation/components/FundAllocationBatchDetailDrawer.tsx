import { Box, Divider, Stack, Typography } from '@mui/material'
import dayjs from 'dayjs'
import { Drawer, Badge } from '@/design-system/UIComponents'
import {
  getFundTransferTypeLabel,
  type FundAllocationBatchRow,
  type FundAllocationPassengerRow,
} from '@/shared/types/fundAllocation'
import { resolveCardLabel } from '@/shared/utils/cardMasterOptions'
import { formatInr } from '@/shared/utils/invoiceCalculations'
import {
  customerSegmentDisplayLabel,
  fundAllocationStatusBadgeColor,
  fundAllocationStatusLabel,
} from '../config/fundAllocationStatusConfig'

const DETAIL_DRAWER_WIDTH = 560

function formatDisplayDateTime(value: string | undefined): string {
  if (!value?.trim()) return '—'
  const parsed = dayjs(value.trim())
  return parsed.isValid() ? parsed.format('DD MMM YYYY, HH:mm') : value
}

function MetaItem({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <Stack spacing={0.25} minWidth={0}>
      <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ fontSize: 11 }}>
        {label}
      </Typography>
      <Typography
        variant="body2"
        sx={{
          fontSize: 13,
          fontWeight: 500,
          lineHeight: 1.35,
          wordBreak: 'break-word',
          fontVariantNumeric: mono ? 'tabular-nums' : undefined,
        }}
      >
        {value?.trim() ? value : '—'}
      </Typography>
    </Stack>
  )
}

function PassengerAllocationRow({ passenger }: { passenger: FundAllocationPassengerRow }) {
  return (
    <Box
      sx={{
        px: 1.25,
        py: 1,
        borderRadius: 1.25,
        border: 1,
        borderColor: 'divider',
        bgcolor: 'background.paper',
      }}
    >
      <Stack spacing={0.75}>
        <Stack direction="row" justifyContent="space-between" spacing={1} alignItems="flex-start">
          <Box minWidth={0}>
            <Typography variant="body2" fontWeight={600} sx={{ fontSize: 13 }}>
              {passenger.passengerName}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: 11 }}>
              {passenger.gltsApplicantId} · {passenger.passportNo || '—'}
            </Typography>
          </Box>
          <Badge label="Allocated" color="success" size="sm" />
        </Stack>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
            gap: 1,
          }}
        >
          <MetaItem
            label="Requested total"
            value={passenger.totalAmount > 0 ? formatInr(passenger.totalAmount) : '—'}
            mono
          />
          <MetaItem
            label="Allocated fund value"
            value={passenger.allocatedAmount > 0 ? formatInr(passenger.allocatedAmount) : '—'}
            mono
          />
        </Box>
      </Stack>
    </Box>
  )
}

interface FundAllocationBatchDetailDrawerProps {
  open: boolean
  record: FundAllocationBatchRow | null
  onClose: () => void
}

export function FundAllocationBatchDetailDrawer({
  open,
  record,
  onClose,
}: FundAllocationBatchDetailDrawerProps) {
  if (!record) {
    return (
      <Drawer open={open} onClose={onClose} title="Fund allocation" width={DETAIL_DRAWER_WIDTH}>
        <Typography variant="body2" color="text.secondary">
          Select an allocation row to view details.
        </Typography>
      </Drawer>
    )
  }

  const transferLabel = record.fundTransfer?.transferType
    ? record.fundTransfer.transferType === 'card' && record.fundTransfer.assignedCardId
      ? `${getFundTransferTypeLabel(record.fundTransfer.transferType)} · ${resolveCardLabel(record.fundTransfer.assignedCardId)}`
      : getFundTransferTypeLabel(record.fundTransfer.transferType)
    : '—'

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title={record.passengerCount === 1 ? record.passengerLabel : `Allocation · ${record.passengerCount} passengers`}
      subtitle={`${record.gltsApplicationId} · ${record.country} · ${record.visaType}`}
      headerExtra={
        <>
          <Badge
            label={fundAllocationStatusLabel('allocated')}
            color={fundAllocationStatusBadgeColor('allocated')}
            size="sm"
          />
          <Badge
            label={customerSegmentDisplayLabel(record.customerSegment)}
            color="info"
            size="sm"
          />
        </>
      }
      width={DETAIL_DRAWER_WIDTH}
      bodyVariant="paper"
    >
      <Stack spacing={2}>
        <Box
          sx={{
            px: 1.75,
            py: 1.5,
            border: 1,
            borderColor: 'divider',
            borderRadius: 1.5,
            bgcolor: 'action.hover',
          }}
        >
          <Stack spacing={1.25}>
            <Typography variant="body2" fontWeight={600} sx={{ fontSize: 12 }}>
              Allocation summary
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
              <MetaItem
                label="Requested total"
                value={record.requestedTotal > 0 ? formatInr(record.requestedTotal) : '—'}
                mono
              />
              <MetaItem
                label="Allocated fund value"
                value={record.allocatedAmount > 0 ? formatInr(record.allocatedAmount) : '—'}
                mono
              />
              <MetaItem label="Fund transfer" value={transferLabel} />
              <MetaItem label="Allocated at" value={formatDisplayDateTime(record.allocatedAt)} />
              <MetaItem label="Allocated by" value={record.allocatedBy} />
              <MetaItem label="Allocated to" value={record.allocatedTo} />
              <Box sx={{ gridColumn: '1 / -1' }}>
                <MetaItem label="Allocation notes" value={record.allocationNotes} />
              </Box>
            </Box>
          </Stack>
        </Box>

        <Divider />

        <Stack spacing={1.25}>
          <Typography variant="body2" fontWeight={600} sx={{ fontSize: 12 }}>
            Passengers in this allocation
          </Typography>
          <Stack spacing={1}>
            {record.passengers.map(passenger => (
              <PassengerAllocationRow key={passenger.id} passenger={passenger} />
            ))}
          </Stack>
        </Stack>
      </Stack>
    </Drawer>
  )
}
