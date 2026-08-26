import type { Country } from '@/shared/types/visa'
import { DestinationListingCard } from '../../../components/DestinationListingCard'

interface CountryCardProps {
  country: Country
  applicationContextQuery?: string
}

export function CountryCard({ country, applicationContextQuery = '' }: CountryCardProps) {
  const href = applicationContextQuery ? `/v1/countries/${country.id}${applicationContextQuery}` : undefined
  return <DestinationListingCard country={country} href={href} />
}
