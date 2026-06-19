import { useMemo, useState } from 'react'
import type { DocumentMaster, DocumentMasterFormData } from '@/shared/types/documentMaster'

export const INITIAL_DOCUMENT_FORM: DocumentMasterFormData = {
  documentType: '',
  description: '',
  status: 'inactive',
}

export function documentToFormData(row: DocumentMaster): DocumentMasterFormData {
  return {
    documentType: row.documentType,
    description: row.description,
    status: row.status,
  }
}

export function useDocumentForm(initialData?: DocumentMasterFormData) {
  const [formData, setFormData] = useState<DocumentMasterFormData>(
    initialData ?? INITIAL_DOCUMENT_FORM,
  )
  const [errors, setErrors] = useState<Record<string, string>>({})

  const isValid = useMemo(() => Object.keys(errors).length === 0, [errors])

  const validate = () => {
    const next: Record<string, string> = {}
    if (!formData.documentType.trim()) {
      next.documentType = 'Document type is required'
    }
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const reset = (data?: DocumentMasterFormData) => {
    setFormData(data ?? INITIAL_DOCUMENT_FORM)
    setErrors({})
  }

  return {
    formData,
    setFormData,
    errors,
    isValid,
    validate,
    reset,
  }
}
