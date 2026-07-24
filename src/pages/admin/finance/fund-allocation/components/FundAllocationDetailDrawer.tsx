import { type ReactNode } from 'react'
import { Box, Divider, Stack, Typography } from '@mui/material'
import dayjs from 'dayjs'
import { Drawer, Badge } from '@/design-system/UIComponents'
import { PassengerApplicationDocumentVault } from '@/shared/components/PassengerApplicationDocumentVault'
import {
  getFundTransferTypeLabel,
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

function formatDisplayDate(value: string | undefined): string {
  if (!value?.trim()) return '—'
  const parsed = dayjs(value.trim(), ['YYYY-MM-DD', 'DD/MM/YYYY', 'DD MMM YYYY'], true)
  return parsed.isValid() ? parsed.format('DD MMM YYYY') : value
}

function SectionHeading({ children }: { children: string }) {
  return (
    <Typography variant="body2" fontWeight={600} sx={{ fontSize: 12, color: 'text.primary' }}>
      {children}
    </Typography>
  )
}

function ContextMetaItem({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <Stack spacing={0.25} minWidth={0}>
      <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ fontSize: 11 }}>
        {label}
      </Typography>
      <Typography
        variant="body2"
        color="text.primary"
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

function ContextGroup({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Stack spacing={1.25}>
      <Typography variant="body2" fontWeight={600} sx={{ fontSize: 12, color: 'text.primary' }}>
        {title}
      </Typography>
      {children}
    </Stack>
  )
}

function MetaGrid({ children }: { children: ReactNode }) {
  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', columnGap: 2, rowGap: 1.5 }}>
      {children}
    </Box>
  )
}

function ContextCard({ children }: { children: ReactNode }) {
  return (
    <Box
      sx={{
        border: 1,
        borderColor: 'divider',
        borderRadius: 1.5,
        overflow: 'hidden',
        bgcolor: 'background.paper',
      }}
    >
      <Stack spacing={0} divider={<Divider />}>
        {children}
      </Stack>
    </Box>
  )
}

function ContextCardSection({
  children,
  highlighted,
}: {
  children: ReactNode
  highlighted?: boolean
}) {
  return (
    <Box sx={{ px: 1.75, py: 1.5, bgcolor: highlighted ? 'action.hover' : undefined }}>
      {children}
    </Box>
  )
}

function PassengerContextCard({ record }: { record: FundAllocationPassengerRow }) {
  return (
    <ContextCard>
      <ContextCardSection>
        <ContextGroup title="Passenger details">
          <MetaGrid>
            <ContextMetaItem label="Company" value={record.companyName} />
            <ContextMetaItem label="Country / visa" value={`${record.country} · ${record.visaType}`} />
            <ContextMetaItem label="Jurisdiction" value={record.jurisdiction} />
            <ContextMetaItem label="Team" value={record.assignedTeam || '—'} />
            <ContextMetaItem label="User" value={record.assignedUser || '—'} />
            <ContextMetaItem label="Travel date" value={formatDisplayDate(record.travelDate)} />
          </MetaGrid>
        </ContextGroup>
      </ContextCardSection>

      <ContextCardSection highlighted>
        <ContextGroup title="Submission details">
          <MetaGrid>
            <ContextMetaItem
              label="Online Submission Date"
              value={formatDisplayDate(record.onlineSubmissionDate)}
            />
            <ContextMetaItem
              label="VFS Submission Date"
              value={formatDisplayDate(record.vfsSubmissionDate)}
            />
            <ContextMetaItem
              label="Tentative Collection Date"
              value={formatDisplayDate(record.tentativeCollectionDate)}
            />
            <ContextMetaItem
              label="Collection Date"
              value={formatDisplayDate(record.collectionDate)}
            />
            <ContextMetaItem label="Submission status" value={record.submissionStatus} />
            {record.fundRequested ? (
              <ContextMetaItem
                label="Requested total"
                value={record.totalAmount > 0 ? formatInr(record.totalAmount) : '—'}
                mono
              />
            ) : (
              <ContextMetaItem
                label="Catalog total"
                value={
                  record.suggestedAllocationAmount > 0
                    ? formatInr(record.suggestedAllocationAmount)
                    : '—'
                }
                mono
              />
            )}
          </MetaGrid>
        </ContextGroup>
      </ContextCardSection>
    </ContextCard>
  )
}

