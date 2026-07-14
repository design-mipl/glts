import { useState } from 'react'
import { FormField, FormSection, Input, Modal, Textarea } from '@/design-system/UIComponents'
import { AdminFullPageFormFooter } from '@/pages/admin/components/AdminFullPageFormFooter'
import { AdminFullPageFormFieldSpan } from '@/pages/admin/components/AdminFullPageFormShell'
import { ADMIN_MODAL_FORM_LAYOUT } from '@/pages/admin/components/adminOverlayFormLayout'
import { statusMasterService } from '@/shared/services/statusMasterService'
import type { WorkflowStatusStepFormData } from '@/shared/types/workflowMaster'

interface AddWorkflowStatusModalProps {
  open: boolean
  existingStatusIds: string[]
  onClose: () => void
  onAdd: (step: WorkflowStatusStepFormData) => void
}

function resolveStatusId(input: string): string {
  const normalized = input.trim().toLowerCase()
  const match = statusMasterService
    .list()
    .find((row) => row.name.trim().toLowerCase() === normalized)
  return match?.id ?? input.trim()
}

function isStatusAlreadyInWorkflow(resolvedId: string, existingStatusIds: string[]): boolean {
  if (existingStatusIds.includes(resolvedId)) return true
  const resolvedName = (
    statusMasterService.getById(resolvedId)?.name ?? resolvedId
  ).trim().toLowerCase()
  return existingStatusIds.some((id) => {
    const name = (statusMasterService.getById(id)?.name ?? id).trim().toLowerCase()
    return name === resolvedName
  })
}

export function AddWorkflowStatusModal({
  open,
  existingStatusIds,
  onClose,
  onAdd,
}: AddWorkflowStatusModalProps) {
  const [statusName, setStatusName] = useState('')
  const [remarks, setRemarks] = useState('')
  const [error, setError] = useState('')

  const reset = () => {
    setStatusName('')
    setRemarks('')
    setError('')
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  const handleSave = () => {
    if (!statusName.trim()) {
      setError('Status is required')
      return
    }
    const statusId = resolveStatusId(statusName)
    if (isStatusAlreadyInWorkflow(statusId, existingStatusIds)) {
      setError('This status is already in the workflow')
      return
    }
    onAdd({ statusId, remarks: remarks.trim() })
    reset()
    onClose()
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Add Status"
      subtitle="Enter a processing status for this workflow"
      size={ADMIN_MODAL_FORM_LAYOUT.recommendedSize}
      footer={
        <AdminFullPageFormFooter
          onCancel={handleClose}
          onSave={handleSave}
          saveLabel="Add Status"
        />
      }
    >
      <FormSection columns={1}>
        <FormField label="Status" required error={Boolean(error)} helperText={error}>
          <Input
            value={statusName}
            onChange={(v) => {
              setStatusName(v)
              setError('')
            }}
            placeholder="e.g. Under Review"
            size="sm"
            fullWidth
          />
        </FormField>
        <AdminFullPageFormFieldSpan>
          <FormField label="Remarks" optional>
            <Textarea
              value={remarks}
              onChange={setRemarks}
              placeholder="Optional notes for this status step"
              rows={2}
              fullWidth
            />
          </FormField>
        </AdminFullPageFormFieldSpan>
      </FormSection>
    </Modal>
  )
}
