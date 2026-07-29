import { useEffect, useState } from 'react'
import { useToast } from '@/design-system/UIComponents'
import { AdminDrawerFormShell } from '@/pages/admin/components/AdminDrawerFormShell'
import { AdminFullPageFormFooter } from '@/pages/admin/components/AdminFullPageFormFooter'
import { ADMIN_DRAWER_FORM_LAYOUT } from '@/pages/admin/components/adminOverlayFormLayout'
import { teamService } from '@/shared/services/teamService'
import type { TeamMaster } from '@/shared/types/teamMaster'
import { INITIAL_TEAM_FORM, teamToFormData, useTeamForm } from '../hooks/useTeamForm'
import { TeamFormFields } from './TeamFormFields'

interface TeamFormDrawerProps {
  open: boolean
  record?: TeamMaster | null
  onClose: () => void
  onSaved: () => void
}

export function TeamFormDrawer({ open, record, onClose, onSaved }: TeamFormDrawerProps) {
  const { showToast } = useToast()
  const { formData, setFormData, errors, validate, reset } = useTeamForm()
  const [loading, setLoading] = useState(false)
  const isEdit = Boolean(record)

  useEffect(() => {
    if (open) {
      reset(record ? teamToFormData(record) : INITIAL_TEAM_FORM)
    }
  }, [open, record, reset])

  const handleClose = () => {
    if (loading) return
    onClose()
  }

  const handleSubmit = () => {
    if (!validate()) return
    setLoading(true)
    const result =
      isEdit && record
        ? teamService.update(record.id, formData)
        : teamService.create(formData)
    setLoading(false)
    if (result && 'error' in result && result.error === 'duplicate_name') {
      showToast({
        title: 'Duplicate team name',
        description: 'A team with this name already exists.',
        variant: 'error',
      })
      return
    }
    showToast({
      title: isEdit ? 'Team updated' : 'Team added',
      variant: 'success',
    })
    onSaved()
    onClose()
  }

  return (
    <AdminDrawerFormShell
      open={open}
      onClose={handleClose}
      title={isEdit ? 'Edit team' : 'Add team'}
      subtitle="Organize users into operational teams"
      footer={
        <AdminFullPageFormFooter
          loading={loading}
          onCancel={handleClose}
          onSave={handleSubmit}
        />
      }
      sections={[
        {
          id: 'team-details',
          title: 'Team details',
          description: 'Name, description, and status',
          columns: ADMIN_DRAWER_FORM_LAYOUT.primarySectionColumns,
          children: (
            <TeamFormFields formData={formData} onChange={setFormData} errors={errors} />
          ),
        },
      ]}
    />
  )
}
