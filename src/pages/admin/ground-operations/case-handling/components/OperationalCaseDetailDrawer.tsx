import { useEffect, useState, type ReactNode } from 'react'
import { Box, Collapse, Stack, Typography } from '@mui/material'
import { ChevronDown } from 'lucide-react'
import {
  Badge,
  Button,
  Drawer,
  FormField,
  Input,
  Textarea,
} from '@/design-system/UIComponents'
import type { OperationalCase } from '@/shared/types/operationalCaseHandling'
import { operationalCaseHandlingService } from '@/shared/services/operationalCaseHandlingService'
import { priorityBadgeColor, statusBadgeColor } from '../utils/operationalCaseHandlingUtils'
import { GroundServicesChecklist } from './GroundServicesChecklist'
import { OperationalTimeline } from './OperationalTimeline'

const DETAIL_DRAWER_WIDTH = 560

interface OperationalCaseDetailDrawerProps {
  open: boolean
  record: OperationalCase | null
  mode: 'priority_queue' | 'operations_desk'
  onClose: () => void
  onUpdated: () => void
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

function OperationalCaseDetailContent({
  record,
  mode,
  onUpdated,
}: {
  record: OperationalCase
  mode: 'priority_queue' | 'operations_desk'
  onUpdated: () => void
}) {
  const [remarks, setRemarks] = useState(record.remarks)
  const [biometrics, setBiometrics] = useState(record.biometricsScheduled ?? '')
  const [vfsStatus, setVfsStatus] = useState(record.vfsStatus ?? '')
  const [passportStatus, setPassportStatus] = useState(record.passportCollectionStatus ?? '')
  const [extraServiceName, setExtraServiceName] = useState('')
  const [extraAmount, setExtraAmount] = useState('')

  useEffect(() => {
    setRemarks(record.remarks)
    setBiometrics(record.biometricsScheduled ?? '')
    setVfsStatus(record.vfsStatus ?? '')
    setPassportStatus(record.passportCollectionStatus ?? '')
    setExtraServiceName('')
    setExtraAmount('')
  }, [record.id, record.remarks, record.biometricsScheduled, record.vfsStatus, record.passportCollectionStatus])

  const isDesk = mode === 'operations_desk'

  return (
    <Stack spacing={1.5}>
      <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
        <Badge label={record.priority} color={priorityBadgeColor(record.priority)} size="sm" />
        <Badge label={record.status} color={statusBadgeColor(record.status)} size="sm" />
        {record.carryForward ? (
          <Badge label="Moved to Next Day" color="warning" size="sm" />
        ) : null}
      </Stack>

      <Stack spacing={1}>
        <AccordionSection title="Application overview" defaultOpen>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
            <ReadField label="Country" value={record.country} />
            <ReadField label="Visa type" value={record.visaType} />
            <ReadField label="Applicants" value={String(record.applicantCount)} />
            <ReadField label="Assigned team" value={record.assignedTeam} />
            <ReadField label="Executive" value={record.assignedExecutive} />
            <ReadField label="Expense summary" value={record.expenseSummary} />
          </Box>
        </AccordionSection>

        <AccordionSection title="Ground services" defaultOpen={isDesk}>
          <GroundServicesChecklist
            services={record.groundServices}
            readOnly={!isDesk}
            onServiceChange={(serviceId, patch) => {
              operationalCaseHandlingService.updateGroundService(record.id, serviceId, patch)
              onUpdated()
            }}
          />
        </AccordionSection>

        <AccordionSection title="Biometrics coordination">
          {isDesk ? (
            <Stack spacing={1}>
              <FormField label="Schedule">
                <Input
                  size="sm"
                  value={biometrics}
                  onChange={setBiometrics}
                  placeholder="Date · time · location"
                />
              </FormField>
              <Button
                label="Save biometrics schedule"
                size="sm"
                onClick={() => {
                  operationalCaseHandlingService.updateBiometrics(record.id, biometrics)
                  onUpdated()
                }}
              />
            </Stack>
          ) : (
            <ReadField label="Scheduled" value={record.biometricsScheduled ?? '—'} />
          )}
        </AccordionSection>

        <AccordionSection title="VFS support">
          {isDesk ? (
            <Stack spacing={1}>
              <FormField label="VFS status">
                <Input size="sm" value={vfsStatus} onChange={setVfsStatus} />
              </FormField>
              <Button
                label="Update VFS status"
                size="sm"
                onClick={() => {
                  operationalCaseHandlingService.updateVfsStatus(record.id, vfsStatus)
                  onUpdated()
                }}
              />
            </Stack>
          ) : (
            <ReadField label="Status" value={record.vfsStatus ?? '—'} />
          )}
        </AccordionSection>

        <AccordionSection title="Passport collection">
          {isDesk ? (
            <Stack spacing={1}>
              <FormField label="Collection status">
                <Input size="sm" value={passportStatus} onChange={setPassportStatus} />
              </FormField>
              <Button
                label="Update passport status"
                size="sm"
                onClick={() => {
                  operationalCaseHandlingService.updatePassportCollection(record.id, passportStatus)
                  onUpdated()
                }}
              />
            </Stack>
          ) : (
            <ReadField label="Status" value={record.passportCollectionStatus ?? '—'} />
          )}
        </AccordionSection>

        <AccordionSection title="Expenses & services">
          <Stack spacing={1}>
            {record.expenses.length === 0 ? (
              <Typography variant="caption" color="text.secondary">
                No extra expenses recorded.
              </Typography>
            ) : (
              record.expenses.map(exp => (
                <Box
                  key={exp.id}
                  sx={{ p: 1, borderRadius: 1, border: 1, borderColor: 'divider' }}
                >
                  <Typography variant="body2" fontWeight={600} sx={{ fontSize: 12 }}>
                    {exp.serviceName}
                    {exp.isExtra ? ' (extra)' : ''}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    ₹{exp.prefilledAmount} → ₹{exp.actualAmount}
                    {exp.remarks ? ` · ${exp.remarks}` : ''}
                  </Typography>
                </Box>
              ))
            )}
            {isDesk ? (
              <Stack spacing={1} sx={{ pt: 0.5 }}>
                <FormField label="Extra service name">
                  <Input size="sm" value={extraServiceName} onChange={setExtraServiceName} />
                </FormField>
                <FormField label="Amount">
                  <Input size="sm" type="number" value={extraAmount} onChange={setExtraAmount} />
                </FormField>
                <Button
                  label="Add extra service / expense"
                  variant="outlined"
                  size="sm"
                  onClick={() => {
                    if (!extraServiceName.trim()) return
                    const amount = Number(extraAmount) || 0
                    operationalCaseHandlingService.addExpense(record.id, {
                      serviceName: extraServiceName.trim(),
                      prefilledAmount: amount,
                      actualAmount: amount,
                      isExtra: true,
                    })
                    setExtraServiceName('')
                    setExtraAmount('')
                    onUpdated()
                  }}
                />
              </Stack>
            ) : null}
          </Stack>
        </AccordionSection>

        <AccordionSection title="Operational timeline">
          <OperationalTimeline events={record.timeline} />
        </AccordionSection>

        <AccordionSection title="Remarks & attachments">
          {isDesk ? (
            <Stack spacing={1}>
              <FormField label="Remarks">
                <Textarea rows={3} value={remarks} onChange={setRemarks} />
              </FormField>
              <Button
                label="Save remarks"
                variant="outlined"
                size="sm"
                onClick={() => {
                  operationalCaseHandlingService.updateRemarks(record.id, remarks)
                  onUpdated()
                }}
              />
            </Stack>
          ) : (
            <ReadField label="Remarks" value={record.remarks} />
          )}
          {record.attachmentNames.length > 0 ? (
            <Stack spacing={0.5} sx={{ mt: 1 }}>
              {record.attachmentNames.map(name => (
                <Typography key={name} variant="caption" color="primary.main">
                  {name}
                </Typography>
              ))}
            </Stack>
          ) : null}
        </AccordionSection>
      </Stack>
    </Stack>
  )
}

export function OperationalCaseDetailDrawer({
  open,
  record,
  mode,
  onClose,
  onUpdated,
}: OperationalCaseDetailDrawerProps) {
  if (!record) return null

  const isDesk = mode === 'operations_desk'
  const showCompleteFooter = isDesk && record.status !== 'Completed'

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title={record.applicationId}
      subtitle={record.companyName}
      width={DETAIL_DRAWER_WIDTH}
      bodyVariant="default"
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
      <OperationalCaseDetailContent record={record} mode={mode} onUpdated={onUpdated} />
    </Drawer>
  )
}
