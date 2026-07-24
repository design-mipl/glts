import { useMemo, useState } from 'react'
import type { CardMaster, CardMasterFormData } from '@/shared/types/cardMaster'

export const INITIAL_CARD_MASTER_FORM: CardMasterFormData = {
  cardName: '',
}

export function cardMasterToFormData(row: CardMaster): CardMasterFormData {
  return {
    cardName: row.cardName,
  }
}

export function useCardMasterForm(initialData?: CardMasterFormData) {
  const [formData, setFormData] = useState<CardMasterFormData>(
    initialData ?? INITIAL_CARD_MASTER_FORM,
  )
  const [errors, setErrors] = useState<Record<string, string>>({})

  const isValid = useMemo(() => Object.keys(errors).length === 0, [errors])

  const validate = () => {
    const next: Record<string, string> = {}
    if (!formData.cardName.trim()) next.cardName = 'Card name is required'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const reset = (data?: CardMasterFormData) => {
    setFormData(data ?? INITIAL_CARD_MASTER_FORM)
    setErrors({})
  }

  return { formData, setFormData, errors, isValid, validate, reset }
}
