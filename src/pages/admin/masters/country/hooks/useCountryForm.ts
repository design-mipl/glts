import { useCallback, useMemo, useState } from 'react'
import type { CountryMasterFormData } from '@/shared/types/countryMaster'
import {
  createEmptyCountryFormData,
  countryMasterToFormData,
  validateCountryForm,
  validateCountryStep,
} from '../utils/countryFormValidation'

export function useCountryForm(initial?: CountryMasterFormData) {
  const [formData, setFormData] = useState<CountryMasterFormData>(
    initial ?? createEmptyCountryFormData(),
  )
  const [dirty, setDirty] = useState(false)

  const updateForm = useCallback((next: CountryMasterFormData) => {
    setFormData(next)
    setDirty(true)
  }, [])

  const resetForm = useCallback((next?: CountryMasterFormData) => {
    setFormData(next ?? createEmptyCountryFormData())
    setDirty(false)
  }, [])

  const loadFromMaster = useCallback(
    (master: Parameters<typeof countryMasterToFormData>[0]) => {
      resetForm(countryMasterToFormData(master))
    },
    [resetForm],
  )

  const validation = useMemo(
    () => validateCountryForm(formData),
    [formData],
  )

  const validateStep = useCallback(
    (step: number, excludeId?: string) => validateCountryStep(step, formData, excludeId),
    [formData],
  )

  return {
    formData,
    setFormData: updateForm,
    dirty,
    setDirty,
    resetForm,
    loadFromMaster,
    validation,
    validateStep,
  }
}
