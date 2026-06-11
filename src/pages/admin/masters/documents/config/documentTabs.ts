export type DocumentConfigurationTab = 'documents' | 'client'

export const DOCUMENT_CONFIGURATION_TABS: { id: DocumentConfigurationTab; label: string }[] = [
  { id: 'documents', label: 'Document Master' },
  { id: 'client', label: 'Client Document Master' },
]
