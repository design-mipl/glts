import { useState, type ReactNode } from 'react'
import { Box, Collapse, Stack, Typography } from '@mui/material'
import { ChevronDown } from 'lucide-react'
import { Badge, Drawer } from '@/design-system/UIComponents'
import type { OperationalPassengerRow } from '@/shared/types/operationalPassengerAssignment'
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

const DETAIL_DRAWER_WIDTH = 560

interface AssignmentPassengerDetailDrawerProps {
  open: boolean
  record: OperationalPassengerRow | null
  segmentConfig: AssignmentSegmentConfig
  onClose: () => void
}

interface AccordionSectionProps {
  title: string
  defaultOpen?: boolean
  children: ReactNode
}

function AccordionSection({ title, defaultOpen = false, children }: AccordionSectionProps) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 1.5, overflow: 'hidden' }}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        onClick={() => setOpen(v => !v)}
        sx={{ px: 1.25, py: 0.9, cursor: 'pointer', bgcolor: 'action.hover' }}
      >
        <Typography variant="body2" fontWeight={600} sx={{ fontSize: 12 }}>
          {title}
        </Typography>
        <ChevronDown
          size={16}
          style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }}
        />
      </Stack>
      <Collapse in={open}>
        <Box sx={{ px: 1.25, py: 1.25 }}>{children}</Box>
      </Collapse>
    </Box>
  )
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

  const siblings = operationalPassengerAssignmentService.list(segmentConfig.segment).filter(
    r => r.gltsApplicationId === record.gltsApplicationId,
  )
  const rollup = rollupApplicationStatus(siblings)

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title={record.passengerName}
      subtitle={`${record.gltsApplicationId} · ${record.gltsApplicantId}`}
      width={DETAIL_DRAWER_WIDTH}
    >
      <Stack spacing={1.25}>
        <Stack direction="row" spacing={0.75} flexWrap="wrap" useFlexGap>
          <Badge label={passengerStatusLabel[record.passengerStatus]} color={passengerStatusBadgeColor(record.passengerStatus)} />
          <Badge label={assignmentPriorityLabel[record.priority]} color={assignmentPriorityBadgeColor(record.priority)} />
          {record.carryForward ? <Badge label="Carry forward" color="warning" /> : null}
          {record.escalated ? <Badge label="Escalated" color="error" /> : null}
          <Badge label={formatSlaTimer(record)} color={isSlaAtRisk(record) ? 'error' : 'neutral'} />
        </Stack>

        <AccordionSection title="Passenger details" defaultOpen>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.25 }}>
            <ReadField label="Passenger name" value={record.passengerName} />
            <ReadField label="Passport" value={record.passportNo} />
            <ReadField label="Applicant ID" value={record.gltsApplicantId} />
            <ReadField label="Sequence" value={String(record.sequenceNo)} />
            <ReadField label="Travel date" value={record.travelDate} />
            <ReadField label="Processing stage" value={record.processingStage} />
          </Box>
        </AccordionSection>

        <AccordionSection title="Application details">
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.25 }}>
            <ReadField label="Application ID" value={record.gltsApplicationId} />
            <ReadField label="Record type" value={record.recordType} />
            <ReadField label="Country / visa" value={`${record.country} · ${record.visaType}`} />
            <ReadField label="Jurisdiction" value={record.jurisdiction} />
            <ReadField label="Submission status" value={record.submissionStatus} />
            <ReadField label="Submission date" value={record.submissionDate} />
            <ReadField label="Application roll-up" value={rollupStatusLabel[rollup]} />
            <Stack spacing={0.2}>
              <Typography variant="caption" color="text.secondary" fontWeight={600}>
                Roll-up badge
              </Typography>
              <Box>
                <Badge label={rollupStatusLabel[rollup]} color={rollupStatusBadgeColor(rollup)} />
              </Box>
            </Stack>
          </Box>
        </AccordionSection>

        <AccordionSection title="Company details">
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.25 }}>
            <ReadField label="Company" value={record.companyName} />
            <ReadField label="Booker" value={record.bookerName} />
            <ReadField label="Created by" value={record.createdByEmail} />
          </Box>
        </AccordionSection>

        <AccordionSection title="Assignment history">
          {record.assignmentHistory.length === 0 ? (
            <Typography variant="caption" color="text.secondary">
              No assignment history yet.
            </Typography>
          ) : (
            <Stack spacing={1}>
              {record.assignmentHistory.map(entry => (
                <Box key={entry.id} sx={{ p: 1, borderRadius: 1, bgcolor: 'action.hover' }}>
                  <Typography variant="body2" fontWeight={600} sx={{ fontSize: 12 }}>
                    {entry.assignedUser || '—'} · {entry.assignedTeam || 'Unassigned'}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(entry.occurredAt).toLocaleString('en-GB')} · {entry.assignedBy}
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
        </AccordionSection>

        <AccordionSection title="Operational timeline">
          <AssignmentTimeline events={record.timeline} />
        </AccordionSection>

        <AccordionSection title="SLA timeline">
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.25 }}>
            <ReadField label="SLA due" value={new Date(record.slaDueAt).toLocaleString('en-GB')} />
            <ReadField label="Operational date" value={record.operationalDate} />
            <ReadField label="Time remaining" value={formatSlaTimer(record)} />
            <ReadField label="Last updated" value={new Date(record.lastUpdated).toLocaleString('en-GB')} />
          </Box>
        </AccordionSection>

        <AccordionSection title="Notes & remarks">
          <Typography variant="body2" sx={{ fontSize: 12, whiteSpace: 'pre-wrap' }}>
            {record.operationalRemarks || '—'}
          </Typography>
        </AccordionSection>

        <AccordionSection title="Uploaded operational documents">
          {record.attachmentNames.length === 0 ? (
            <Typography variant="caption" color="text.secondary">
              No documents uploaded.
            </Typography>
          ) : (
            <Stack spacing={0.5}>
              {record.attachmentNames.map(name => (
                <Typography key={name} variant="body2" sx={{ fontSize: 12 }}>
                  {name}
                </Typography>
              ))}
            </Stack>
          )}
        </AccordionSection>

        <AccordionSection title="Submission history">
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.25 }}>
            <ReadField label="Submitted" value={record.submissionDate} />
            <ReadField
              label="Invoice status"
              value={record.invoiceStatus ? invoiceStatusLabel[record.invoiceStatus] : '—'}
            />
            {record.invoiceStatus ? (
              <Stack spacing={0.2}>
                <Typography variant="caption" color="text.secondary" fontWeight={600}>
                  Invoice badge
                </Typography>
                <Box>
                  <Badge
                    label={invoiceStatusLabel[record.invoiceStatus]}
                    color={invoiceStatusBadgeColor(record.invoiceStatus)}
                  />
                </Box>
              </Stack>
            ) : null}
          </Box>
        </AccordionSection>
      </Stack>
    </Drawer>
  )
}
