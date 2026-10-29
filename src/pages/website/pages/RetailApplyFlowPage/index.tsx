import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getCountryMasterById, getVisaOfferings } from '@/shared/services/countryMasterService'
import { RetailApplyFlowShell } from './RetailApplyFlowShell'

/**
 * Retail apply — destination can be chosen in-flow (cold start) or via `?country=`.
 */
export function RetailApplyFlowPage() {
  const [searchParams] = useSearchParams()
  const countryId = searchParams.get('country')?.trim() ?? ''
  const requestedVisaOfferingId = searchParams.get('visa')?.trim()
  const applicationId = searchParams.get('application')?.trim() || undefined

  const countryExists = Boolean(countryId && getCountryMasterById(countryId))

  const visaOfferingId = useMemo(() => {
    if (!countryExists) return ''
    if (requestedVisaOfferingId) return requestedVisaOfferingId
    return getVisaOfferings(countryId, true, 'retail')[0]?.id ?? ''
  }, [countryExists, countryId, requestedVisaOfferingId])

  return (
    <RetailApplyFlowShell
      key={applicationId ?? 'new'}
      initialCountryId={countryExists ? countryId : ''}
      initialVisaOfferingId={visaOfferingId}
      applicationId={applicationId}
    />
  )
}
