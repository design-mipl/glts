import type { VesselMasterStatus, VesselType } from '@/shared/types/vesselMaster'

export const vesselStatusLabel: Record<VesselMasterStatus, string> = {
  active: 'Active',
  inactive: 'Inactive',
}

export const vesselStatusTone: Record<VesselMasterStatus, 'success' | 'neutral'> = {
  active: 'success',
  inactive: 'neutral',
}

export const vesselTypeLabel: Record<VesselType, string> = {
  bulk_carrier: 'Bulk carrier',
  tanker: 'Tanker',
  container: 'Container',
  offshore: 'Offshore',
  other: 'Other',
}

export const vesselTypeOptions: { value: VesselType; label: string }[] = [
  { value: 'bulk_carrier', label: 'Bulk carrier' },
  { value: 'tanker', label: 'Tanker' },
  { value: 'container', label: 'Container' },
  { value: 'offshore', label: 'Offshore' },
  { value: 'other', label: 'Other' },
]
