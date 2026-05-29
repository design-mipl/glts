import { useCallback, useMemo, useState } from 'react'
import type { EntityMasterFormData } from '@/shared/types/entityMaster'
import { entityMasterService } from '@/shared/services/entityMasterService'
import {
  createEmptyEntityFormData,
  entityMasterToFormData,
  validateEntityForm,
} from '@/shared/utils/entityMasterValidation'

export { createEmptyEntityFormData, entityMasterToFormData, validateEntityForm }

export function useEntityForm(initial?: Partial<EntityMasterFormData>) {
  const [formData, setFormData] = useState<EntityMasterFormData>(() => ({
    ...createEmptyEntityFormData(),
    ...initial,
  }))
  const [errors, setErrors] = useState<Record<string, string>>({})

  const update = useCallback((patch: Partial<EntityMasterFormData>) => {
    setFormData(prev => ({ ...prev, ...patch }))
    setErrors(prev => {
      const next = { ...prev }
      for (const key of Object.keys(patch)) delete next[key]
      return next
    })
  }, [])

  const reset = useCallback((data?: Partial<EntityMasterFormData>) => {
    setFormData({ ...createEmptyEntityFormData(), ...data })
    setErrors({})
  }, [])

  const validate = useCallback(() => {
    const next = validateEntityForm(formData)
    setErrors(next)
    return Object.keys(next).length === 0
  }, [formData])

  const countryOptions = useMemo(() => entityMasterService.getCountryOptions(), [])

  return { formData, errors, update, reset, validate, countryOptions }
}