function AllocatedServicesCard({ record }: { record: FundAllocationPassengerRow }) {
  return (
    <ContextCard>
      <ContextCardSection>
        <ContextGroup title={record.allocationStatus === 'allocated' ? 'Allocated services' : 'Requested services'}>
          {record.selectedServices.length > 0 ? (
            <Stack spacing={1}>
              {record.selectedServices.map(service => (
                <Stack
                  key={service.id}
                  direction="row"
                  justifyContent="space-between"
                  spacing={1}
                  sx={{
                    py: 0.75,
                    px: 1,
                    borderRadius: 1,
                    bgcolor: 'action.hover',
                  }}
                >
                  <Typography variant="body2" sx={{ fontSize: 13, fontWeight: 500, minWidth: 0 }}>
                    {service.serviceName}
                  </Typography>
                  <Typography
                    variant="body2"
                    fontWeight={600}
                    sx={{ fontSize: 13, fontVariantNumeric: 'tabular-nums', flexShrink: 0 }}
                  >
                    {formatInr(service.amount)}
                  </Typography>
                </Stack>
              ))}
            </Stack>
          ) : (
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13 }}>
              No services recorded.
            </Typography>
          )}
        </ContextGroup>
      </ContextCardSection>

      <ContextCardSection highlighted>
        <ContextGroup title="Allocation summary">
          <MetaGrid>
            <ContextMetaItem
              label={record.allocationStatus === 'allocated' ? 'Total value' : 'Requested total'}
              value={record.totalAmount > 0 ? formatInr(record.totalAmount) : '—'}
              mono
            />
            <ContextMetaItem
              label="Allocated fund value"
              value={record.allocatedAmount > 0 ? formatInr(record.allocatedAmount) : '—'}
              mono
            />
            <ContextMetaItem
              label="Fund transfer"
              value={
                record.fundTransfer?.transferType
                  ? record.fundTransfer.transferType === 'card' && record.fundTransfer.assignedCardId
                    ? `${getFundTransferTypeLabel(record.fundTransfer.transferType)} · ${resolveCardLabel(record.fundTransfer.assignedCardId)}`
                    : getFundTransferTypeLabel(record.fundTransfer.transferType)
                  : record.cardName && record.cardName !== '—'
                    ? record.cardName
                    : '—'
              }
            />
            <ContextMetaItem label="Allocated by" value={record.allocatedBy} />
            <ContextMetaItem label="Allocated to" value={record.allocatedTo} />
            <Box sx={{ gridColumn: '1 / -1' }}>
              <ContextMetaItem
                label="Allocation notes"
                value={record.fundTransfer?.paymentRemark || record.allocationNotes}
              />
            </Box>
          </MetaGrid>
        </ContextGroup>
      </ContextCardSection>
    </ContextCard>
  )
}

interface FundAllocationDetailDrawerProps {
  open: boolean
  record: FundAllocationPassengerRow | null
  onClose: () => void
}

export function FundAllocationDetailDrawer({ open, record, onClose }: FundAllocationDetailDrawerProps) {
  if (!record) {
    return (
      <Drawer open={open} onClose={onClose} title="Passenger fund allocation" width={DETAIL_DRAWER_WIDTH}>
        <Typography variant="body2" color="text.secondary">
          Select a passenger row to view details.
        </Typography>
      </Drawer>
    )
  }

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title={record.passengerName}
      subtitle={`${record.gltsApplicationId} · ${record.gltsApplicantId}`}
      headerExtra={
        <>
          <Badge
            label={fundAllocationStatusLabel(record.allocationStatus)}
            color={fundAllocationStatusBadgeColor(record.allocationStatus)}
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
        <Stack spacing={1.25}>
          <SectionHeading>Passenger & application context</SectionHeading>
          <PassengerContextCard record={record} />
        </Stack>

        <Divider />

        <Stack spacing={1.25}>
          <SectionHeading>Document vault</SectionHeading>
          <PassengerApplicationDocumentVault
            applicationId={record.gltsApplicationId}
            gltsApplicantId={record.gltsApplicantId}
            sequenceNo={record.sequenceNo}
          />
        </Stack>

        {record.allocationStatus === 'allocated' ? (
          <>
            <Divider />
            <Stack spacing={1.25}>
              <SectionHeading>Fund allocation</SectionHeading>
              <AllocatedServicesCard record={record} />
            </Stack>
          </>
        ) : null}
      </Stack>
    </Drawer>
  )
}
