import { useMemo, useState } from 'react'
import type { GstRate, GstRateFormData } from '@/shared/types/taxMaster'

export const INITIAL_GST_RATE_FORM: GstRateFormData = {
  slabName: '',
  ratePercent: '',
  description: '',
  status: 'active',
}

export function gstRateToFormData(row: GstRate): GstRateFormData {
  return {
    slabName: row.slabName,
    ratePercent: String(row.ratePercent),
    description: row.description,
    status: row.status,
  }
}

export function useGstRateForm(initialData?: GstRateFormData) {
  const [formData, setFormData] = useState<GstRateFormData>(initialData ?? INITIAL_GST_RATE_FORM)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const isValid = useMemo(() => Object.keys(errors).length === 0, [errors])

  const validate = () => {
    const next: Record<string, string> = {}
    if (!formData.slabName.trim()) {
      next.slabName = 'GST slab name is required'
    }
    const pct = formData.ratePercent.trim()
    if (!pct) {
      next.ratePercent = 'GST percentage is required'
    } else {
      const num = Number(pct)
      if (Number.isNaN(num) || num < 0 || num > 100) {
        next.ratePercent = 'Enter a valid percentage between 0 and 100'
      }
    }
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const reset = (data?: GstRateFormData) => {
    setFormData(data ?? INITIAL_GST_RATE_FORM)
    setErrors({})
  }

  return { formData, setFormData, errors, isValid, validate, reset }
}
