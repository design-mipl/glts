import { useEffect, useMemo, useState, type ReactNode } from 'react'
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
import { priorityBadgeColor, statusBadgeColor, formatJoiningDate, resolveOperationalCaseAssignmentFields } from '../utils/operationalCaseHandlingUtils'
import { GroundServicesChecklist } from './GroundServicesChecklist'
import { ApplicationFeePaidByField } from './ApplicationFeePaidByField'
import { OnSiteFeeDocumentsSection } from './OnSiteFeeDocumentsSection'
import {
  getSubmissionPaidApplicationFeeIds,
  resolveOperationalCasePortalDates,
  resolveOperationalCaseSubmissionSnapshot,
  withSubmissionPaidFeeState,
  type OperationalCaseSubmissionSnapshot,
} from '@/shared/utils/operationalCaseSubmissionUtils'
import { OperationalPaymentDetailsSection } from './OperationalPaymentDetailsSection'
import { OperationalTimeline } from './OperationalTimeline'
import { OperationalDocumentVault } from './OperationalDocumentVault'
import { PassengerApplicationDocumentVault } from '@/shared/components/PassengerApplicationDocumentVault'

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

function ContextGroup({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
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

function PassengerBatchContextCard({
  record,
  submissionSnapshot,
}: {
  record: OperationalCase
  submissionSnapshot: OperationalCaseSubmissionSnapshot | null
}) {
  const dates = resolveOperationalCasePortalDates(record, submissionSnapshot)
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
              <ContextMetaItem label="Crew count" value={String(record.applicantCount)} />
            </MetaGrid>
          </ContextGroup>
        </Box>

        <Box sx={{ px: 1.75, py: 1.5 }}>
          <ContextGroup title="Operations">
            <MetaGrid>
              <Box sx={{ gridColumn: '1 / -1' }}>
                <ContextMetaItem label="Next action" value={record.nextAction} />
              </Box>
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
            </MetaGrid>
          </ContextGroup>
        </Box>
      </Stack>
    </Box>
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
  const portalDates = useMemo(
    () => resolveOperationalCasePortalDates(record, submissionSnapshot),
    [record, submissionSnapshot],
  )
  const lockedOnSiteFeeIds = useMemo(
    () => getSubmissionPaidApplicationFeeIds(record.applicationFees, submissionSnapshot),
    [record.applicationFees, submissionSnapshot],
  )
  const onSiteFees = useMemo(() => {
    const withPaid = withSubmissionPaidFeeState(record.applicationFees, submissionSnapshot)
    if (!isViewOnly) return withPaid
    return withPaid.filter(service => service.selected || lockedOnSiteFeeIds.has(service.id))
  }, [isViewOnly, lockedOnSiteFeeIds, record.applicationFees, submissionSnapshot])

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
              <PassengerBatchContextCard
                record={record}
                submissionSnapshot={submissionSnapshot}
              />
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
              <SectionHeading>On-site fees</SectionHeading>
              <GroundServicesChecklist
                services={onSiteFees}
                lockedServiceIds={lockedOnSiteFeeIds}
                readOnly={isViewOnly}
                onServiceChange={
                  isViewOnly
                    ? undefined
                    : (feeId, patch) => {
                        if (lockedOnSiteFeeIds.has(feeId)) return
                        operationalCaseHandlingService.updateApplicationFee(record.id, feeId, patch)
                        onUpdated()
                      }
                }
              />
              <Typography variant="body2" fontWeight={600} sx={{ fontSize: 12, color: 'text.primary' }}>
                GLTS charges
              </Typography>
              {(isViewOnly ? (record.gltsOpsFees ?? []).some(service => service.selected) : true) ? (
                <GroundServicesChecklist
                  services={
                    isViewOnly
                      ? (record.gltsOpsFees ?? []).filter(service => service.selected)
                      : (record.gltsOpsFees ?? [])
                  }
                  readOnly={isViewOnly}
                  onServiceChange={
                    isViewOnly
                      ? undefined
                      : (feeId, patch) => {
                          operationalCaseHandlingService.updateGltsOpsFee(record.id, feeId, patch)
                          onUpdated()
                        }
                  }
                />
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: 12 }}>
                  No GLTS charges recorded for this passenger.
                </Typography>
              )}
              <OnSiteFeeDocumentsSection
                attachmentNames={record.attachmentNames}
                readOnly={isViewOnly}
                onAdd={fileNames => {
                  operationalCaseHandlingService.addAttachments(record.id, fileNames)
                  onUpdated()
                }}
                onRemove={fileName => {
                  operationalCaseHandlingService.removeAttachment(record.id, fileName)
                  onUpdated()
                }}
                onError={message => {
                  showToast({ title: 'Upload failed', description: message, variant: 'error' })
                }}
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
                <ReadField
                  label="Online Submission Date"
                  value={formatDisplayDate(portalDates.onlineSubmissionDate)}
                />
                <ReadField
                  label="Tentative Collection Date"
                  value={formatDisplayDate(portalDates.tentativeCollectionDate)}
                />
                {canEditCase ? (
                  <>
                    <FormField label="VFS Submission Date">
                      <DatePicker
                        value={parseDateString(submissionDate)}
                        onChange={date => setSubmissionDate(formatDateForStorage(date))}
                        placeholder="Select VFS submission date"
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
                      label="VFS Submission Date"
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
                          description:
                            'VFS submission date and reference number are required to submit.',
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
