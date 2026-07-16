import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { Box, Divider, Stack, Typography } from '@mui/material'
import dayjs from 'dayjs'
import {
  Badge,
  Button,
  Drawer,
  FormField,
  Tabs,
  useToast,
} from '@/design-system/UIComponents'
import type { OperationalCase } from '@/shared/types/operationalCaseHandling'
import { operationalCaseHandlingService } from '@/shared/services/operationalCaseHandlingService'
import { ApplicationTrackingUrlLink } from '@/shared/components/ApplicationTrackingUrlLink'
import { resolveApplicationTrackingUrl } from '@/shared/services/countryMasterService'
import {
  resolveOperationalCasePortalDates,
  resolveOperationalCaseSubmissionSnapshot,
} from '@/shared/utils/operationalCaseSubmissionUtils'
import {
  formatJoiningDate,
  priorityBadgeColor,
  resolveOperationalCaseAssignmentFields,
  statusBadgeColor,
  type LogisticsStatusTab,
} from '../../case-handling/utils/operationalCaseHandlingUtils'
import { OperationalTimeline } from '../../case-handling/components/OperationalTimeline'
import { OperationalDocumentVault } from '../../case-handling/components/OperationalDocumentVault'
import { OperationalFundAllocationSection } from '../../case-handling/components/OperationalFundAllocationSection'
import { LogisticsDispatchTab } from './LogisticsDispatchTab'
import { PassengerApplicationDocumentVault } from '@/shared/components/PassengerApplicationDocumentVault'

const DETAIL_DRAWER_WIDTH = 560

type DetailTab = 'overview' | 'dispatch' | 'timeline'

const DETAIL_TABS = [
  { label: 'Overview & Documents', value: 'overview' },
  { label: 'Dispatch', value: 'dispatch' },
  { label: 'Timeline', value: 'timeline' },
] as const

interface LogisticsCaseDetailDrawerProps {
  open: boolean
  record: OperationalCase | null
  onClose: () => void
  onUpdated: () => void
  onStatusChanged?: (tab: LogisticsStatusTab) => void
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

function formatDisplayDate(value: string | undefined): string {
  if (!value?.trim()) return '—'
  const parsed = dayjs(value.trim(), ['YYYY-MM-DD', 'DD/MM/YYYY'], true)
  return parsed.isValid() ? parsed.format('DD MMM YYYY') : value
}

function LogisticsContextCard({ record }: { record: OperationalCase }) {
  const snapshot = useMemo(() => resolveOperationalCaseSubmissionSnapshot(record), [record])
  const dates = resolveOperationalCasePortalDates(record, snapshot)
  const assignment = resolveOperationalCaseAssignmentFields(record)

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
        <Box sx={{ px: 1.75, py: 1.5 }}>
          <ContextGroup title="Passenger details">
            <MetaGrid>
              <ContextMetaItem label="Passport" value={record.passportNumber} mono />
              <ContextMetaItem label="CDC" value={record.cdcNumber} mono />
              <ContextMetaItem label="Company" value={record.companyName} />
              <ContextMetaItem label="Vessel" value={record.vesselName} />
              <ContextMetaItem label="Visa" value={`${record.country} · ${record.visaType}`} />
              <ContextMetaItem label="Jurisdiction" value={record.jurisdiction} />
              <ContextMetaItem label="Joining date" value={formatJoiningDate(record.joiningDate)} />
            </MetaGrid>
          </ContextGroup>
        </Box>

        <Box sx={{ px: 1.75, py: 1.5 }}>
          <ContextGroup title="Operations">
            <MetaGrid>
              <ContextMetaItem label="Allocated by" value={assignment.allocatedBy} />
              <ContextMetaItem label="Allocated to" value={assignment.allocatedTo} />
            </MetaGrid>
          </ContextGroup>
        </Box>

        <Box sx={{ px: 1.75, py: 1.5, bgcolor: 'action.hover' }}>
          <ContextGroup title="Submission details">
            <MetaGrid>
              <ContextMetaItem
                label="Online Submission Date"
                value={formatDisplayDate(dates.onlineSubmissionDate)}
              />
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
              <Box sx={{ gridColumn: '1 / -1' }}>
                <ContextMetaItem
                  label="Submission Reference No."
                  value={record.submissionReferenceNumber ?? ''}
                />
              </Box>
            </MetaGrid>
          </ContextGroup>
        </Box>
      </Stack>
    </Box>
  )
}

function LogisticsCaseDetailContent({
  record,
  onUpdated,
  onStatusChanged,
}: {
  record: OperationalCase
  onUpdated: () => void
  onStatusChanged?: (tab: LogisticsStatusTab) => void
}) {
  const { showToast } = useToast()
  const [activeTab, setActiveTab] = useState<DetailTab>('overview')
  const trackingUrl = resolveApplicationTrackingUrl({ countryName: record.country })

  useEffect(() => {
    setActiveTab('overview')
  }, [record.id])

  const showCollectAction = record.status === 'Document Submitted'

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
              <SectionHeading>Passenger & batch context</SectionHeading>
              <LogisticsContextCard record={record} />
            </Stack>

            <Divider />

            <Stack spacing={1.25}>
              <SectionHeading>Document vault</SectionHeading>
              <PassengerApplicationDocumentVault
                applicationId={record.applicationId}
                gltsApplicantId={record.gltsApplicantId}
                sequenceNo={record.passengerSequence}
              />
              <OperationalDocumentVault record={record} />
            </Stack>

            <OperationalFundAllocationSection record={record} />

            <Divider />

            <FormField label="Visa Status Tracking URL">
              {trackingUrl ? (
                <ApplicationTrackingUrlLink
                  countryName={record.country}
                  label="Open tracking portal"
                />
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13 }}>
                  Not configured in Country Master
                </Typography>
              )}
            </FormField>

            {showCollectAction ? (
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                <Button
                  label="Mark as collected"
                  size="sm"
                  onClick={() => {
                    operationalCaseHandlingService.markCollected(record.id)
                    onUpdated()
                    onStatusChanged?.('Collected')
                    showToast({
                      title: 'Marked as collected',
                      description: 'Passport/documents collected from Embassy/VFS.',
                      variant: 'success',
                    })
                  }}
                />
              </Stack>
            ) : null}
          </Stack>
        ) : null}

        {activeTab === 'dispatch' ? (
          <LogisticsDispatchTab
            record={record}
            onUpdated={onUpdated}
            onDispatched={() => onStatusChanged?.('Completed')}
          />
        ) : null}

        {activeTab === 'timeline' ? <OperationalTimeline events={record.timeline} /> : null}
      </Box>
    </Stack>
  )
}

export function LogisticsCaseDetailDrawer({
  open,
  record,
  onClose,
  onUpdated,
  onStatusChanged,
}: LogisticsCaseDetailDrawerProps) {
  if (!record) return null

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title={record.passengerName}
      subtitle={`${record.operationalId} · ${record.applicationId}`}
      headerExtra={
        <>
          <Badge label={record.status} color={statusBadgeColor(record.status)} size="sm" />
          <Badge label={record.priority} color={priorityBadgeColor(record.priority)} size="sm" />
        </>
      }
      width={DETAIL_DRAWER_WIDTH}
      bodyVariant="paper"
    >
      <LogisticsCaseDetailContent
        record={record}
        onUpdated={onUpdated}
        onStatusChanged={onStatusChanged}
      />
    </Drawer>
  )
}
