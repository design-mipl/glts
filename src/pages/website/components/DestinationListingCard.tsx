import type { Country } from '@/shared/types/visa'
import { WebsiteListingCountryCard } from './WebsiteListingCountryCard'

interface DestinationListingCardProps {
  country: Country
  href?: string
}

export function DestinationListingCard({ country, href }: DestinationListingCardProps) {
  return <WebsiteListingCountryCard country={country} href={href} />
}
