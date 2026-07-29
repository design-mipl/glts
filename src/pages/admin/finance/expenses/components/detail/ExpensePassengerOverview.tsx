import { useMemo, type ReactNode } from 'react'
import { Box, Divider, Stack, Typography } from '@mui/material'
import dayjs from 'dayjs'
import {
  mockBulkBatches,
  mockSingleApplications,
  type UploadQueueRow,
} from '@/pages/customer/features/applications/data/applicationFlowData'
import { resolveApplicantBasicDetails } from '@/pages/customer/features/applications/utils/applicantBasicDetailsUtils'
import { AssignmentOperationalAttachments } from '@/pages/admin/assignment-priority/components/AssignmentOperationalAttachments'
import { rollupApplicationStatus } from '@/pages/admin/assignment-priority/utils/applicationStatusRollup'
import { rollupStatusLabel } from '@/pages/admin/assignment-priority/config/assignmentStatusConfig'
import { PassengerApplicationDocumentVault } from '@/shared/components/PassengerApplicationDocumentVault'
import { applicationFormAssistService } from '@/shared/services/applicationFormAssistService'
import { marineApplicationAdminService } from '@/shared/services/marineApplicationAdminService'
import { operationalCaseHandlingService } from '@/shared/services/operationalCaseHandlingService'
import { operationalPassengerAssignmentService } from '@/shared/services/operationalPassengerAssignmentService'
import type { ApplicationExpenseDetailView } from '@/shared/types/applicationExpenseManagement'
import type { OperationalPassengerRow } from '@/shared/types/operationalPassengerAssignment'

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

function resolvePortalDates(applicationId: string, selectedRow: UploadQueueRow) {
  const application =
    mockSingleApplications.find(app => app.id === applicationId) ??
    mockBulkBatches.find(app => app.id === applicationId)

  const detail = marineApplicationAdminService.getDetail(applicationId)
  const queueRow =
    detail.uploadQueueRows.find(row => row.gltsApplicantId === selectedRow.gltsApplicantId) ??
    detail.uploadQueueRows.find(row => row.sequenceNo === selectedRow.sequenceNo) ??
    selectedRow
  const travelerRowId = queueRow?.id ?? selectedRow.id
  const assist = applicationFormAssistService.getRecord(applicationId, travelerRowId).submission

  const opsCase = operationalCaseHandlingService.listByApplicationId(applicationId).find(caseRow => {
    if (caseRow.gltsApplicantId && caseRow.gltsApplicantId === selectedRow.gltsApplicantId) {
      return true
    }
    return (
      caseRow.passportNumber.replace(/\s/g, '').toUpperCase() ===
      selectedRow.passportNo.replace(/\s/g, '').toUpperCase()
    )
  })

  return {
    onlineSubmissionDate:
      assist.submissionDate.trim() || application?.submissionDate?.trim() || '',
    vfsSubmissionDate: assist.vfsSubmissionDate.trim() || opsCase?.submissionDate?.trim() || '',
    tentativeCollectionDate:
      assist.tentativeCollectionDate.trim() || application?.tentativeCollectionDate?.trim() || '',
    collectionDate: opsCase?.collectionDate?.trim() || '',
    submittedBy: assist.submittedBy.trim() || '',
    submissionStatus: application?.operationalStatus?.trim() || '',
  }
}

function findAssignmentRecord(
  applicationId: string,
  selectedRow: UploadQueueRow,
  customerSegment: ApplicationExpenseDetailView['customerSegment'],
): OperationalPassengerRow | undefined {
  const rows = operationalPassengerAssignmentService.list(customerSegment)
  const byApplicant = rows.find(
    row =>
      row.gltsApplicationId === applicationId &&
      row.gltsApplicantId === selectedRow.gltsApplicantId,
  )
  if (byApplicant) return byApplicant

  const passportKey = selectedRow.passportNo.replace(/\s/g, '').toUpperCase()
  return rows.find(
    row =>
      row.gltsApplicationId === applicationId &&
      row.passportNo.replace(/\s/g, '').toUpperCase() === passportKey,
  )
}

interface ExpensePassengerOverviewProps {
  applicationId: string
  selectedRow: UploadQueueRow
  expenseDetail: ApplicationExpenseDetailView
}

