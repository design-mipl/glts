import { useCallback, useMemo, useState } from 'react'
import type { AgreementEntity, CommercialAgreementFormData } from '@/shared/types/commercialAgreement'
import type { AgreementSectionId } from '@/shared/utils/commercialAgreementValidation'
import { commercialAgreementService } from '@/shared/services/commercialAgreementService'
import {
  createEmptyAgreementFormData,
  validateAgreementForm,
  validateAgreementSection,
} from '@/shared/utils/commercialAgreementValidation'

function generateEntityId() {
  return `agr-ent-${Date.now()}-${Math.floor(Math.random() * 1000)}`
}

export function useAgreementForm(initial?: CommercialAgreementFormData) {
  const [formData, setFormDataState] = useState<CommercialAgreementFormData>(
    initial ?? createEmptyAgreementFormData(),
  )
  const [dirty, setDirty] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touchedSections, setTouchedSections] = useState<Partial<Record<AgreementSectionId, boolean>>>({})

  const setFormData = useCallback(
    (next: CommercialAgreementFormData | ((prev: CommercialAgreementFormData) => CommercialAgreementFormData)) => {
      setFormDataState(next)
      setDirty(true)
    },
    [],
  )

  const isValid = useMemo(() => Object.keys(errors).length === 0, [errors])

  const loadFromAgreement = useCallback((agreementId: string) => {
    const agreement = commercialAgreementService.getById(agreementId)
    if (agreement) {
      setFormDataState(commercialAgreementService.agreementToFormData(agreement))
      setDirty(false)
      setErrors({})
      setTouchedSections({})
    }
  }, [])

  const touchSection = useCallback((sectionId: AgreementSectionId) => {
    setTouchedSections((prev) => ({ ...prev, [sectionId]: true }))
    const sectionErrors = validateAgreementSection(sectionId, formData)
    setErrors((prev) => {
      const next = { ...prev }
      Object.keys(next).forEach((key) => {
        if (key in sectionErrors || sectionId === 'companyInfo' || sectionId === 'customerSource') {
          delete next[key]
        }
      })
      return { ...next, ...sectionErrors }
    })
  }, [formData])

  const validate = useCallback(() => {
    const nextErrors = validateAgreementForm(formData)
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }, [formData])

  const validateSection = useCallback(
    (sectionId: AgreementSectionId) => {
      const sectionErrors = validateAgreementSection(sectionId, formData)
      setErrors((prev) => ({ ...prev, ...sectionErrors }))
      return Object.keys(sectionErrors).length === 0
    },
    [formData],
  )

  const clearFieldError = useCallback((field: string) => {
    setErrors((prev) => {
      if (!prev[field]) return prev
      const next = { ...prev }
      delete next[field]
      return next
    })
  }, [])

  const hydrateFromQuotation = useCallback(
    (quotationId: string, versionId?: string) => {
      const patch = commercialAgreementService.hydrateFromQuotation(quotationId, versionId)
      if (!patch) return
      setFormData((prev) => ({
        ...prev,
        ...patch,
        customerSourceMode: 'quotation',
        referenceQuotationId: quotationId,
      }))
    },
    [setFormData],
  )

  const hydrateFromExistingCustomer = useCallback(
    (companyId: string) => {
      const patch = commercialAgreementService.hydrateFromExistingCustomer(companyId)
      if (!patch) return
      setFormData((prev) => ({
        ...prev,
        ...patch,
        customerSourceMode: 'existing',
        existingCompanyId: companyId,
      }))
    },
    [setFormData],
  )

  const addEntity = useCallback(
    (entity?: Partial<AgreementEntity>) => {
      const newEntity: AgreementEntity = {
        id: generateEntityId(),
        entityName: entity?.entityName ?? '',
        billingAddress: entity?.billingAddress ?? '',
        gstNumber: entity?.gstNumber ?? '',
        contactPerson: entity?.contactPerson ?? '',
        email: entity?.email ?? '',
        phone: entity?.phone ?? '',
        status: entity?.status ?? 'active',
      }
      setFormData((prev) => ({ ...prev, entities: [...prev.entities, newEntity] }))
      return newEntity.id
    },
    [setFormData],
  )

  const updateEntity = useCallback(
    (entityId: string, patch: Partial<AgreementEntity>) => {
      setFormData((prev) => ({
        ...prev,
        entities: prev.entities.map((e) => (e.id === entityId ? { ...e, ...patch } : e)),
      }))
    },
    [setFormData],
  )

  const removeEntity = useCallback(
    (entityId: string) => {
      setFormData((prev) => ({
        ...prev,
        entities: prev.entities.filter((e) => e.id !== entityId),
      }))
    },
    [setFormData],
  )

  const sectionComplete = useCallback(
    (sectionId: AgreementSectionId) => {
      return Object.keys(validateAgreementSection(sectionId, formData)).length === 0
    },
    [formData],
  )

  return {
    formData,
    setFormData,
    dirty,
    errors,
    touchedSections,
    isValid,
    loadFromAgreement,
    touchSection,
    validate,
    validateSection,
    clearFieldError,
    hydrateFromQuotation,
    hydrateFromExistingCustomer,
    addEntity,
    updateEntity,
    removeEntity,
    sectionComplete,
  }
}
