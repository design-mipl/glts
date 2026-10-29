import type { ComponentType } from 'react'
import { Building2, Hand, MapPin, Truck, type LucideProps } from 'lucide-react'
import type { OriginalDocumentCollectionMethod } from '@/shared/types/originalDocumentCollection'

/**
 * Retail apply surfaces the inventory’s four physical-collection methods.
 * Airport / cargo pickups remain available in shared ops utils for other surfaces.
 */
export interface RetailCollectionMethodOption {
  value: OriginalDocumentCollectionMethod
  label: string
  description: string
  icon: ComponentType<LucideProps>
}

export const RETAIL_COLLECTION_METHOD_OPTIONS: RetailCollectionMethodOption[] = [
  {
    value: 'picked_up_from_company',
    label: 'GLTS Pickup',
    description: 'We collect originals from your address.',
    icon: MapPin,
  },
  {
    value: 'delivered_to_office',
    label: 'Drop at GLTS',
    description: 'Drop originals at a GLTS office.',
    icon: Building2,
  },
  {
    value: 'couriered_by_applicant',
    label: 'Courier',
    description: 'Ship originals with tracking to us.',
    icon: Truck,
  },
  {
    value: 'hand_carry_by_applicant',
    label: 'Hand-carry',
    description: 'Bring originals yourself to our desk.',
    icon: Hand,
  },
]

export function retailCollectionMethodLabel(method: OriginalDocumentCollectionMethod): string {
  return (
    RETAIL_COLLECTION_METHOD_OPTIONS.find((option) => option.value === method)?.label ?? method
  )
}
