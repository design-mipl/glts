import { useCallback, useState } from 'react'
import type { CommercialAgreementFormData } from '@/shared/types/commercialAgreement'
import { commercialAgreementService } from '@/shared/services/commercialAgreementService'
import { companyMasterService } from '@/shared/services/companyMasterService'
import { createEmptyAgreementFormData } from '@/shared/utils/commercialAgreementValidation'

export function useAgreementForm(initial?: CommercialAgreementFormData) {
  const [formData, setFormData] = useState<CommercialAgreementFormData>(
    initial ?? createEmptyAgreementFormData(),
  )
  const [dirty, setDirty] = useState(false)

  const setFormDataTracked = useCallback((next: CommercialAgreementFormData | ((prev: CommercialAgreementFormData) => CommercialAgreementFormData)) => {
    setFormData(next)
    setDirty(true)
  }, [])

  const loadFromAgreement = useCallback((agreementId: string) => {
    const agreement = commercialAgreementService.getById(agreementId)
    if (agreement) {
      setFormData(commercialAgreementService.agreementToFormData(agreement))
      setDirty(false)
    }
  }, [])

  const hydrateCompanyFromSelection = useCallback((companyId: string) => {
    const company = companyMasterService.getById(companyId)
    if (!company) return
    setFormDataTracked((prev) => ({
      ...prev,
      existingCompanyId: companyId,
      company: {
        companyName: company.companyName,
        companyType: company.companyType,
        industryType: company.industryType,
        contactPersonName: company.contactPersonName,
        contactNumber: company.contactNumber,
        emailAddress: company.emailAddress,
        companyAddress: company.companyAddress,
        billingEntityName: company.billingEntityName,
        billingAddress: company.billingAddress,
        gstNumber: company.gstNumber,
        panNumber: company.panNumber,
      },
    }))
  }, [setFormDataTracked])

  return {
    formData,
    setFormData: setFormDataTracked,
    dirty,
    loadFromAgreement,
    hydrateCompanyFromSelection,
  }
}
