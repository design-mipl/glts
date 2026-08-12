import { useMemo, useState } from 'react'
import type { BankMaster, BankMasterFormData } from '@/shared/types/bankMaster'

export const INITIAL_BANK_MASTER_FORM: BankMasterFormData = {
  bankName: '',
}

export function bankMasterToFormData(row: BankMaster): BankMasterFormData {
  return {
    bankName: row.bankName,
  }
}

export function useBankMasterForm(initialData?: BankMasterFormData) {
  const [formData, setFormData] = useState<BankMasterFormData>(
    initialData ?? INITIAL_BANK_MASTER_FORM,
  )
  const [errors, setErrors] = useState<Record<string, string>>({})

  const isValid = useMemo(() => Object.keys(errors).length === 0, [errors])

  const validate = () => {
    const next: Record<string, string> = {}
    if (!formData.bankName.trim()) next.bankName = 'Bank name is required'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const reset = (data?: BankMasterFormData) => {
    setFormData(data ?? INITIAL_BANK_MASTER_FORM)
    setErrors({})
  }

  return { formData, setFormData, errors, isValid, validate, reset }
}
