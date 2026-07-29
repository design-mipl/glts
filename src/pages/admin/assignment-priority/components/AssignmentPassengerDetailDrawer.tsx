import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { Box, Divider, Stack, Typography } from '@mui/material'
import dayjs from 'dayjs'
import { Badge, Drawer, Tabs } from '@/design-system/UIComponents'
import type { OperationalPassengerRow } from '@/shared/types/operationalPassengerAssignment'
import {
  mockBulkBatches,
  mockSingleApplications,
} from '@/pages/customer/features/applications/data/applicationFlowData'
import { applicationFormAssistService } from '@/shared/services/applicationFormAssistService'
import { marineApplicationAdminService } from '@/shared/services/marineApplicationAdminService'
import { operationalCaseHandlingService } from '@/shared/services/operationalCaseHandlingService'
import { PassengerApplicationDocumentVault } from '@/shared/components/PassengerApplicationDocumentVault'
import { rollupApplicationStatus } from '../utils/applicationStatusRollup'
import {
  assignmentPriorityBadgeColor,
  assignmentPriorityLabel,
} from '../config/assignmentPriorityConfig'
import {
  passengerStatusBadgeColor,
  passengerStatusLabel,
  rollupStatusBadgeColor,
  rollupStatusLabel,
} from '../config/assignmentStatusConfig'
import { formatSlaTimer, isSlaAtRisk } from '../utils/assignmentQueueListingUtils'
import { invoiceStatusLabel, invoiceStatusBadgeColor } from '@/pages/admin/finance/invoices/config/invoiceStatusConfig'
import { AssignmentTimeline } from './AssignmentTimeline'
import { operationalPassengerAssignmentService } from '@/shared/services/operationalPassengerAssignmentService'
import type { AssignmentSegmentConfig } from '../config/assignmentSegmentConfig'
import { AssignmentOperationalAttachments } from './AssignmentOperationalAttachments'
import { AssignmentFundAllocationSection } from './AssignmentFundAllocationSection'
import { AssignmentFundStatusBadge } from './AssignmentFundStatusBadge'

const DETAIL_DRAWER_WIDTH = 560

type DetailTab = 'overview' | 'timeline'

const DETAIL_TABS = [
  { label: 'Overview & Documents', value: 'overview' },
  { label: 'Timeline', value: 'timeline' },
] as const

interface AssignmentPassengerDetailDrawerProps {
  open: boolean
  record: OperationalPassengerRow | null
  segmentConfig: AssignmentSegmentConfig
  onClose: () => void
}

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

