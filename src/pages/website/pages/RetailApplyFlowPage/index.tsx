import { useMemo } from 'react'
import { Navigate, useSearchParams } from 'react-router-dom'
import { getCountryMasterById, getVisaOfferings } from '@/shared/services/countryMasterService'
import { RetailApplyFlowShell } from './RetailApplyFlowShell'

const COUNTRIES_HREF = '/countries'

/**
 * Retail apply starts only after a country is chosen on the country page.
 * Cold `/apply/new` (no country) redirects to destinations.
 */
export function RetailApplyFlowPage() {
  const [searchParams] = useSearchParams()
  const countryId = searchParams.get('country')?.trim() ?? ''
  const requestedVisaOfferingId = searchParams.get('visa')?.trim()

  const countryExists = Boolean(countryId && getCountryMasterById(countryId))

  const visaOfferingId = useMemo(() => {
    if (!countryExists) return ''
    if (requestedVisaOfferingId) return requestedVisaOfferingId
    return getVisaOfferings(countryId, true, 'retail')[0]?.id ?? ''
  }, [countryExists, countryId, requestedVisaOfferingId])

  if (!countryExists) {
    return <Navigate to={COUNTRIES_HREF} replace />
  }

  return (
    <RetailApplyFlowShell
      key={`${countryId}:${visaOfferingId}`}
      initialCountryId={countryId}
      initialVisaOfferingId={visaOfferingId}
    />
  )
}
