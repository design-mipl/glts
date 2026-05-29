import { useCallback, useEffect, useState } from 'react'
import { countryMasterAdminService } from '@/shared/services/countryMasterAdminService'
import type { CountryMaster } from '@/shared/types/countryMaster'

export function useCountryDetailState(countryId: string | undefined) {
  const [loading, setLoading] = useState(true)
  const [country, setCountry] = useState<CountryMaster | undefined>()

  const reload = useCallback(() => {
    if (!countryId) {
      setCountry(undefined)
      setLoading(false)
      return
    }
    setLoading(true)
    const record = countryMasterAdminService.getById(countryId)
    setCountry(record)
    setLoading(false)
  }, [countryId])

  useEffect(() => {
    reload()
  }, [reload])

  return { loading, country, reload }
}
