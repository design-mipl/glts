export type TaxConfigurationTab = 'gst' | 'tds'

export const TAX_CONFIGURATION_TABS: { id: TaxConfigurationTab; label: string }[] = [
  { id: 'gst', label: 'GST Rates' },
  { id: 'tds', label: 'TDS Sections' },
]
