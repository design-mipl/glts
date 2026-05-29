import type { EntityMasterStatus } from '@/shared/types/entityMaster'

export const entityStatusLabel: Record<EntityMasterStatus, string> = {
  active: 'Active',
  inactive: 'Inactive',
}

export const entityStatusTone: Record<EntityMasterStatus, 'success' | 'neutral'> = {
  active: 'success',
  inactive: 'neutral',
}
