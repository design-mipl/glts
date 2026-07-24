import { useMemo, useState } from 'react'
import type {
  CountryGroupMaster,
  CountryGroupMasterFormData,
} from '@/shared/types/countryGroupMaster'

export const INITIAL_COUNTRY_GROUP_FORM: CountryGroupMasterFormData = {
  name: '',
  countryIds: [],
  status: 'active',
}

export function countryGroupToFormData(row: CountryGroupMaster): CountryGroupMasterFormData {
  return {
    name: row.name,
    countryIds: [...row.countryIds],
    status: row.status,
  }
}

export function useCountryGroupForm(initialData?: CountryGroupMasterFormData) {
  const [formData, setFormData] = useState<CountryGroupMasterFormData>(
    initialData ?? INITIAL_COUNTRY_GROUP_FORM,
  )
  const [errors, setErrors] = useState<Record<string, string>>({})

  const isValid = useMemo(() => Object.keys(errors).length === 0, [errors])

  const validate = () => {
    const next: Record<string, string> = {}
    if (!formData.name.trim()) next.name = 'Group name is required'
    if (!formData.countryIds.length) next.countryIds = 'Select at least one country'
    if (!formData.status) next.status = 'Status is required'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const reset = (data?: CountryGroupMasterFormData) => {
    setFormData(data ?? INITIAL_COUNTRY_GROUP_FORM)
    setErrors({})
  }

  return { formData, setFormData, errors, isValid, validate, reset }
}
