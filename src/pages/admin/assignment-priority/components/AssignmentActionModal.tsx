import { useEffect, useMemo, useState } from 'react'
import { Stack } from '@mui/material'
import { Button, FormField, Input, Modal, Select, Textarea } from '@/design-system/UIComponents'
import { vendorService } from '@/shared/services/vendorService'
import type {
  AssignmentAssigneeType,
  OperationalPassengerRow,
  PassengerOperationalStatus,
} from '@/shared/types/operationalPassengerAssignment'
import { ASSIGNMENT_CITY_TEAMS } from '@/shared/types/operationalPassengerAssignment'
import { ASSIGN_USER_VENDOR_ACTION_LABEL } from '../config/assignmentActionConfig'
import { ASSIGNMENT_PRIORITY_OPTIONS } from '../config/assignmentPriorityConfig'
import { PASSENGER_STATUS_OPTIONS } from '../config/assignmentStatusConfig'
import type { AssignmentAdminAction, DeskPassengerAction } from './AssignmentActionMenu'
import { AssignmentAssigneeTypeToggle } from './AssignmentAssigneeTypeToggle'

export type AssignmentActionPayload =
  | {
      action: 'assign_user'
      assigneeType: AssignmentAssigneeType
      team: string
      user: string
      vendor: string
      priority: string
      passengerPhone?: string
      passengerEmail?: string
    }
  | { action: 'change_priority'; priority: string }
  | { action: 'update_status'; status: PassengerOperationalStatus }
  | {
      action: 'reassign'
      assigneeType: AssignmentAssigneeType
      team: string
      user: string
      vendor: string
      priority: string
      passengerPhone?: string
      passengerEmail?: string
    }
  | { action: 'add_notes'; notes: string }
  | { action: 'move_next_date' }
  | { action: 'upload_proof'; fileName: string }
  | { action: 'mark_complete' }
  | { action: 'escalate' }

type ModalAction = AssignmentAdminAction | DeskPassengerAction

interface AssignmentActionModalProps {
  open: boolean
  action: ModalAction | null
  record: OperationalPassengerRow | null
  onClose: () => void
  onConfirm: (payload: AssignmentActionPayload) => void
}

const ACTION_TITLES: Partial<Record<ModalAction, string>> = {
  assign_user: ASSIGN_USER_VENDOR_ACTION_LABEL,
  change_priority: 'Change priority',
  update_status: 'Update status',
  reassign: 'Reassign passenger',
  add_notes: 'Add operational notes',
  move_next_date: 'Move to next operational date',
  upload_proof: 'Upload operational proof',
  mark_complete: 'Mark operational completion',
  escalate: 'Escalate issue',
}

const TEAM_OPTIONS = ASSIGNMENT_CITY_TEAMS.map(t => ({ value: t, label: t }))

const EXECUTIVE_OPTIONS = [
  { value: 'Sneha Patel', label: 'Sneha Patel' },
  { value: 'Arun Krishnan', label: 'Arun Krishnan' },
  { value: 'Karan Mehta', label: 'Karan Mehta' },
  { value: 'Rajan Mehta', label: 'Rajan Mehta' },
]

function inferAssigneeType(record: OperationalPassengerRow): AssignmentAssigneeType {
  if (record.assigneeType) return record.assigneeType
  if (record.assignedVendor) return 'vendor'
  if (!record.assignedTeam && record.assignedUser) return 'vendor'
  return 'user'
}

