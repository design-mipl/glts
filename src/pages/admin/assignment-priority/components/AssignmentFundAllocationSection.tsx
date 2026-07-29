import { useMemo } from 'react'
import { Box, Divider, Stack, Typography } from '@mui/material'
import dayjs from 'dayjs'
import { Badge } from '@/design-system/UIComponents'
import { cardMasterService } from '@/shared/services/cardMasterService'
import { fundAllocationService } from '@/shared/services/fundAllocationService'
import { getFundTransferTypeLabel } from '@/shared/types/fundAllocation'
import type { OperationalPassengerRow } from '@/shared/types/operationalPassengerAssignment'
import { formatInr } from '@/shared/utils/invoiceCalculations'
import {
  assignmentFundDisplayBadgeColor,
  assignmentFundDisplayLabel,
  resolveAssignmentFundDisplayState,
} from '../utils/assignmentFundDisplayUtils'

function formatDisplayDateTime(value: string | undefined): string {
  if (!value?.trim()) return '—'
  const parsed = dayjs(value.trim())
  return parsed.isValid() ? parsed.format('DD MMM YYYY, HH:mm') : value
}

function formatAmount(value: number | undefined): string {
  if (value == null || !Number.isFinite(value) || value <= 0) return '—'
  return formatInr(value)
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

function resolveAllocatedTo(record: OperationalPassengerRow): string {
  if (record.assigneeType === 'vendor') {
    return [record.assignedVendor, record.assignedUser].filter(Boolean).join(' · ')
  }
  if (record.assigneeType === 'passenger') {
    return record.assignedUser ? `Passenger · ${record.assignedUser}` : ''
  }
  return [record.assignedUser, record.assignedTeam].filter(Boolean).join(' · ')
}

interface AssignmentFundAllocationSectionProps {
  record: OperationalPassengerRow
}

export function AssignmentFundAllocationSection({ record }: AssignmentFundAllocationSectionProps) {
  const fundRow = useMemo(() => fundAllocationService.getById(record.id), [record.id])
  const displayState = resolveAssignmentFundDisplayState(fundRow)

  if (displayState === 'none') {
    return (
      <>
        <Divider />
        <Stack spacing={1}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
            <Typography variant="body2" fontWeight={600} sx={{ fontSize: 12, color: 'text.primary' }}>
              Fund allocation
            </Typography>
            <Badge
              label={assignmentFundDisplayLabel(displayState)}
              color={assignmentFundDisplayBadgeColor(displayState)}
              size="sm"
            />
          </Stack>
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: 12 }}>
            No fund request was sent for this passenger. Use assign or reassign with &quot;Request fund
            allocation&quot; when VFS funds are needed.
          </Typography>
        </Stack>
      </>
    )
  }

  if (!fundRow) return null

  const transferLabel = fundRow.fundTransfer?.transferType
    ? getFundTransferTypeLabel(fundRow.fundTransfer.transferType)
    : fundRow.cardId
      ? cardMasterService.getById(fundRow.cardId)?.cardName ?? fundRow.cardId
      : '—'

  return (
    <>
      <Divider />
      <Stack spacing={1.25}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
          <Typography variant="body2" fontWeight={600} sx={{ fontSize: 12, color: 'text.primary' }}>
            Fund allocation
          </Typography>
          <Badge
            label={assignmentFundDisplayLabel(displayState)}
            color={assignmentFundDisplayBadgeColor(displayState)}
            size="sm"
          />
        </Stack>

        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.25 }}>
          <ReadField label="Fund holder (User)" value={fundRow.allocatedTo || resolveAllocatedTo(record)} />
          <ReadField label="Fund transfer" value={transferLabel} />
          <ReadField label="Requested total" value={formatAmount(fundRow.totalAmount)} />
          <ReadField label="Allocated amount" value={formatAmount(fundRow.allocatedAmount)} />
          <ReadField label="Requested at" value={formatDisplayDateTime(fundRow.requestedAt)} />
          <ReadField label="Allocated at" value={formatDisplayDateTime(fundRow.allocatedAt)} />
        </Box>

        {fundRow.selectedServices.length > 0 ? (
          <ReadField
            label="Services"
            value={fundRow.selectedServices.map(line => line.serviceName).join(', ')}
          />
        ) : null}

        {fundRow.allocationNotes.trim() ? (
          <ReadField label="Notes" value={fundRow.allocationNotes} />
        ) : null}
      </Stack>
    </>
  )
}
