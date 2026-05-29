import { useCallback, useState } from 'react'
import type { VesselMasterFormData } from '@/shared/types/vesselMaster'
import { vesselMasterService } from '@/shared/services/vesselMasterService'
import {
  createEmptyVesselFormData,
  validateVesselForm,
  vesselMasterToFormData,
} from '@/shared/utils/vesselMasterValidation'

export { createEmptyVesselFormData, vesselMasterToFormData, validateVesselForm }

export function useVesselForm(excludeId?: string) {
  const [formData, setFormData] = useState<VesselMasterFormData>(createEmptyVesselFormData)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const update = useCallback((patch: Partial<VesselMasterFormData>) => {
    setFormData(prev => ({ ...prev, ...patch }))
    setErrors(prev => {
      const next = { ...prev }
      for (const key of Object.keys(patch)) delete next[key]
      return next
    })
  }, [])

  const reset = useCallback((data?: Partial<VesselMasterFormData>) => {
    setFormData({ ...createEmptyVesselFormData(), ...data })
    setErrors({})
  }, [])

  const validate = useCallback(() => {
    const next = validateVesselForm(formData, {
      excludeId,
      isImoTaken: vesselMasterService.isImoTaken.bind(vesselMasterService),
    })
    setErrors(next)
    return Object.keys(next).length === 0
  }, [formData, excludeId])

  return { formData, errors, update, reset, validate }
}
