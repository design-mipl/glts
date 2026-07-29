import { useEffect, useState } from 'react'
import { useToast } from '@/design-system/UIComponents'
import { AdminDrawerFormShell } from '@/pages/admin/components/AdminDrawerFormShell'
import { AdminFullPageFormFooter } from '@/pages/admin/components/AdminFullPageFormFooter'
import { ADMIN_DRAWER_FORM_LAYOUT } from '@/pages/admin/components/adminOverlayFormLayout'
import { workflowMasterService } from '@/shared/services/workflowMasterService'
import type { WorkflowMaster, WorkflowStatusStepFormData } from '@/shared/types/workflowMaster'
import {
  INITIAL_WORKFLOW_FORM,
  useWorkflowForm,
  workflowToFormData,
} from '../hooks/useWorkflowForm'
import { WorkflowFormFields } from './WorkflowFormFields'
import { WorkflowStatusesEditor } from './WorkflowStatusesEditor'

interface WorkflowFormDrawerProps {
  open: boolean
  record?: WorkflowMaster | null
  onClose: () => void
  onSaved: () => void
}

const DRAWER_WIDTH = 560

export function WorkflowFormDrawer({ open, record, onClose, onSaved }: WorkflowFormDrawerProps) {
  const { showToast } = useToast()
  const { formData, setFormData, errors, setErrors, validate, reset } = useWorkflowForm()
  const [loading, setLoading] = useState(false)
  const isEdit = Boolean(record)

  useEffect(() => {
    if (open) {
      reset(record ? workflowToFormData(record) : INITIAL_WORKFLOW_FORM)
    }
  }, [open, record?.id, reset])

  const handleClose = () => {
    if (loading) return
    onClose()
  }

  const handleStepsChange = (steps: WorkflowStatusStepFormData[]) => {
    setFormData({ ...formData, steps })
    if (errors.steps) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next.steps
        return next
      })
    }
  }

  const handleSubmit = () => {
    if (!validate()) return
    setLoading(true)
    const result =
      isEdit && record
        ? workflowMasterService.update(record.id, formData)
        : workflowMasterService.create(formData)
    setLoading(false)

    if (!result) return

    if ('error' in result) {
      if (result.error === 'duplicate_name') {
        showToast({
          title: 'Duplicate workflow name',
          description: 'A workflow with this name already exists.',
          variant: 'error',
        })
        setErrors((prev) => ({ ...prev, name: 'Workflow name must be unique' }))
        return
      }
      if (result.error === 'empty_steps') {
        setErrors((prev) => ({ ...prev, steps: 'At least one status is required' }))
        return
      }
      if (result.error === 'duplicate_status') {
        setErrors((prev) => ({
          ...prev,
          steps: 'Duplicate statuses are not allowed in the same workflow',
        }))
        return
      }
      return
    }

    showToast({
      title: isEdit ? 'Workflow updated' : 'Workflow created',
      variant: 'success',
    })
    onSaved()
    onClose()
  }

  return (
    <AdminDrawerFormShell
      open={open}
      onClose={handleClose}
      title={isEdit ? 'Edit Workflow' : 'Create Workflow'}
      subtitle="Reusable visa processing status sequence"
      width={DRAWER_WIDTH}
      footer={
        <AdminFullPageFormFooter
          loading={loading}
          onCancel={handleClose}
          onSave={handleSubmit}
          saveLabel="Save Workflow"
        />
      }
      sections={[
        {
          id: 'basic',
          title: 'Basic information',
          columns: ADMIN_DRAWER_FORM_LAYOUT.primarySectionColumns,
          children: (
            <WorkflowFormFields formData={formData} onChange={setFormData} errors={errors} />
          ),
        },
        {
          id: 'statuses',
          title: 'Workflow statuses',
          columns: 1,
          children: (
            <WorkflowStatusesEditor
              steps={formData.steps}
              error={errors.steps}
              onChange={handleStepsChange}
            />
          ),
        },
      ]}
    />
  )
}