export function AssignmentActionModal({
  open,
  action,
  record,
  onClose,
  onConfirm,
}: AssignmentActionModalProps) {
  const [assigneeType, setAssigneeType] = useState<AssignmentAssigneeType>('user')
  const [priority, setPriority] = useState('Medium')
  const [team, setTeam] = useState('Mumbai Team')
  const [user, setUser] = useState('')
  const [vendor, setVendor] = useState('')
  const [passengerPhone, setPassengerPhone] = useState('')
  const [passengerEmail, setPassengerEmail] = useState('')
  const [status, setStatus] = useState<PassengerOperationalStatus>('In Progress')
  const [notes, setNotes] = useState('')
  const [fileName, setFileName] = useState('')

  const vendorOptions = useMemo(
    () =>
      vendorService.list({ status: 'active' }).map(row => ({
        value: row.vendorName,
        label: row.vendorName,
      })),
    [],
  )

  useEffect(() => {
    if (!record) return
    const nextAssigneeType = inferAssigneeType(record)
    setAssigneeType(nextAssigneeType)
    setPriority(record.priority)
    setTeam(record.assignedTeam || 'Mumbai Team')
    setUser(record.assignedUser || '')
    setVendor(record.assignedVendor || (nextAssigneeType === 'vendor' ? record.assignedUser : ''))
    setPassengerPhone(record.passengerPhone === '—' ? '' : record.passengerPhone)
    setPassengerEmail(record.passengerEmail === '—' ? '' : record.passengerEmail)
    setStatus(record.passengerStatus)
    setNotes('')
    setFileName('')
  }, [record, action])

  if (!action || !record) return null

  const title = ACTION_TITLES[action] ?? 'Update record'
  const subtitle = `${record.passengerName} · ${record.gltsApplicationId}`
  const isAssigneeAction = action === 'assign_user' || action === 'reassign'
  const canConfirmAssignee =
    assigneeType === 'vendor'
      ? Boolean(vendor.trim() && user.trim())
      : assigneeType === 'passenger'
        ? Boolean(user.trim() && passengerPhone.trim() && passengerEmail.trim())
        : Boolean(user.trim())

  const handleConfirm = () => {
    const passengerContact =
      assigneeType === 'passenger'
        ? { passengerPhone: passengerPhone.trim(), passengerEmail: passengerEmail.trim() }
        : {}

    switch (action) {
      case 'assign_user':
        onConfirm({ action, assigneeType, team, user, vendor, priority, ...passengerContact })
        break
      case 'change_priority':
        onConfirm({ action, priority })
        break
      case 'update_status':
        onConfirm({ action, status })
        break
      case 'reassign':
        onConfirm({ action: 'reassign', assigneeType, team, user, vendor, priority, ...passengerContact })
        break
      case 'add_notes':
        onConfirm({ action, notes })
        break
      case 'move_next_date':
        onConfirm({ action: 'move_next_date' })
        break
      case 'upload_proof':
        onConfirm({ action, fileName: fileName.trim() || 'operational-proof.pdf' })
        break
      case 'mark_complete':
        onConfirm({ action: 'mark_complete' })
        break
      case 'escalate':
        onConfirm({ action: 'escalate' })
        break
    }
  }

  const needsForm =
    action === 'assign_user' ||
    action === 'change_priority' ||
    action === 'update_status' ||
    action === 'reassign' ||
    action === 'add_notes' ||
    action === 'upload_proof'

  const showTeamUserFields =
    assigneeType === 'user' || assigneeType === 'vendor' || assigneeType === 'passenger'

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      subtitle={subtitle}
      size="sm"
      footer={
        <Stack direction="row" spacing={1} justifyContent="flex-end">
          <Button label="Cancel" variant="neutral" onClick={onClose} />
          <Button
            label="Confirm"
            onClick={handleConfirm}
            disabled={isAssigneeAction ? !canConfirmAssignee : false}
          />
        </Stack>
      }
    >
      <Stack spacing={1.5} sx={{ pt: 0.5 }}>
        {isAssigneeAction ? (
          <>
            <AssignmentAssigneeTypeToggle value={assigneeType} onChange={setAssigneeType} />

            {assigneeType === 'passenger' ? (
              <>
                <FormField label="Phone number">
                  <Input
                    value={passengerPhone}
                    onChange={setPassengerPhone}
                    placeholder="Enter phone number"
                    size="sm"
                  />
                </FormField>
                <FormField label="Email address">
                  <Input
                    value={passengerEmail}
                    onChange={setPassengerEmail}
                    placeholder="Enter email address"
                    size="sm"
                  />
                </FormField>
              </>
            ) : null}

            {assigneeType === 'vendor' ? (
              <FormField label="Vendor">
                <Select
                  value={vendor}
                  onChange={v => setVendor(String(v))}
                  options={vendorOptions}
                  placeholder="Select vendor"
                  size="sm"
                  fullWidth
                />
              </FormField>
            ) : null}

            {showTeamUserFields ? (
              <>
                <FormField label="Team">
                  <Select value={team} onChange={v => setTeam(String(v))} options={TEAM_OPTIONS} size="sm" fullWidth />
                </FormField>
                <FormField label="User">
                  <Select
                    value={user}
                    onChange={v => setUser(String(v))}
                    options={EXECUTIVE_OPTIONS}
                    placeholder="Select user"
                    size="sm"
                    fullWidth
                  />
                </FormField>
              </>
            ) : null}

            <FormField label="Priority">
              <Select
                value={priority}
                onChange={v => setPriority(String(v))}
                options={ASSIGNMENT_PRIORITY_OPTIONS}
                size="sm"
                fullWidth
              />
            </FormField>
          </>
        ) : null}
        {action === 'change_priority' ? (
          <FormField label="Priority">
            <Select
              value={priority}
              onChange={v => setPriority(String(v))}
              options={ASSIGNMENT_PRIORITY_OPTIONS}
              size="sm"
              fullWidth
            />
          </FormField>
        ) : null}
        {action === 'update_status' ? (
          <FormField label="Operational status">
            <Select
              value={status}
              onChange={v => setStatus(String(v) as PassengerOperationalStatus)}
              options={PASSENGER_STATUS_OPTIONS}
              size="sm"
              fullWidth
            />
          </FormField>
        ) : null}
        {action === 'add_notes' ? (
          <FormField label="Operational remarks">
            <Textarea value={notes} onChange={setNotes} rows={4} placeholder="Add operational note…" />
          </FormField>
        ) : null}
        {action === 'upload_proof' ? (
          <FormField label="Document name" helperText="Mock upload — file name will be stored on the record.">
            <Input value={fileName} onChange={setFileName} placeholder="e.g. vfs-receipt.pdf" size="sm" />
          </FormField>
        ) : null}
        {!needsForm && action !== 'mark_complete' && action !== 'escalate' ? (
          <Stack spacing={0.5}>
            This will move the passenger to the next operational date and mark as carry forward.
          </Stack>
        ) : null}
        {action === 'mark_complete' ? (
          <Stack spacing={0.5}>Mark this passenger operational work as completed.</Stack>
        ) : null}
        {action === 'escalate' ? (
          <Stack spacing={0.5}>Escalate to urgent priority and flag for supervisor visibility.</Stack>
        ) : null}
      </Stack>
    </Modal>
  )
}
