import { useMemo, useState } from 'react'
import type {
  ClientDocumentMaster,
  ClientDocumentMasterFormData,
} from '@/shared/types/clientDocumentMaster'

export const INITIAL_CLIENT_DOCUMENT_FORM: ClientDocumentMasterFormData = {
  documentType: '',
  description: '',
  applicableFor: [],
  isMandatory: false,
  status: 'active',
}

export function clientDocumentToFormData(row: ClientDocumentMaster): ClientDocumentMasterFormData {
  return {
    documentType: row.documentType,
    description: row.description,
    applicableFor: [...row.applicableFor],
    isMandatory: row.isMandatory,
    status: row.status,
  }
}

export function useClientDocumentForm(initialData?: ClientDocumentMasterFormData) {
  const [formData, setFormData] = useState<ClientDocumentMasterFormData>(
    initialData ?? INITIAL_CLIENT_DOCUMENT_FORM,
  )
  const [errors, setErrors] = useState<Record<string, string>>({})

  const isValid = useMemo(() => Object.keys(errors).length === 0, [errors])

  const validate = () => {
    const next: Record<string, string> = {}
    if (!formData.documentType.trim()) {
      next.documentType = 'Document type is required'
    }
    if (formData.applicableFor.length === 0) {
      next.applicableFor = 'Select at least one applicability'
    }
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const reset = (data?: ClientDocumentMasterFormData) => {
    setFormData(data ?? INITIAL_CLIENT_DOCUMENT_FORM)
    setErrors({})
  }

  return { formData, setFormData, errors, isValid, validate, reset }
}
