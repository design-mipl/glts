import { useEffect, useState } from 'react'
import { Stack, Typography } from '@mui/material'
import { Button, FormField, Input, Modal, Select } from '@/design-system/UIComponents'
import type { OperationalCase, OperationalCasePriority } from '@/shared/types/operationalCaseHandling'
import { CITY_TEAMS, OPERATIONAL_CASE_PRIORITIES } from '@/shared/types/operationalCaseHandling'
import type { AdminCaseAction } from './OperationalCaseActionMenu'

interface OperationalCaseActionModalProps {
  open: boolean
  action: AdminCaseAction | null
  record: OperationalCase | null
  onClose: () => void
  onConfirm: (payload: ActionPayload) => void
}

export type ActionPayload =
  | { action: 'set_priority'; priority: OperationalCasePriority }
  | { action: 'assign_team'; team: (typeof CITY_TEAMS)[number] }
  | { action: 'assign_executive'; executive: string }
  | { action: 'reassign'; team: (typeof CITY_TEAMS)[number]; executive: string }
  | { action: 'move_next_day' }

const ACTION_TITLES: Record<AdminCaseAction, string> = {
  set_priority: 'Set priority',
  assign_team: 'Assign team',
  assign_executive: 'Assign executive',
  reassign: 'Reassign case',
  move_next_day: 'Move to next day',
}

export function OperationalCaseActionModal({
  open,
  action,
  record,
  onClose,
  onConfirm,
}: OperationalCaseActionModalProps) {
  const [priority, setPriority] = useState<OperationalCasePriority>('Normal')
  const [team, setTeam] = useState<(typeof CITY_TEAMS)[number]>('Mumbai Team')
  const [executive, setExecutive] = useState('')

  useEffect(() => {
    if (!record) return
    setPriority(record.priority)
    setTeam((record.assignedTeam as (typeof CITY_TEAMS)[number]) || 'Mumbai Team')
    setExecutive(record.assignedExecutive)
  }, [record, action])

  if (!action || !record) return null

  const title = ACTION_TITLES[action]
  const subtitle = record.applicationId

  const handleConfirm = () => {
    switch (action) {
      case 'set_priority':
        onConfirm({ action, priority })
        break
      case 'assign_team':
        onConfirm({ action, team })
        break
      case 'assign_executive':
        onConfirm({ action, executive })
        break
      case 'reassign':
        onConfirm({ action: 'reassign', team, executive })
        break
      case 'move_next_day':
        onConfirm({ action: 'move_next_day' })
        break
    }
  }

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
        {action === 'set_priority' ? (
          <FormField label="Priority">
            <Select
              size="sm"
              value={priority}
              onChange={value => setPriority(String(value) as OperationalCasePriority)}
              options={OPERATIONAL_CASE_PRIORITIES.map(p => ({ value: p, label: p }))}
              fullWidth
            />
          </FormField>
        ) : null}

        {action === 'assign_team' || action === 'reassign' ? (
          <FormField label="City team">
            <Select
              size="sm"
              value={team}
              onChange={value => setTeam(String(value) as (typeof CITY_TEAMS)[number])}
              options={CITY_TEAMS.map(t => ({ value: t, label: t }))}
              fullWidth
            />
          </FormField>
        ) : null}

        {action === 'assign_executive' || action === 'reassign' ? (
          <FormField label="Assigned executive">
            <Input
              size="sm"
              value={executive}
              onChange={setExecutive}
              placeholder="Executive name"
            />
          </FormField>
        ) : null}

        {action === 'move_next_day' ? (
          <Typography variant="body2" color="text.secondary">
            Case will carry forward to the next operational day with history preserved.
          </Typography>
        ) : null}
      </Stack>
    </Modal>
  )
}
