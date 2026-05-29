export type VesselMasterStatus = 'active' | 'inactive'

export type VesselType =
  | 'bulk_carrier'
  | 'tanker'
  | 'container'
  | 'offshore'
  | 'other'

export interface VesselActivity {
  id: string
  timestamp: string
  actor: string
  action: string
  detail: string
}

export interface VesselMaster {
  id: string
  corporateAccountId?: string
  linkedEntityId?: string
  vesselName: string
  imoNumber: string
  vesselType: VesselType
  flagCountry: string
  portOfRegistry: string
  contactPersonName: string
  contactPersonEmail: string
  contactPersonMobile: string
  status: VesselMasterStatus
  notes: string
  createdAt: string
  updatedAt: string
  activities: VesselActivity[]
}

export interface VesselMasterFormData {
  linkedEntityId: string
  vesselName: string
  imoNumber: string
  vesselType: VesselType
  flagCountry: string
  portOfRegistry: string
  contactPersonName: string
  contactPersonEmail: string
  contactPersonMobile: string
  status: VesselMasterStatus
  notes: string
}

export interface VesselMasterListFilters {
  status?: VesselMasterStatus | 'all'
  vesselType?: VesselType | 'all'
  flagCountry?: string
  corporateAccountId?: string
  linkedEntityId?: string
  query?: string
}

export type VesselMasterDeleteResult =
  | { ok: true }
  | { ok: false; reason: 'not_found' | 'in_use' }
