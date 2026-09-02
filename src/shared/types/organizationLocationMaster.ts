import type { MasterAuditFields } from './masterCommon'

export type OrganizationType = 'glts_branch' | 'partner'

export interface OrganizationLocationMaster extends MasterAuditFields {
  id: string
  name: string
  organizationType: OrganizationType
  contactPerson: string
  mobileNumber: string
  emailAddress: string
  address: string
  countryId: string
  country: string
  state: string
  city: string
  pincode: string
}

export interface OrganizationLocationMasterFormData {
  name: string
  organizationType: OrganizationType
  contactPerson: string
  mobileNumber: string
  emailAddress: string
  address: string
  countryId: string
  country: string
  state: string
  city: string
  pincode: string
}

export interface OrganizationLocationMasterListFilters {
  organizationType?: OrganizationType | 'all'
}
