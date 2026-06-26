import { useCallback, useState } from 'react'
import type { EnquiryRecord } from '@/shared/types/enquiry'
import type { QuotationFormData } from '@/shared/types/quotation'
import { enquiryService } from '@/shared/services/enquiryService'
import { enquiryReferenceService } from '@/shared/services/enquiryReferenceService'
import { buildQuotationFormDataFromEnquiry } from '@/shared/utils/quotationFormMapping'
import { validateQuotationForm } from '@/shared/utils/quotationValidation'
import { createEmptyQuotationFormData } from '../utils/quotationFormUtils'

export function useQuotationForm(initial?: QuotationFormData) {
  const [formData, setFormDataState] = useState<QuotationFormData>(initial ?? createEmptyQuotationFormData())
  const [selectedEnquiry, setSelectedEnquiry] = useState<EnquiryRecord | null>(null)
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
    setSelectedEnquiry(null)
    setErrors({})
  }, [])

  const clearEnquirySelection = useCallback(() => {
    setFormDataState(createEmptyQuotationFormData())
    setSelectedEnquiry(null)
    setErrors({})
  }, [])

  const hydrateFromEnquiry = useCallback(async (enquiryId: string) => {
    const enquiry = await enquiryService.getById(enquiryId)
    if (!enquiry || !enquiryReferenceService.isEligible(enquiry)) {
      setSelectedEnquiry(null)
      return false
    }
    setFormDataState(buildQuotationFormDataFromEnquiry(enquiry))
    setSelectedEnquiry(enquiry)
    setErrors({})
    return true
  }, [])

  return {
    formData,
    setFormData,
    selectedEnquiry,
    errors,
    setErrors,
    validate,
    clearFieldError,
    loadFormData,
    hydrateFromEnquiry,
    clearEnquirySelection,
  }
}
