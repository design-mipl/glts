import { useEffect, useState } from 'react'
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
  formatJoiningDate,
  priorityBadgeColor,
  statusBadgeColor,
  type LogisticsStatusTab,
} from '../../case-handling/utils/operationalCaseHandlingUtils'
import { OperationalTimeline } from '../../case-handling/components/OperationalTimeline'
import { LogisticsDispatchTab } from './LogisticsDispatchTab'

const DETAIL_DRAWER_WIDTH = 560

type DetailTab = 'overview' | 'dispatch' | 'timeline'

const DETAIL_TABS = [
  { label: 'Overview', value: 'overview' },
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

function formatDisplayDate(value: string | undefined): string {
  if (!value?.trim()) return '—'
  const parsed = dayjs(value.trim(), ['YYYY-MM-DD', 'DD/MM/YYYY'], true)
  return parsed.isValid() ? parsed.format('DD MMM YYYY') : value
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
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.25 }}>
              <ReadField label="Operational ID" value={record.operationalId} />
              <ReadField label="Passenger name" value={record.passengerName} />
              <ReadField label="Batch ID" value={record.applicationId} />
              <ReadField label="Visa" value={`${record.country} · ${record.visaType}`} />
              <ReadField label="Jurisdiction" value={record.jurisdiction} />
              <ReadField label="Joining date" value={formatJoiningDate(record.joiningDate)} />
            </Box>

            <Divider />

            <Stack spacing={1.25}>
              <Typography variant="body2" fontWeight={600} sx={{ fontSize: 12 }}>
                Submission details
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.25 }}>
                <ReadField label="Submission Date" value={formatDisplayDate(record.submissionDate)} />
                <ReadField label="Collection Date" value={formatDisplayDate(record.collectionDate)} />
              </Box>
              <ReadField label="Submission Reference No." value={record.submissionReferenceNumber ?? ''} />
            </Stack>

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
