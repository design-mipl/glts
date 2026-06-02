import { Stack, Typography } from '@mui/material'
import { commercialAgreementService } from '@/shared/services/commercialAgreementService'
import type { CommercialAgreementFormData } from '@/shared/types/commercialAgreement'
import { deriveFinanceContactPersons, syncFinanceContactsFromSources } from '@/shared/utils/agreementFinanceContacts'
import { AgreementOnboardingDocumentCards } from '../AgreementOnboardingDocumentCards'
import { AgreementFinanceContactsPanel } from './AgreementFinanceContactsPanel'
import { FormField, Select } from '@/design-system/UIComponents'

interface AgreementOnboardingDocumentsSectionProps {
  data: CommercialAgreementFormData
  errors: Record<string, string>
  onChange: (next: CommercialAgreementFormData) => void
  onClearError: (field: string) => void
  readOnly?: boolean
}

export function AgreementOnboardingDocumentsSection({
  data,
  errors,
  onChange,
  onClearError,
  readOnly = false,
}: AgreementOnboardingDocumentsSectionProps) {
  const syncedData = syncFinanceContactsFromSources(data)
  const contacts = deriveFinanceContactPersons(data)
  const selectedContactIds =
    data.selectedFinanceContactIds.length > 0
      ? data.selectedFinanceContactIds
      : contacts.map((contact) => contact.id)

  const refreshContacts = () => {
    onChange(syncedData)
    onClearError('financeContacts')
  }

  const handleToggleContact = (contactId: string, checked: boolean) => {
    const current = new Set(selectedContactIds)
    if (checked) current.add(contactId)
    else current.delete(contactId)
    onChange(syncFinanceContactsFromSources({ ...data, selectedFinanceContactIds: Array.from(current) }))
    onClearError('financeContacts')
  }

  return (
    <Stack spacing={3}>
      <FormField label="Agreement type" required>
        <Select
          value={data.agreementType}
          onChange={(v) => onChange(commercialAgreementService.syncDocumentsForAgreementType(data, v as CommercialAgreementFormData['agreementType']))}
          options={[
            { value: 'agreemented', label: 'Agreemented' },
            { value: 'non_agreemented', label: 'Non-agreemented' },
          ]}
          placeholder="Select agreement type"
          fullWidth
          disabled={readOnly}
        />
      </FormField>

      <Stack spacing={1.5}>
        <Typography variant="body2" fontWeight={600}>
          Finance contacts
        </Typography>
        {errors.financeContacts ? (
          <Typography variant="caption" color="error.main">
            {errors.financeContacts}
          </Typography>
        ) : null}
        <AgreementFinanceContactsPanel
          contacts={contacts}
          selectedContactIds={selectedContactIds}
          readOnly={readOnly}
          onRefresh={readOnly ? undefined : refreshContacts}
          onToggleContact={readOnly ? undefined : handleToggleContact}
        />
      </Stack>

      <Stack spacing={1.5}>
        <Typography variant="body2" fontWeight={600}>
          Onboarding documents
        </Typography>
        {readOnly ? (
          <Stack spacing={0.5}>
            {data.documents.map((doc) => (
              <Typography key={doc.documentKey} variant="body2">
                {doc.name} · {doc.status}
              </Typography>
            ))}
          </Stack>
        ) : (
          <AgreementOnboardingDocumentCards data={data} onChange={onChange} />
        )}
      </Stack>
    </Stack>
  )
}
