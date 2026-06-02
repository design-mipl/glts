import { useMemo, useState } from 'react'
import type { SacCodeMaster, SacCodeMasterFormData } from '@/shared/types/sacCodeMaster'

export const INITIAL_SAC_CODE_FORM: SacCodeMasterFormData = {
  sacCode: '',
  sacTitle: '',
  description: '',
  category: '',
  defaultGstRateId: '',
  defaultTdsSectionId: '',
  applicableFor: [],
  status: 'active',
}

export function sacCodeToFormData(row: SacCodeMaster): SacCodeMasterFormData {
  return {
    sacCode: row.sacCode,
    sacTitle: row.sacTitle,
    description: row.description,
    category: row.category,
    defaultGstRateId: row.defaultGstRateId,
    defaultTdsSectionId: row.defaultTdsSectionId ?? '',
    applicableFor: [...row.applicableFor],
    status: row.status,
  }
}

export function useSacCodeForm(initialData?: SacCodeMasterFormData) {
  const [formData, setFormData] = useState<SacCodeMasterFormData>(
    initialData ?? INITIAL_SAC_CODE_FORM,
  )
  const [errors, setErrors] = useState<Record<string, string>>({})

  const isValid = useMemo(() => Object.keys(errors).length === 0, [errors])

  const validate = () => {
    const next: Record<string, string> = {}
    if (!formData.sacCode.trim()) next.sacCode = 'SAC code is required'
    if (!formData.sacTitle.trim()) next.sacTitle = 'SAC title is required'
    if (!formData.category) next.category = 'Category is required'
    if (!formData.defaultGstRateId) next.defaultGstRateId = 'Default GST rate is required'
    if (formData.applicableFor.length === 0) {
      next.applicableFor = 'Select at least one applicability'
    }
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const reset = (data?: SacCodeMasterFormData) => {
    setFormData(data ?? INITIAL_SAC_CODE_FORM)
    setErrors({})
  }

  return { formData, setFormData, errors, isValid, validate, reset }
}
