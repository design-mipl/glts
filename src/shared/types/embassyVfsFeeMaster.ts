import type { MasterAuditFields, MasterRecordStatus } from '@/shared/types/masterCommon'

/** Single charge line configured under Embassy / VFS Fee Master. */
export interface EmbassyVfsFeeServiceRate {
  id: string
  serviceName: string
  amount: number
  enabled: boolean
}

/**
 * Country + visa-type rate card from Embassy / VFS Fee Master.
 * Future admin UI will CRUD these records; submission flows resolve by country + visa type.
 */
export interface EmbassyVfsFeeRateCard extends MasterAuditFields {
  id: string
  country: string
  visaType: string
  status: MasterRecordStatus
  services: EmbassyVfsFeeServiceRate[]
  notes?: string
}

export interface EmbassyVfsFeeRateCardListFilters {
  status?: MasterRecordStatus | 'all'
  country?: string
  visaType?: string
}
