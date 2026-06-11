import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { countryMasterAdminService } from '@/shared/services/countryMasterAdminService'
import type { CountryMaster, CountryMasterFormData } from '@/shared/types/countryMaster'
import { parseConfigNodePath } from '../utils/countryConfigTreeUtils'
import { countryMasterToFormData } from '../utils/countryFormValidation'

export function useCountryConfigWorkspace(countryId: string | undefined) {
  const [searchParams, setSearchParams] = useSearchParams()
  const [country, setCountry] = useState<CountryMaster | null>(null)
  const [formData, setFormData] = useState<CountryMasterFormData | null>(null)
  const [loading, setLoading] = useState(true)
  const [dirty, setDirty] = useState(false)
  const [saving, setSaving] = useState(false)

  const activeNode = parseConfigNodePath(searchParams.get('node'))

  const reload = useCallback(() => {
    if (!countryId) {
      setCountry(null)
      setFormData(null)
      setLoading(false)
      return
    }
    const record = countryMasterAdminService.getById(countryId)
    if (record) {
      setCountry(record)
      setFormData(countryMasterToFormData(record))
    } else {
      setCountry(null)
      setFormData(null)
    }
    setLoading(false)
  }, [countryId])

  useEffect(() => {
    setLoading(true)
    reload()
  }, [reload])

  const selectNode = useCallback(
    (nodePath: string) => {
      const next = new URLSearchParams(searchParams)
      next.set('node', nodePath)
      setSearchParams(next, { replace: true })
    },
    [searchParams, setSearchParams],
  )

  const updateFormData = useCallback((next: CountryMasterFormData) => {
    setFormData(next)
    setDirty(true)
  }, [])

  const saveDraft = useCallback(async () => {
    if (!countryId || !formData) return undefined
    setSaving(true)
    const updated = countryMasterAdminService.saveDraft(countryId, formData)
    setSaving(false)
    setDirty(false)
    reload()
    return updated
  }, [countryId, formData, reload])

  const publish = useCallback(async () => {
    if (!countryId || !formData) return undefined
    setSaving(true)
    countryMasterAdminService.update(countryId, formData)
    const updated = countryMasterAdminService.publish(countryId)
    setSaving(false)
    setDirty(false)
    reload()
    return updated
  }, [countryId, formData, reload])

  const deactivate = useCallback(async () => {
    if (!countryId) return undefined
    setSaving(true)
    const updated = countryMasterAdminService.archive(countryId)
    setSaving(false)
    reload()
    return updated
  }, [countryId, reload])

  const refreshFromService = useCallback(() => {
    reload()
    setDirty(false)
  }, [reload])

  const discardChanges = useCallback(() => {
    reload()
    setDirty(false)
  }, [reload])

  const summary = useMemo(
    () => (country ? countryMasterAdminService.getValidationWarnings(country.id) : null),
    [country],
  )

  return {
    country,
    formData,
    loading,
    dirty,
    saving,
    activeNode,
    summary,
    selectNode,
    updateFormData,
    saveDraft,
    publish,
    deactivate,
    refreshFromService,
    discardChanges,
    setDirty,
  }
}
