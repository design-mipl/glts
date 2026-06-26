export type CompanyType = 'private_limited' | 'public_limited' | 'partnership' | 'sole_proprietorship' | 'other'

export interface CompanyActivity {
  id: string
  timestamp: string
  actor: string
  action: string
  detail: string
}

export interface CompanyMaster {
  id: string
  companyName: string
  companyType: CompanyType | string
  industryType: string
  contactPersonName: string
  contactNumber: string
  emailAddress: string
  companyAddress: string
  countryId: string
  country: string
  state: string
  city: string
  pincode: string
  billingEntityName: string
  billingAddress: string
  gstNumber: string
  panNumber: string
  createdAt: string
  updatedAt: string
  activities: CompanyActivity[]
}

export interface CompanyMasterFormData {
  companyName: string
  companyType: CompanyType | string
  industryType: string
  contactPersonName: string
  contactNumber: string
  emailAddress: string
  companyAddress: string
  countryId: string
  country: string
  state: string
  city: string
  pincode: string
  billingEntityName: string
  billingAddress: string
  gstNumber: string
  panNumber: string
}

export interface CompanyMasterListFilters {
  query?: string
  industryType?: string
}
