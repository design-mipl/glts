import { useMemo } from 'react'
import { Box, Divider, Stack, Typography } from '@mui/material'
import dayjs from 'dayjs'
import { Badge } from '@/design-system/UIComponents'
import { buildPassengerId } from '@/pages/admin/assignment-priority/utils/deriveOperationalPassengerRows'
import { cardMasterService } from '@/shared/services/cardMasterService'
import { fundAllocationService } from '@/shared/services/fundAllocationService'
import { getFundTransferTypeLabel } from '@/shared/types/fundAllocation'
import type { OperationalCase, OperationalCaseFundAllocation } from '@/shared/types/operationalCaseHandling'
import { formatInr } from '@/shared/utils/invoiceCalculations'
import { resolveOperationalCaseAssignmentFields } from '../utils/operationalCaseHandlingUtils'

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

function resolveFundSnapshot(record: OperationalCase): OperationalCaseFundAllocation | null {
  if (record.fundAllocation) {
    return record.fundAllocation
  }

  const passengerId = buildPassengerId(record.applicationId, record.gltsApplicantId)
  const fundRow =
    fundAllocationService.listByApplicationId(record.applicationId).find(
      row => row.id === passengerId || row.gltsApplicantId === record.gltsApplicantId,
    ) ?? null

  if (!fundRow) return null
  if (!fundRow.fundRequested && fundRow.allocationStatus !== 'allocated') return null

  const assignment = resolveOperationalCaseAssignmentFields(record)
  const fundTransferLabel = fundRow.fundTransfer?.transferType
    ? getFundTransferTypeLabel(fundRow.fundTransfer.transferType)
    : fundRow.cardId
      ? cardMasterService.getById(fundRow.cardId)?.cardName ?? fundRow.cardId
      : undefined

  return {
    status: fundRow.allocationStatus,
    fundRequested: fundRow.fundRequested,
    totalAmount: fundRow.totalAmount,
    allocatedAmount: fundRow.allocatedAmount,
    cardId: fundRow.cardId,
    fundTransferLabel,
    serviceNames: fundRow.selectedServices.map(line => line.serviceName),
    requestedAt: fundRow.requestedAt,
    allocatedAt: fundRow.allocatedAt,
    notes: fundRow.allocationNotes,
    allocatedTo: fundRow.allocatedTo || assignment.allocatedTo,
  }
}

interface OperationalFundAllocationSectionProps {
  record: OperationalCase
}

export function OperationalFundAllocationSection({ record }: OperationalFundAllocationSectionProps) {
  const snapshot = useMemo(() => resolveFundSnapshot(record), [record])

  if (!snapshot) return null

  const transferLabel =
    snapshot.fundTransferLabel ||
    (snapshot.cardId
      ? cardMasterService.getById(snapshot.cardId)?.cardName ?? snapshot.cardId
      : '—')

  const statusLabel =
    snapshot.status === 'allocated' ? 'Allocated' : 'Pending allocation'
  const statusColor = snapshot.status === 'allocated' ? 'success' : 'warning'

  return (
    <>
      <Divider />
      <Stack spacing={1.25}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
          <Typography variant="body2" fontWeight={600} sx={{ fontSize: 12, color: 'text.primary' }}>
            Fund allocation
          </Typography>
          <Badge label={statusLabel} color={statusColor} size="sm" />
        </Stack>

        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.25 }}>
          <ReadField label="Fund holder (User)" value={snapshot.allocatedTo || '—'} />
          <ReadField label="Fund transfer" value={transferLabel} />
          <ReadField label="Requested total" value={formatAmount(snapshot.totalAmount)} />
          <ReadField label="Allocated amount" value={formatAmount(snapshot.allocatedAmount)} />
          <ReadField label="Requested at" value={formatDisplayDateTime(snapshot.requestedAt)} />
          <ReadField label="Allocated at" value={formatDisplayDateTime(snapshot.allocatedAt)} />
        </Box>

        {snapshot.serviceNames.length > 0 ? (
          <ReadField label="Services" value={snapshot.serviceNames.join(', ')} />
        ) : null}

        {snapshot.notes.trim() ? <ReadField label="Notes" value={snapshot.notes} /> : null}
      </Stack>
    </>
  )
}
