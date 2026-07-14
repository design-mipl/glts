import { useMemo, useState } from 'react'
import type { CreditCardMaster, CreditCardMasterFormData } from '@/shared/types/creditCardMaster'

export const INITIAL_CREDIT_CARD_FORM: CreditCardMasterFormData = {
  cardName: '',
}

export function creditCardToFormData(row: CreditCardMaster): CreditCardMasterFormData {
  return {
    cardName: row.cardName,
  }
}

export function useCreditCardForm(initialData?: CreditCardMasterFormData) {
  const [formData, setFormData] = useState<CreditCardMasterFormData>(
    initialData ?? INITIAL_CREDIT_CARD_FORM,
  )
  const [errors, setErrors] = useState<Record<string, string>>({})

  const isValid = useMemo(() => Object.keys(errors).length === 0, [errors])

  const validate = () => {
    const next: Record<string, string> = {}
    if (!formData.cardName.trim()) next.cardName = 'Card name is required'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const reset = (data?: CreditCardMasterFormData) => {
    setFormData(data ?? INITIAL_CREDIT_CARD_FORM)
    setErrors({})
  }

  return { formData, setFormData, errors, isValid, validate, reset }
}
