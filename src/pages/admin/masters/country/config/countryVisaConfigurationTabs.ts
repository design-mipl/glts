export type CountryVisaConfigurationTab = 'documents' | 'vfs-rates' | 'qc-checklists'

export const COUNTRY_VISA_CONFIGURATION_TABS = [
  { value: 'documents' as const, label: 'Documents' },
  { value: 'vfs-rates' as const, label: 'VFS Rates' },
  { value: 'qc-checklists' as const, label: 'QC Checklists' },
] as const

export const DEFAULT_COUNTRY_VISA_CONFIGURATION_TAB: CountryVisaConfigurationTab = 'documents'
