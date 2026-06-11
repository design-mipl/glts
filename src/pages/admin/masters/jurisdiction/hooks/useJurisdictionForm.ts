import { useMemo, useState } from 'react'
import type { JurisdictionMaster, JurisdictionMasterFormData } from '@/shared/types/jurisdictionMaster'

export const INITIAL_JURISDICTION_FORM: JurisdictionMasterFormData = {
  name: '',
  description: '',
  status: 'active',
}

export function jurisdictionToFormData(row: JurisdictionMaster): JurisdictionMasterFormData {
  return {
    name: row.name,
    description: row.description,
    status: row.status,
  }
}

export function useJurisdictionForm(initialData?: JurisdictionMasterFormData) {
  const [formData, setFormData] = useState<JurisdictionMasterFormData>(
    initialData ?? INITIAL_JURISDICTION_FORM,
  )
  const [errors, setErrors] = useState<Record<string, string>>({})

  const isValid = useMemo(() => Object.keys(errors).length === 0, [errors])

  const validate = () => {
    const next: Record<string, string> = {}
    if (!formData.name.trim()) next.name = 'Jurisdiction name is required'
    if (!formData.status) next.status = 'Status is required'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const reset = (data?: JurisdictionMasterFormData) => {
    setFormData(data ?? INITIAL_JURISDICTION_FORM)
    setErrors({})
  }

  return { formData, setFormData, errors, isValid, validate, reset }
}
