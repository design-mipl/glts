import { useCallback, useMemo, useState } from 'react'
import {
  emptySlaHoursPlan,
  getDefaultSlaSubmodule,
  sumSlaStageHours,
  type SlaDomain,
  type SlaHoursPlan,
  type SlaMaster,
  type SlaMasterFormData,
} from '@/shared/types/slaMaster'

export function createEmptySlaForm(domain: SlaDomain = 'application_management'): SlaMasterFormData {
  const segment = getDefaultSlaSubmodule(domain)
  return {
    domain,
    segment,
    name: '',
    status: 'active',
    single: emptySlaHoursPlan(domain, segment),
    bulkBands: {
      '0_10': emptySlaHoursPlan(domain, segment),
      '11_20': emptySlaHoursPlan(domain, segment),
      '21_plus': emptySlaHoursPlan(domain, segment),
    },
  }
}

export const INITIAL_SLA_FORM: SlaMasterFormData = createEmptySlaForm('application_management')

export function slaToFormData(row: SlaMaster): SlaMasterFormData {
  const singleStages = { ...row.single.stages }
  const band010Stages = { ...row.bulkBands['0_10'].stages }
  const band1120Stages = { ...row.bulkBands['11_20'].stages }
  const band21Stages = { ...row.bulkBands['21_plus'].stages }
  return {
    domain: row.domain,
    segment: row.segment,
    name: row.name,
    status: row.status,
    single: {
      e2eHours: sumSlaStageHours(singleStages, row.domain, row.segment),
      stages: singleStages,
    },
    bulkBands: {
      '0_10': {
        e2eHours: sumSlaStageHours(band010Stages, row.domain, row.segment),
        stages: band010Stages,
      },
      '11_20': {
        e2eHours: sumSlaStageHours(band1120Stages, row.domain, row.segment),
        stages: band1120Stages,
      },
      '21_plus': {
        e2eHours: sumSlaStageHours(band21Stages, row.domain, row.segment),
        stages: band21Stages,
      },
    },
  }
}

function validatePlan(
  plan: SlaHoursPlan,
  prefix: string,
  formData: SlaMasterFormData,
  next: Record<string, string>,
) {
  const sum = sumSlaStageHours(plan.stages, formData.domain, formData.segment)
  if (sum <= 0) {
    next[`${prefix}.e2eHours`] = 'Enter hours for at least one tab'
  }
}

export function useSlaForm(initialData?: SlaMasterFormData) {
  const [formData, setFormData] = useState<SlaMasterFormData>(initialData ?? INITIAL_SLA_FORM)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const isValid = useMemo(() => Object.keys(errors).length === 0, [errors])

  const validate = useCallback(() => {
    const next: Record<string, string> = {}
    if (!formData.domain) next.domain = 'Module is required'
    if (!formData.segment) next.segment = 'Submodule is required'
    validatePlan(formData.single, 'single', formData, next)
    validatePlan(formData.bulkBands['0_10'], 'bulk.0_10', formData, next)
    validatePlan(formData.bulkBands['11_20'], 'bulk.11_20', formData, next)
    validatePlan(formData.bulkBands['21_plus'], 'bulk.21_plus', formData, next)
    setErrors(next)
    return Object.keys(next).length === 0
  }, [formData])

  const reset = useCallback((data?: SlaMasterFormData) => {
    setFormData(data ?? INITIAL_SLA_FORM)
    setErrors({})
  }, [])

  return { formData, setFormData, errors, setErrors, isValid, validate, reset }
}
