import { useMemo, useState } from 'react'
import type { DepartmentMaster, DepartmentMasterFormData } from '@/shared/types/departmentMaster'

export const INITIAL_DEPARTMENT_FORM: DepartmentMasterFormData = {
  name: '',
  description: '',
  status: 'active',
}

export function departmentToFormData(row: DepartmentMaster): DepartmentMasterFormData {
  return {
    name: row.name,
    description: row.description,
    status: row.status,
  }
}

export function useDepartmentForm(initialData?: DepartmentMasterFormData) {
  const [formData, setFormData] = useState<DepartmentMasterFormData>(
    initialData ?? INITIAL_DEPARTMENT_FORM,
  )
  const [errors, setErrors] = useState<Record<string, string>>({})

  const isValid = useMemo(() => Object.keys(errors).length === 0, [errors])

  const validate = () => {
    const next: Record<string, string> = {}
    if (!formData.name.trim()) next.name = 'Department name is required'
    if (!formData.status) next.status = 'Status is required'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const reset = (data?: DepartmentMasterFormData) => {
    setFormData(data ?? INITIAL_DEPARTMENT_FORM)
    setErrors({})
  }

  return { formData, setFormData, errors, isValid, validate, reset }
}
