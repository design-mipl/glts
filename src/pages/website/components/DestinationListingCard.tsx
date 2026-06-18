import type { Country } from '@/shared/types/visa'
import { DestinationImageCard } from './DestinationImageCard'

interface DestinationListingCardProps {
  country: Country
  href?: string
}

export function DestinationListingCard({ country, href }: DestinationListingCardProps) {
  return <DestinationImageCard country={country} href={href} />
}
