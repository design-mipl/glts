import { useMemo, useState } from 'react'
import type { ServiceMaster, ServiceMasterFormData } from '@/shared/types/serviceMaster'

export const INITIAL_SERVICE_FORM: ServiceMasterFormData = {
  serviceCode: '',
  serviceName: '',
  description: '',
  category: '',
  subcategory: '',
  defaultPrice: '',
  currency: '',
  mappedSacCodeId: '',
  gstRateId: '',
  tdsSectionId: '',
  applicableFor: [],
  status: 'active',
}

export function serviceToFormData(row: ServiceMaster): ServiceMasterFormData {
  return {
    serviceCode: row.serviceCode,
    serviceName: row.serviceName,
    description: row.description,
    category: row.category,
    subcategory: row.subcategory,
    defaultPrice: row.defaultPrice != null ? String(row.defaultPrice) : '',
    currency: row.currency,
    mappedSacCodeId: row.mappedSacCodeId ?? '',
    gstRateId: row.gstRateId ?? '',
    tdsSectionId: row.tdsSectionId ?? '',
    applicableFor: [...row.applicableFor],
    status: row.status,
  }
}

export function useServiceForm(initialData?: ServiceMasterFormData) {
  const [formData, setFormData] = useState<ServiceMasterFormData>(
    initialData ?? INITIAL_SERVICE_FORM,
  )
  const [errors, setErrors] = useState<Record<string, string>>({})

  const isValid = useMemo(() => Object.keys(errors).length === 0, [errors])

  const validate = () => {
    const next: Record<string, string> = {}
    if (!formData.serviceCode.trim()) next.serviceCode = 'Service code is required'
    if (!formData.serviceName.trim()) next.serviceName = 'Service name is required'
    if (!formData.category) next.category = 'Category is required'
    if (!formData.subcategory) next.subcategory = 'Subcategory is required'
    if (!formData.currency) next.currency = 'Currency is required'
    if (formData.applicableFor.length === 0) {
      next.applicableFor = 'Select at least one applicability'
    }
    if (formData.defaultPrice.trim()) {
      const price = Number(formData.defaultPrice)
      if (Number.isNaN(price) || price < 0) {
        next.defaultPrice = 'Enter a valid price'
      }
    }
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const reset = (data?: ServiceMasterFormData) => {
    setFormData(data ?? INITIAL_SERVICE_FORM)
    setErrors({})
  }

  return { formData, setFormData, errors, isValid, validate, reset }
}
