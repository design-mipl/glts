import { useEffect, useMemo, useState } from 'react'
import { Box, Divider, Stack, Typography } from '@mui/material'
import dayjs from 'dayjs'
import {
  Badge,
  Button,
  DatePicker,
  Drawer,
  FormField,
  Input,
  Tabs,
  useToast,
} from '@/design-system/UIComponents'
import type { OperationalCase } from '@/shared/types/operationalCaseHandling'
import { isLogisticsStatus, isOperationsDeskStatus } from '@/shared/types/operationalCaseHandling'
import { operationalCaseHandlingService } from '@/shared/services/operationalCaseHandlingService'
import { ApplicationTrackingUrlLink } from '@/shared/components/ApplicationTrackingUrlLink'
import { resolveApplicationTrackingUrl } from '@/shared/services/countryMasterService'
import { priorityBadgeColor, statusBadgeColor, formatJoiningDate } from '../utils/operationalCaseHandlingUtils'
import { GroundServicesChecklist } from './GroundServicesChecklist'
import { ApplicationFeePaidByField } from './ApplicationFeePaidByField'
import { SubmissionVfsChargesSummary } from './SubmissionVfsChargesSummary'
import { resolveOperationalCaseSubmissionSnapshot } from '@/shared/utils/operationalCaseSubmissionUtils'
import { OperationalPaymentDetailsSection } from './OperationalPaymentDetailsSection'
import { OperationalTimeline } from './OperationalTimeline'
import { OperationalDocumentVault } from './OperationalDocumentVault'

const DETAIL_DRAWER_WIDTH = 560

type DetailTab = 'overview' | 'services' | 'operations' | 'timeline'

const DETAIL_TABS = [
  { label: 'Overview & Documents', value: 'overview' },
  { label: 'Services', value: 'services' },
  { label: 'Operations', value: 'operations' },
  { label: 'Timeline', value: 'timeline' },
] as const

