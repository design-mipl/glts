import { useCallback, useState } from 'react'
import type { CorporateAccountFormData } from '@/shared/types/corporateAccount'
import { corporateAccountService } from '@/shared/services/corporateAccountService'
import { createEmptyCorporateAccountFormData } from '@/shared/utils/corporateAccountValidation'

export function useCorporateAccountForm(initial?: CorporateAccountFormData) {
  const [formData, setFormData] = useState<CorporateAccountFormData>(initial ?? createEmptyCorporateAccountFormData())
  const [dirty, setDirty] = useState(false)

  const setFormDataTracked = useCallback((next: CorporateAccountFormData | ((prev: CorporateAccountFormData) => CorporateAccountFormData)) => {
    setFormData(next)
    setDirty(true)
  }, [])

  const loadFromAccount = useCallback((accountId: string) => {
    const account = corporateAccountService.getById(accountId)
    if (account) {
      setFormData(corporateAccountService.accountToFormData(account))
      setDirty(false)
    }
  }, [])

  const hydrateFromAgreement = useCallback((agreementId: string) => {
    const hydrated = corporateAccountService.hydrateFromAgreement(agreementId)
    if (hydrated) {
      setFormDataTracked(hydrated)
    }
  }, [setFormDataTracked])

  return { formData, setFormData: setFormDataTracked, dirty, loadFromAccount, hydrateFromAgreement }
}