function resolveAllocatedBy(record: OperationalPassengerRow): string {
  return record.assignmentHistory[0]?.assignedBy?.trim() || ''
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

function resolvePortalDates(record: OperationalPassengerRow) {
  const application =
    mockSingleApplications.find(app => app.id === record.gltsApplicationId) ??
    mockBulkBatches.find(app => app.id === record.gltsApplicationId)

  const detail = marineApplicationAdminService.getDetail(record.gltsApplicationId)
  const queueRow =
    detail.uploadQueueRows.find(row => row.gltsApplicantId === record.gltsApplicantId) ??
    detail.uploadQueueRows.find(row => row.sequenceNo === record.sequenceNo)
  const travelerRowId = queueRow?.id ?? `q${record.sequenceNo}`
  const assist = applicationFormAssistService.getRecord(
    record.gltsApplicationId,
    travelerRowId,
  ).submission

  const opsCase = operationalCaseHandlingService
    .listByApplicationId(record.gltsApplicationId)
    .find(caseRow => {
      if (caseRow.gltsApplicantId && caseRow.gltsApplicantId === record.gltsApplicantId) return true
      return (
        caseRow.passportNumber.replace(/\s/g, '').toUpperCase() ===
        record.passportNo.replace(/\s/g, '').toUpperCase()
      )
    })

  const onlineSubmissionDate =
    assist.submissionDate.trim() ||
    application?.submissionDate?.trim() ||
    record.submissionDate.trim() ||
    ''

  const vfsSubmissionDate =
    assist.vfsSubmissionDate.trim() || opsCase?.submissionDate?.trim() || ''

  const tentativeCollectionDate =
    assist.tentativeCollectionDate.trim() || application?.tentativeCollectionDate?.trim() || ''

  return {
    onlineSubmissionDate,
    vfsSubmissionDate,
    tentativeCollectionDate,
    collectionDate: opsCase?.collectionDate?.trim() || '',
    submittedBy: assist.submittedBy.trim() || '',
  }
}

function PassengerContextCard({
  record,
  rollupLabel,
  dates,
}: {
  record: OperationalPassengerRow
  rollupLabel: string
  dates: ReturnType<typeof resolvePortalDates>
}) {
  return (
    <ContextCard>
      <ContextCardSection>
        <ContextGroup title="Passenger details">
          <MetaGrid>
            <ContextMetaItem label="Passport" value={record.passportNo} mono />
            <ContextMetaItem label="Sequence" value={String(record.sequenceNo)} mono />
            <ContextMetaItem label="Phone number" value={record.passengerPhone} />
            <ContextMetaItem label="Email address" value={record.passengerEmail} />
            <ContextMetaItem label="Company" value={record.companyName} />
            <ContextMetaItem label="Booker" value={record.bookerName} />
            <ContextMetaItem
              label="Country / visa"
              value={`${record.country} · ${record.visaType}`}
            />
            <ContextMetaItem label="Jurisdiction" value={record.jurisdiction} />
            <ContextMetaItem label="Travel date" value={formatDisplayDate(record.travelDate)} />
            <ContextMetaItem label="Processing stage" value={record.processingStage} />
          </MetaGrid>
        </ContextGroup>
      </ContextCardSection>

      <ContextCardSection>
        <ContextGroup title="Operations">
          <MetaGrid>
            <ContextMetaItem label="Allocated by" value={resolveAllocatedBy(record)} />
            <ContextMetaItem label="Allocated to" value={resolveAllocatedTo(record)} />
            <ContextMetaItem
              label="Operational date"
              value={formatDisplayDate(record.operationalDate)}
            />
            <ContextMetaItem label="Application roll-up" value={rollupLabel} />
          </MetaGrid>
        </ContextGroup>
      </ContextCardSection>

      <ContextCardSection highlighted>
        <ContextGroup title="Submission details">
          <MetaGrid>
            <ContextMetaItem
              label="Online Submission Date"
              value={formatDisplayDate(dates.onlineSubmissionDate)}
            />
            <ContextMetaItem label="Online Submitted By" value={dates.submittedBy} />
            <ContextMetaItem
              label="VFS Submission Date"
              value={formatDisplayDate(dates.vfsSubmissionDate)}
            />
            <ContextMetaItem
              label="Tentative Collection Date"
              value={formatDisplayDate(dates.tentativeCollectionDate)}
            />
            <ContextMetaItem
              label="Collection Date"
              value={formatDisplayDate(dates.collectionDate)}
            />
            <ContextMetaItem label="Submission status" value={record.submissionStatus} />
          </MetaGrid>
        </ContextGroup>
      </ContextCardSection>
    </ContextCard>
  )
}

function AssignmentDetailContent({
  record,
  segmentConfig,
}: {
  record: OperationalPassengerRow
  segmentConfig: AssignmentSegmentConfig
}) {
  const [activeTab, setActiveTab] = useState<DetailTab>('overview')
  const portal = useMemo(() => resolvePortalDates(record), [record])

  const siblings = operationalPassengerAssignmentService
    .list(segmentConfig.segment)
    .filter(r => r.gltsApplicationId === record.gltsApplicationId)
  const rollup = rollupApplicationStatus(siblings)
  const rollupLabel = rollupStatusLabel[rollup]

  useEffect(() => {
    setActiveTab('overview')
  }, [record.id])

  return (
    <Stack spacing={0}>
      <Box sx={{ mx: -3, mt: -3, mb: 0 }}>
        <Box sx={{ px: 3, pt: 0.5 }}>
          <Tabs
            items={[...DETAIL_TABS]}
            value={activeTab}
            onChange={value => setActiveTab(value as DetailTab)}
            variant="underline"
            size="sm"
            scrollable
          />
        </Box>
      </Box>

      <Box sx={{ pt: 2 }}>
        {activeTab === 'overview' ? (
          <Stack spacing={2}>
            <Stack spacing={1.25}>
              <SectionHeading>Passenger & application context</SectionHeading>
              <PassengerContextCard
                record={record}
                rollupLabel={rollupLabel}
                dates={portal}
              />
            </Stack>

            <Divider />

            <Stack spacing={1.25}>
              <SectionHeading>Document vault</SectionHeading>
              <PassengerApplicationDocumentVault
                applicationId={record.gltsApplicationId}
                gltsApplicantId={record.gltsApplicantId}
                sequenceNo={record.sequenceNo}
              />
              <AssignmentOperationalAttachments attachmentNames={record.attachmentNames} />
            </Stack>

            <AssignmentFundAllocationSection record={record} />

            <Divider />

            <Stack spacing={1.25}>
              <SectionHeading>Notes & remarks</SectionHeading>
              <Typography variant="body2" sx={{ fontSize: 13, whiteSpace: 'pre-wrap' }}>
                {record.operationalRemarks?.trim() || '—'}
              </Typography>
            </Stack>

            {(record.invoiceStatus || record.paymentStatus) && (
              <>
                <Divider />
                <Stack spacing={1.25}>
                  <SectionHeading>Billing</SectionHeading>
                  <MetaGrid>
                    <Stack spacing={0.25}>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        fontWeight={600}
                        sx={{ fontSize: 11 }}
                      >
                        Invoice status
                      </Typography>
                      {record.invoiceStatus ? (
                        <Box>
                          <Badge
                            label={invoiceStatusLabel[record.invoiceStatus]}
                            color={invoiceStatusBadgeColor(record.invoiceStatus)}
                            size="sm"
                          />
                        </Box>
                      ) : (
                        <Typography variant="body2" sx={{ fontSize: 13 }}>
                          —
                        </Typography>
                      )}
                    </Stack>
                    <ContextMetaItem label="Payment status" value={record.paymentStatus || '—'} />
                    <ContextMetaItem label="Record type" value={record.recordType} />
                    <ContextMetaItem label="Created by" value={record.createdByEmail} />
                  </MetaGrid>
                </Stack>
              </>
            )}
          </Stack>
        ) : null}

        {activeTab === 'timeline' ? (
          <Stack spacing={2}>
            <Stack spacing={1.25}>
              <SectionHeading>Assignment history</SectionHeading>
              {record.assignmentHistory.length === 0 ? (
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13 }}>
                  No assignment history yet.
                </Typography>
              ) : (
                <Stack spacing={1}>
                  {record.assignmentHistory.map(entry => (
                    <Box
                      key={entry.id}
                      sx={{
                        p: 1.25,
                        borderRadius: 1.5,
                        border: 1,
                        borderColor: 'divider',
                        bgcolor: 'action.hover',
                      }}
                    >
                      <Typography variant="body2" fontWeight={600} sx={{ fontSize: 13 }}>
                        {entry.assignedUser || '—'} · {entry.assignedTeam || 'Unassigned'}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(entry.occurredAt).toLocaleString('en-GB')} · Allocated by{' '}
                        {entry.assignedBy || '—'}
                      </Typography>
                      {entry.notes ? (
                        <Typography variant="body2" sx={{ fontSize: 12, mt: 0.5 }}>
                          {entry.notes}
                        </Typography>
                      ) : null}
                    </Box>
                  ))}
                </Stack>
              )}
            </Stack>

            <Divider />

            <Stack spacing={1.25}>
              <SectionHeading>SLA</SectionHeading>
              <MetaGrid>
                <ContextMetaItem
                  label="SLA due"
                  value={new Date(record.slaDueAt).toLocaleString('en-GB')}
                />
                <ContextMetaItem
                  label="Operational date"
                  value={formatDisplayDate(record.operationalDate)}
                />
                <ContextMetaItem label="Time remaining" value={formatSlaTimer(record)} />
                <ContextMetaItem
                  label="Last updated"
                  value={new Date(record.lastUpdated).toLocaleString('en-GB')}
                />
              </MetaGrid>
            </Stack>

            <Divider />

            <Stack spacing={1.25}>
              <SectionHeading>Operational timeline</SectionHeading>
              <Box>
                <Badge
                  label={rollupStatusLabel[rollup]}
                  color={rollupStatusBadgeColor(rollup)}
                  size="sm"
                />
              </Box>
              <AssignmentTimeline events={record.timeline} />
            </Stack>
          </Stack>
        ) : null}
      </Box>
    </Stack>
  )
}

export function AssignmentPassengerDetailDrawer({
  open,
  record,
  segmentConfig,
  onClose,
}: AssignmentPassengerDetailDrawerProps) {
  if (!record) {
    return (
      <Drawer open={open} onClose={onClose} title="Passenger detail" width={DETAIL_DRAWER_WIDTH}>
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
            label={passengerStatusLabel[record.passengerStatus]}
            color={passengerStatusBadgeColor(record.passengerStatus)}
            size="sm"
          />
          <Badge
            label={assignmentPriorityLabel[record.priority]}
            color={assignmentPriorityBadgeColor(record.priority)}
            size="sm"
          />
          {record.carryForward ? <Badge label="Carry forward" color="warning" size="sm" /> : null}
          {record.escalated ? <Badge label="Escalated" color="error" size="sm" /> : null}
          <AssignmentFundStatusBadge passengerId={record.id} />
          <Badge
            label={formatSlaTimer(record)}
            color={isSlaAtRisk(record) ? 'error' : 'neutral'}
            size="sm"
          />
        </>
      }
      width={DETAIL_DRAWER_WIDTH}
      bodyVariant="paper"
    >
      <AssignmentDetailContent record={record} segmentConfig={segmentConfig} />
    </Drawer>
  )
}
