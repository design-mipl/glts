import { useEffect, useState } from 'react'
import { Stack } from '@mui/material'
import { Button, FormField, Input, Modal, Select, Textarea } from '@/design-system/UIComponents'
import type { OperationalPassengerRow, PassengerOperationalStatus } from '@/shared/types/operationalPassengerAssignment'
import { ASSIGNMENT_CITY_TEAMS } from '@/shared/types/operationalPassengerAssignment'
import { ASSIGNMENT_PRIORITY_OPTIONS } from '../config/assignmentPriorityConfig'
import { PASSENGER_STATUS_OPTIONS } from '../config/assignmentStatusConfig'
import type { AssignmentAdminAction, DeskPassengerAction } from './AssignmentActionMenu'

export type AssignmentActionPayload =
  | { action: 'assign_user'; team: string; user: string }
  | { action: 'change_priority'; priority: string }
  | { action: 'update_status'; status: PassengerOperationalStatus }
  | { action: 'reassign'; team: string; user: string }
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
  assign_user: 'Assign user',
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

export function AssignmentActionModal({
  open,
  action,
  record,
  onClose,
  onConfirm,
}: AssignmentActionModalProps) {
  const [priority, setPriority] = useState('Medium')
  const [team, setTeam] = useState('Mumbai Team')
  const [user, setUser] = useState('')
  const [status, setStatus] = useState<PassengerOperationalStatus>('In Progress')
  const [notes, setNotes] = useState('')
  const [fileName, setFileName] = useState('')

  useEffect(() => {
    if (!record) return
    setPriority(record.priority)
    setTeam(record.assignedTeam || 'Mumbai Team')
    setUser(record.assignedUser)
    setStatus(record.passengerStatus)
    setNotes('')
    setFileName('')
  }, [record, action])

  if (!action || !record) return null

  const title = ACTION_TITLES[action] ?? 'Update record'
  const subtitle = `${record.passengerName} · ${record.gltsApplicationId}`

  const handleConfirm = () => {
    switch (action) {
      case 'assign_user':
        onConfirm({ action, team, user })
        break
      case 'change_priority':
        onConfirm({ action, priority })
        break
      case 'update_status':
        onConfirm({ action, status })
        break
      case 'reassign':
        onConfirm({ action: 'reassign', team, user })
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

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      subtitle={subtitle}
      size="sm"
      footer={
        <Stack direction="row" spacing={1} justifyContent="flex-end">
          <Button label="Cancel" variant="outlined" onClick={onClose} />
          <Button label="Confirm" onClick={handleConfirm} />
        </Stack>
      }
    >
      <Stack spacing={1.5} sx={{ pt: 0.5 }}>
        {action === 'assign_user' || action === 'reassign' ? (
          <>
            <FormField label="Team">
              <Select value={team} onChange={v => setTeam(String(v))} options={TEAM_OPTIONS} size="sm" fullWidth />
            </FormField>
            <FormField label="Assigned user">
              <Select value={user} onChange={v => setUser(String(v))} options={EXECUTIVE_OPTIONS} size="sm" fullWidth />
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
