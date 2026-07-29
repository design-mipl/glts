import { useCallback, useMemo, useState } from 'react'
import type { WorkflowMaster, WorkflowMasterFormData } from '@/shared/types/workflowMaster'

export const INITIAL_WORKFLOW_FORM: WorkflowMasterFormData = {
  name: '',
  description: '',
  status: 'active',
  steps: [],
}

export function workflowToFormData(row: WorkflowMaster): WorkflowMasterFormData {
  return {
    name: row.name,
    description: row.description,
    status: row.status,
    steps: [...row.steps]
      .sort((a, b) => a.sequence - b.sequence)
      .map((step) => ({
        statusId: step.statusId,
        remarks: step.remarks,
      })),
  }
}

export function useWorkflowForm(initialData?: WorkflowMasterFormData) {
  const [formData, setFormData] = useState<WorkflowMasterFormData>(
    initialData ?? INITIAL_WORKFLOW_FORM,
  )
  const [errors, setErrors] = useState<Record<string, string>>({})

  const isValid = useMemo(() => Object.keys(errors).length === 0, [errors])

  const validate = useCallback(() => {
    const next: Record<string, string> = {}
    if (!formData.name.trim()) next.name = 'Workflow name is required'
    if (formData.steps.length === 0) next.steps = 'At least one status is required'
    const statusIds = formData.steps.map((step) => step.statusId)
    if (new Set(statusIds).size !== statusIds.length) {
      next.steps = 'Duplicate statuses are not allowed in the same workflow'
    }
    setErrors(next)
    return Object.keys(next).length === 0
  }, [formData])

  const reset = useCallback((data?: WorkflowMasterFormData) => {
    setFormData(data ?? INITIAL_WORKFLOW_FORM)
    setErrors({})
  }, [])

  return { formData, setFormData, errors, setErrors, isValid, validate, reset }
}
