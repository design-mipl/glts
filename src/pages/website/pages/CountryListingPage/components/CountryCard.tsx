import type { Country } from '@/shared/types/visa'
import { DestinationListingCard } from '../../../components/DestinationListingCard'

interface CountryCardProps {
  country: Country
}

export function CountryCard({ country }: CountryCardProps) {
  return <DestinationListingCard country={country} />
}
