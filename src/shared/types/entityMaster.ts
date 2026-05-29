export type EntityMasterStatus = 'active' | 'inactive'

export interface EntityActivity {
  id: string
  timestamp: string
  actor: string
  action: string
  detail: string
}

export interface EntityMaster {
  id: string
  corporateAccountId?: string
  entityName: string
  contactPersonName: string
  contactPersonEmail: string
  contactPersonMobile: string
  location: string
  city: string
  country: string
  status: EntityMasterStatus
  notes: string
  createdAt: string
  updatedAt: string
  activities: EntityActivity[]
}

export interface EntityMasterFormData {
  entityName: string
  contactPersonName: string
  contactPersonEmail: string
  contactPersonMobile: string
  location: string
  city: string
  country: string
  status: EntityMasterStatus
  notes: string
}

export interface EntityMasterListFilters {
  status?: EntityMasterStatus | 'all'
  country?: string
  corporateAccountId?: string
  query?: string
}

export type EntityMasterDeleteResult =
  | { ok: true }
  | { ok: false; reason: 'not_found' | 'in_use' }
