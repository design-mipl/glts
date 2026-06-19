import { useCallback, useState } from 'react'
import type { QuotationFormData } from '@/shared/types/quotation'
import { validateQuotationForm } from '@/shared/utils/quotationValidation'
import { createEmptyQuotationFormData } from '../utils/quotationFormUtils'

export function useQuotationForm(initial?: QuotationFormData) {
  const [formData, setFormDataState] = useState<QuotationFormData>(initial ?? createEmptyQuotationFormData())
  const [errors, setErrors] = useState<Record<string, string>>({})

  const setFormData = useCallback(
    (next: QuotationFormData | ((prev: QuotationFormData) => QuotationFormData)) => {
      setFormDataState(next)
    },
    [],
  )

  const validate = useCallback(() => {
    const nextErrors = validateQuotationForm(formData)
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }, [formData])

  const clearFieldError = useCallback((field: string) => {
    setErrors((prev) => {
      if (!prev[field]) return prev
      const next = { ...prev }
      delete next[field]
      return next
    })
  }, [])

  const loadFormData = useCallback((data: QuotationFormData) => {
    setFormDataState(data)
    setErrors({})
  }, [])

  return { formData, setFormData, errors, setErrors, validate, clearFieldError, loadFormData }
}