interface OperationalCaseDetailDrawerProps {
  open: boolean
  record: OperationalCase | null
  onClose: () => void
  onUpdated: () => void
  onSubmitted?: () => void
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

function SectionHeading({ children }: { children: string }) {
  return (
    <Typography variant="body2" fontWeight={600} sx={{ fontSize: 12, color: 'text.primary' }}>
      {children}
    </Typography>
  )
}

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

function OperationalCaseDetailContent({
  record,
  onUpdated,
  onSubmitted,
}: {
  record: OperationalCase
  onUpdated: () => void
  onSubmitted?: () => void
}) {
  const { showToast } = useToast()
  const [activeTab, setActiveTab] = useState<DetailTab>('overview')
  const [submissionDate, setSubmissionDate] = useState(record.submissionDate ?? '')
  const [collectionDate, setCollectionDate] = useState(record.collectionDate ?? '')
  const [submissionReferenceNumber, setSubmissionReferenceNumber] = useState(
    record.submissionReferenceNumber ?? '',
  )
  const trackingUrl = resolveApplicationTrackingUrl({ countryName: record.country })
  const canEditCase = isOperationsDeskStatus(record.status)
  const isViewOnly = isLogisticsStatus(record.status)
  const submissionSnapshot = useMemo(
    () => resolveOperationalCaseSubmissionSnapshot(record),
    [record],
  )

  useEffect(() => {
    setActiveTab('overview')
  }, [record.id])

  useEffect(() => {
    setSubmissionDate(record.submissionDate ?? '')
    setCollectionDate(record.collectionDate ?? '')
    setSubmissionReferenceNumber(record.submissionReferenceNumber ?? '')
  }, [
    record.id,
    record.submissionDate,
    record.collectionDate,
    record.submissionReferenceNumber,
  ])

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
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.25 }}>
                <ReadField label="Operational ID" value={record.operationalId} />
                <ReadField label="Passenger name" value={record.passengerName} />
                <ReadField label="Rank" value={record.passengerRank} />
                <ReadField label="Passport" value={record.passportNumber} />
                <ReadField label="CDC" value={record.cdcNumber} />
                <ReadField label="Batch ID" value={record.applicationId} />
                <ReadField label="Company" value={record.companyName} />
                <ReadField label="Vessel" value={record.vesselName} />
                <ReadField label="Visa" value={`${record.country} · ${record.visaType}`} />
                <ReadField label="Jurisdiction" value={record.jurisdiction} />
                <ReadField label="Joining date" value={formatJoiningDate(record.joiningDate)} />
                <ReadField label="Next action" value={record.nextAction} />
                <ReadField label="Crew count" value={String(record.applicantCount)} />
                <ReadField label="Assigned team" value={record.assignedTeam} />
                <ReadField label="Executive" value={record.assignedExecutive} />
              </Box>
            </Stack>

            <Divider />

            <Stack spacing={1.25}>
              <SectionHeading>Document vault</SectionHeading>
              <OperationalDocumentVault record={record} />
            </Stack>
          </Stack>
        ) : null}

        {activeTab === 'services' ? (
          <Stack spacing={2}>
            {isViewOnly && record.groundServices.some(service => service.selected) ? (
              <Stack spacing={1.25}>
                <SectionHeading>Ground services</SectionHeading>
                <GroundServicesChecklist
                  services={record.groundServices.filter(service => service.selected)}
                  readOnly
                />
              </Stack>
            ) : null}

            {isViewOnly && record.groundServices.some(service => service.selected) ? <Divider /> : null}

            <Stack spacing={1.25}>
              <SectionHeading>VFS & application fees</SectionHeading>
              <SubmissionVfsChargesSummary snapshot={submissionSnapshot} />
              <Stack spacing={0.75}>
                <Typography variant="body2" fontWeight={600} sx={{ fontSize: 12, color: 'text.primary' }}>
                  On-site fees & supplements
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: 11 }}>
                  Record additional VFS charges handled by the ground operations team.
                </Typography>
              </Stack>
              <GroundServicesChecklist
                services={
                  isViewOnly
                    ? record.applicationFees.filter(service => service.selected)
                    : record.applicationFees
                }
                readOnly={isViewOnly}
                onServiceChange={
                  isViewOnly
                    ? undefined
                    : (feeId, patch) => {
                        operationalCaseHandlingService.updateApplicationFee(record.id, feeId, patch)
                        onUpdated()
                      }
                }
              />
              <ApplicationFeePaidByField
                value={record.applicationFeesPaidBy ?? 'passenger'}
                readOnly={isViewOnly}
                onChange={
                  isViewOnly
                    ? undefined
                    : paidBy => {
                        operationalCaseHandlingService.updateApplicationFeesPaidBy(record.id, paidBy)
                        onUpdated()
                      }
                }
              />
            </Stack>

            <Divider />

            <Stack spacing={1.25}>
              <OperationalPaymentDetailsSection
                record={record}
                readOnly={isViewOnly}
                onUpdated={onUpdated}
              />
            </Stack>

            <Divider />

            <Stack spacing={1.25}>
              <SectionHeading>Expense summary</SectionHeading>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.25 }}>
                <ReadField label="Summary" value={record.expenseSummary} />
                <ReadField label="Estimated" value={`₹${record.estimatedExpense.toLocaleString('en-IN')}`} />
                <ReadField label="Actual" value={`₹${record.actualExpense.toLocaleString('en-IN')}`} />
                <ReadField label="Services" value={record.servicesSummary} />
              </Box>
            </Stack>

            {record.expenses.length > 0 ? (
              <>
                <Divider />
                <Stack spacing={1}>
                  <SectionHeading>Additional expenses</SectionHeading>
                  {record.expenses.map(expense => (
                    <Box
                      key={expense.id}
                      sx={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: 1,
                        p: 1.25,
                        borderRadius: 1,
                        border: 1,
                        borderColor: 'divider',
                      }}
                    >
                      <ReadField label="Service" value={expense.serviceName} />
                      <ReadField
                        label="Amount"
                        value={`₹${expense.actualAmount.toLocaleString('en-IN')}`}
                      />
                      {expense.remarks ? <ReadField label="Remarks" value={expense.remarks} /> : null}
                      {expense.receiptFileName ? (
                        <ReadField label="Receipt" value={expense.receiptFileName} />
                      ) : null}
                    </Box>
                  ))}
                </Stack>
              </>
            ) : null}
          </Stack>
        ) : null}

        {activeTab === 'operations' ? (
          <Stack spacing={2}>
            <Stack spacing={1.25}>
              <SectionHeading>Submission details</SectionHeading>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.25 }}>
                {canEditCase ? (
                  <>
                    <FormField label="Submission Date">
                      <DatePicker
                        value={parseDateString(submissionDate)}
                        onChange={date => setSubmissionDate(formatDateForStorage(date))}
                        placeholder="Select submission date"
                        size="sm"
                        fullWidth
                      />
                    </FormField>
                    <FormField label="Collection Date">
                      <DatePicker
                        value={parseDateString(collectionDate)}
                        onChange={date => setCollectionDate(formatDateForStorage(date))}
                        placeholder="Select collection date"
                        size="sm"
                        fullWidth
                      />
                    </FormField>
                  </>
                ) : (
                  <>
                    <ReadField
                      label="Submission Date"
                      value={formatDisplayDate(record.submissionDate)}
                    />
                    <ReadField
                      label="Collection Date"
                      value={formatDisplayDate(record.collectionDate)}
                    />
                  </>
                )}
              </Box>
              {canEditCase ? (
                <FormField label="Submission Reference No.">
                  <Input
                    size="sm"
                    value={submissionReferenceNumber}
                    onChange={setSubmissionReferenceNumber}
                    placeholder="e.g. VFS-ONL-2026-0142"
                    fullWidth
                  />
                </FormField>
              ) : (
                <ReadField
                  label="Submission Reference No."
                  value={record.submissionReferenceNumber ?? ''}
                />
              )}
              {canEditCase ? (
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  <Button
                    label="Submit"
                    size="sm"
                    onClick={() => {
                      if (!submissionDate.trim() || !submissionReferenceNumber.trim()) {
                        showToast({
                          title: 'Missing required fields',
                          description: 'Submission date and reference number are required to submit.',
                          variant: 'error',
                        })
                        return
                      }
                      const updated = operationalCaseHandlingService.submitDocuments(record.id, {
                        submissionDate,
                        collectionDate,
                        submissionReferenceNumber,
                      })
                      if (!updated) {
                        showToast({
                          title: 'Unable to submit',
                          description: 'Submit is only available for Pending or Moved to Next Day cases.',
                          variant: 'error',
                        })
                        return
                      }
                      showToast({
                        title: 'Documents submitted',
                        description:
                          'Case moved to Tracking & Logistics and remains visible on the Operations Desk.',
                        variant: 'success',
                      })
                      onUpdated()
                      onSubmitted?.()
                    }}
                  />
                  <Button
                    label="Move to next day"
                    variant="outlined"
                    size="sm"
                    onClick={() => {
                      operationalCaseHandlingService.moveToNextDay(record.id)
                      onUpdated()
                      showToast({ title: 'Moved to next day', variant: 'info' })
                    }}
                  />
                </Stack>
              ) : null}
            </Stack>

            <Divider />

            <Stack spacing={1.25}>
              {isViewOnly ? (
                <ReadField
                  label="Visa Status Tracking URL"
                  value={trackingUrl ? 'Configured in Country Master' : 'Not configured in Country Master'}
                />
              ) : (
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
              )}
              {isViewOnly && trackingUrl ? (
                <ApplicationTrackingUrlLink
                  countryName={record.country}
                  label="Open tracking portal"
                />
              ) : null}
            </Stack>
          </Stack>
        ) : null}

        {activeTab === 'timeline' ? (
          <OperationalTimeline events={record.timeline} />
        ) : null}
      </Box>
    </Stack>
  )
}

export function OperationalCaseDetailDrawer({
  open,
  record,
  onClose,
  onUpdated,
  onSubmitted,
}: OperationalCaseDetailDrawerProps) {
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
          {record.carryForward ? (
            <Badge label="Moved to Next Day" color="warning" size="sm" />
          ) : null}
        </>
      }
      width={DETAIL_DRAWER_WIDTH}
      bodyVariant="paper"
    >
      <OperationalCaseDetailContent
        record={record}
        onUpdated={onUpdated}
        onSubmitted={onSubmitted}
      />
    </Drawer>
  )
}
