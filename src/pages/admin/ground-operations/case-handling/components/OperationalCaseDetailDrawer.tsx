import { useEffect, useState } from 'react'
import { Box, Divider, Stack, Typography } from '@mui/material'
import {
  Badge,
  Button,
  Drawer,
  FormField,
  Input,
  Tabs,
  Textarea,
} from '@/design-system/UIComponents'
import type { OperationalCase } from '@/shared/types/operationalCaseHandling'
import { operationalCaseHandlingService } from '@/shared/services/operationalCaseHandlingService'
import { priorityBadgeColor, statusBadgeColor, formatJoiningDate } from '../utils/operationalCaseHandlingUtils'
import { GroundServicesChecklist } from './GroundServicesChecklist'
import { OperationalTimeline } from './OperationalTimeline'
import { OperationalDocumentVault } from './OperationalDocumentVault'

const DETAIL_DRAWER_WIDTH = 560

type DetailTab = 'overview' | 'services' | 'operations' | 'timeline'

const DETAIL_TABS = [
  { label: 'Overview & Documents', value: 'overview' },
  { label: 'Services & Expenses', value: 'services' },
  { label: 'Operations', value: 'operations' },
  { label: 'Timeline', value: 'timeline' },
] as const

interface OperationalCaseDetailDrawerProps {
  open: boolean
  record: OperationalCase | null
  onClose: () => void
  onUpdated: () => void
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

function OperationalCaseDetailContent({
  record,
  onUpdated,
}: {
  record: OperationalCase
  onUpdated: () => void
}) {
  const [activeTab, setActiveTab] = useState<DetailTab>('overview')
  const [remarks, setRemarks] = useState(record.remarks)
  const [biometrics, setBiometrics] = useState(record.biometricsScheduled ?? '')
  const [vfsStatus, setVfsStatus] = useState(record.vfsStatus ?? '')
  const [passportStatus, setPassportStatus] = useState(record.passportCollectionStatus ?? '')

  useEffect(() => {
    setActiveTab('overview')
  }, [record.id])

  useEffect(() => {
    setRemarks(record.remarks)
    setBiometrics(record.biometricsScheduled ?? '')
    setVfsStatus(record.vfsStatus ?? '')
    setPassportStatus(record.passportCollectionStatus ?? '')
  }, [record.id, record.remarks, record.biometricsScheduled, record.vfsStatus, record.passportCollectionStatus])

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
            <Stack spacing={1.25}>
              <SectionHeading>VFS & application fees</SectionHeading>
              <GroundServicesChecklist
                services={record.applicationFees}
                readOnly={false}
                onServiceChange={(feeId, patch) => {
                  operationalCaseHandlingService.updateApplicationFee(record.id, feeId, patch)
                  onUpdated()
                }}
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
              <SectionHeading>Biometrics coordination</SectionHeading>
              <FormField label="Schedule">
                <Input
                  size="sm"
                  value={biometrics}
                  onChange={setBiometrics}
                  placeholder="e.g. 12 Jun 2026 · 14:30 · VFS Mumbai"
                />
              </FormField>
              <Box>
                <Button
                  label="Save biometrics schedule"
                  size="sm"
                  onClick={() => {
                    operationalCaseHandlingService.updateBiometrics(record.id, biometrics)
                    onUpdated()
                  }}
                />
              </Box>
            </Stack>

            <Divider />

            <Stack spacing={1.25}>
              <SectionHeading>VFS support</SectionHeading>
              <FormField label="VFS status">
                <Input
                  size="sm"
                  value={vfsStatus}
                  onChange={setVfsStatus}
                  placeholder="e.g. Appointment confirmed · 14 Jun · VFS Mumbai"
                />
              </FormField>
              <Box>
                <Button
                  label="Update VFS status"
                  size="sm"
                  onClick={() => {
                    operationalCaseHandlingService.updateVfsStatus(record.id, vfsStatus)
                    onUpdated()
                  }}
                />
              </Box>
            </Stack>

            <Divider />

            <Stack spacing={1.25}>
              <SectionHeading>Passport collection</SectionHeading>
              <FormField label="Collection status">
                <Input
                  size="sm"
                  value={passportStatus}
                  onChange={setPassportStatus}
                  placeholder="e.g. Awaiting embassy return · Collected from VFS"
                />
              </FormField>
              <Box>
                <Button
                  label="Update passport status"
                  size="sm"
                  onClick={() => {
                    operationalCaseHandlingService.updatePassportCollection(record.id, passportStatus)
                    onUpdated()
                  }}
                />
              </Box>
            </Stack>

            <Divider />

            <Stack spacing={1.25}>
              <SectionHeading>Remarks</SectionHeading>
              <FormField label="Operational remarks">
                <Textarea
                  rows={3}
                  value={remarks}
                  onChange={setRemarks}
                  placeholder="Coordination notes, courier updates, client instructions, or follow-up actions"
                />
              </FormField>
              <Box>
                <Button
                  label="Save remarks"
                  variant="outlined"
                  size="sm"
                  onClick={() => {
                    operationalCaseHandlingService.updateRemarks(record.id, remarks)
                    onUpdated()
                  }}
                />
              </Box>
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
}: OperationalCaseDetailDrawerProps) {
  if (!record) return null

  const showCompleteFooter = record.status !== 'Completed'

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
      footer={
        showCompleteFooter ? (
          <Button
            label="Mark completed"
            fullWidth
            onClick={() => {
              operationalCaseHandlingService.markCompleted(record.id)
              onUpdated()
            }}
          />
        ) : undefined
      }
    >
      <OperationalCaseDetailContent record={record} onUpdated={onUpdated} />
    </Drawer>
  )
}
