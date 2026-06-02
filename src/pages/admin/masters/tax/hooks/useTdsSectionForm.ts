import { useMemo, useState } from 'react'
import type { TdsSection, TdsSectionFormData } from '@/shared/types/taxMaster'

export const INITIAL_TDS_SECTION_FORM: TdsSectionFormData = {
  sectionCode: '',
  ratePercent: '',
  applicableOn: 'customer_invoice',
  thresholdLimit: '',
  description: '',
  status: 'active',
}

export function tdsSectionToFormData(row: TdsSection): TdsSectionFormData {
  return {
    sectionCode: row.sectionCode,
    ratePercent: String(row.ratePercent),
    applicableOn: row.applicableOn,
    thresholdLimit: row.thresholdLimit != null ? String(row.thresholdLimit) : '',
    description: row.description,
    status: row.status,
  }
}

export function useTdsSectionForm(initialData?: TdsSectionFormData) {
  const [formData, setFormData] = useState<TdsSectionFormData>(
    initialData ?? INITIAL_TDS_SECTION_FORM,
  )
  const [errors, setErrors] = useState<Record<string, string>>({})

  const isValid = useMemo(() => Object.keys(errors).length === 0, [errors])

  const validate = () => {
    const next: Record<string, string> = {}
    if (!formData.sectionCode.trim()) {
      next.sectionCode = 'TDS section code is required'
    }
    const pct = formData.ratePercent.trim()
    if (!pct) {
      next.ratePercent = 'TDS percentage is required'
    } else {
      const num = Number(pct)
      if (Number.isNaN(num) || num < 0 || num > 100) {
        next.ratePercent = 'Enter a valid percentage between 0 and 100'
      }
    }
    if (formData.thresholdLimit.trim()) {
      const threshold = Number(formData.thresholdLimit)
      if (Number.isNaN(threshold) || threshold < 0) {
        next.thresholdLimit = 'Enter a valid threshold limit'
      }
    }
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const reset = (data?: TdsSectionFormData) => {
    setFormData(data ?? INITIAL_TDS_SECTION_FORM)
    setErrors({})
  }

  return { formData, setFormData, errors, isValid, validate, reset }
}
