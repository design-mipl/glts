export type CountryVisaConfigurationTab =
  | 'documents'
  | 'vfs-rates'
  | 'qc-checklists'
  | 'requirement-pack'

export const COUNTRY_VISA_CONFIGURATION_OPERATIONAL_TABS = [
  { value: 'documents' as const, label: 'Documents' },
  { value: 'vfs-rates' as const, label: 'Consulate Rates' },
  { value: 'qc-checklists' as const, label: 'QC Checklists' },
] as const

export const COUNTRY_VISA_CONFIGURATION_REQUIREMENT_PACK_TAB = {
  value: 'requirement-pack' as const,
  label: 'Requirement pack',
} as const

/** @deprecated Prefer building tabs via `getCountryVisaConfigurationTabs`. */
export const COUNTRY_VISA_CONFIGURATION_TABS = COUNTRY_VISA_CONFIGURATION_OPERATIONAL_TABS

export const DEFAULT_COUNTRY_VISA_CONFIGURATION_TAB: CountryVisaConfigurationTab = 'documents'

export function getCountryVisaConfigurationTabs(options: {
  includeOperationalTabs: boolean
  includeRequirementPack: boolean
}): { value: CountryVisaConfigurationTab; label: string }[] {
  const tabs: { value: CountryVisaConfigurationTab; label: string }[] = []
  if (options.includeOperationalTabs) {
    tabs.push(...COUNTRY_VISA_CONFIGURATION_OPERATIONAL_TABS)
  }
  if (options.includeRequirementPack) {
    tabs.push(COUNTRY_VISA_CONFIGURATION_REQUIREMENT_PACK_TAB)
  }
  return tabs
}