export function ExpensePassengerOverview({
  applicationId,
  selectedRow,
  expenseDetail,
}: ExpensePassengerOverviewProps) {
  const assignmentRecord = useMemo(
    () => findAssignmentRecord(applicationId, selectedRow, expenseDetail.customerSegment),
    [applicationId, selectedRow, expenseDetail.customerSegment],
  )

  const portal = useMemo(
    () => resolvePortalDates(applicationId, selectedRow),
    [applicationId, selectedRow],
  )

  const basicDetails = useMemo(() => resolveApplicantBasicDetails(selectedRow), [selectedRow])

  const rollupLabel = useMemo(() => {
    if (!assignmentRecord) return expenseDetail.applicationStatus || '—'
    const siblings = operationalPassengerAssignmentService
      .list(expenseDetail.customerSegment)
      .filter(row => row.gltsApplicationId === applicationId)
    return rollupStatusLabel[rollupApplicationStatus(siblings)]
  }, [assignmentRecord, expenseDetail.customerSegment, expenseDetail.applicationStatus, applicationId])

  const companyName = assignmentRecord?.companyName || expenseDetail.companyName
  const bookerName = assignmentRecord?.bookerName || ''
  const countryVisa = assignmentRecord
    ? `${assignmentRecord.country} · ${assignmentRecord.visaType}`
    : `${expenseDetail.visaCountry} · ${expenseDetail.visaType}`
  const jurisdiction = assignmentRecord?.jurisdiction || expenseDetail.jurisdiction
  const travelDate = assignmentRecord?.travelDate || expenseDetail.travelDate
  const phone =
    assignmentRecord?.passengerPhone || basicDetails.phoneNumber || selectedRow.basicDetails?.phoneNumber || ''
  const email =
    assignmentRecord?.passengerEmail || basicDetails.email || selectedRow.basicDetails?.email || ''
  const processingStage = assignmentRecord?.processingStage || expenseDetail.applicationStatus || ''

  const allocatedBy = assignmentRecord ? resolveAllocatedBy(assignmentRecord) : ''
  const allocatedTo = assignmentRecord
    ? resolveAllocatedTo(assignmentRecord)
    : [expenseDetail.assignedUser, expenseDetail.assignedTeam].filter(Boolean).join(' · ')
  const operationalDate = assignmentRecord?.operationalDate || ''
  const remarks = assignmentRecord?.operationalRemarks?.trim() || ''
  const attachmentNames = assignmentRecord?.attachmentNames ?? []

  return (
    <Stack spacing={2}>
      <Stack spacing={1.25}>
        <SectionHeading>Passenger & application context</SectionHeading>
        <ContextCard>
          <ContextCardSection>
            <ContextGroup title="Passenger details">
              <MetaGrid>
                <ContextMetaItem label="Passport" value={selectedRow.passportNo} mono />
                <ContextMetaItem label="Sequence" value={String(selectedRow.sequenceNo)} mono />
                <ContextMetaItem label="Phone number" value={phone} />
                <ContextMetaItem label="Email address" value={email} />
                <ContextMetaItem label="Company" value={companyName} />
                <ContextMetaItem label="Booker" value={bookerName} />
                <ContextMetaItem label="Country / visa" value={countryVisa} />
                <ContextMetaItem label="Jurisdiction" value={jurisdiction} />
                <ContextMetaItem label="Travel date" value={formatDisplayDate(travelDate)} />
                <ContextMetaItem label="Processing stage" value={processingStage} />
              </MetaGrid>
            </ContextGroup>
          </ContextCardSection>

          <ContextCardSection>
            <ContextGroup title="Operations">
              <MetaGrid>
                <ContextMetaItem label="Allocated by" value={allocatedBy} />
                <ContextMetaItem label="Allocated to" value={allocatedTo} />
                <ContextMetaItem
                  label="Operational date"
                  value={formatDisplayDate(operationalDate)}
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
                  value={formatDisplayDate(
                    portal.onlineSubmissionDate ||
                      assignmentRecord?.submissionDate ||
                      expenseDetail.submissionDate,
                  )}
                />
                <ContextMetaItem label="Online Submitted By" value={portal.submittedBy} />
                <ContextMetaItem
                  label="VFS Submission Date"
                  value={formatDisplayDate(portal.vfsSubmissionDate)}
                />
                <ContextMetaItem
                  label="Tentative Collection Date"
                  value={formatDisplayDate(portal.tentativeCollectionDate)}
                />
                <ContextMetaItem
                  label="Collection Date"
                  value={formatDisplayDate(portal.collectionDate)}
                />
                <ContextMetaItem
                  label="Submission status"
                  value={
                    assignmentRecord?.submissionStatus ||
                    portal.submissionStatus ||
                    expenseDetail.applicationStatus
                  }
                />
              </MetaGrid>
            </ContextGroup>
          </ContextCardSection>
        </ContextCard>
      </Stack>

      <Divider />

      <Stack spacing={1.25}>
        <SectionHeading>Document vault</SectionHeading>
        <PassengerApplicationDocumentVault
          applicationId={applicationId}
          gltsApplicantId={selectedRow.gltsApplicantId}
          sequenceNo={selectedRow.sequenceNo}
        />
        <AssignmentOperationalAttachments attachmentNames={attachmentNames} />
      </Stack>

      <Divider />

      <Stack spacing={1.25}>
        <SectionHeading>Notes & remarks</SectionHeading>
        <Typography variant="body2" sx={{ fontSize: 13, whiteSpace: 'pre-wrap' }}>
          {remarks || '—'}
        </Typography>
      </Stack>
    </Stack>
  )
}
