import { Divider, Stack, Typography, Box } from '@mui/material'
import { commercialAgreementService } from '@/shared/services/commercialAgreementService'
import type { AgreementFinanceContactPerson, CommercialAgreementFormData } from '@/shared/types/commercialAgreement'
import { splitAgreementDocuments } from '@/shared/utils/agreementDocumentUtils'
import { deriveFinanceContactPersons, syncFinanceContactsFromSources } from '@/shared/utils/agreementFinanceContacts'
import { AgreementOnboardingDocumentCards } from '../AgreementOnboardingDocumentCards'
import { AgreementFinanceContactsPanel } from './AgreementFinanceContactsPanel'
import { FormField, Select } from '@/design-system/UIComponents'
import { formatAgreementDate } from '../../utils/agreementFormUtils'

interface AgreementOnboardingDocumentsSectionProps {
  data: CommercialAgreementFormData
  errors: Record<string, string>
  onChange: (next: CommercialAgreementFormData) => void
  onClearError: (field: string) => void
  readOnly?: boolean
}

const AGREEMENT_TYPE_OPTIONS = [
  { value: 'agreemented', label: 'Yes' },
  { value: 'non_agreemented', label: 'No' },
] as const

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

  const { onboardingDocuments, agreementDocument } = splitAgreementDocuments(data.documents)

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

  const handleSaveManualContact = (contact: AgreementFinanceContactPerson) => {
    const manual = data.manualFinanceContacts ?? []
    const exists = manual.some((item) => item.id === contact.id)
    const nextManual = exists
      ? manual.map((item) => (item.id === contact.id ? contact : item))
      : [...manual, contact]
    onChange(syncFinanceContactsFromSources({ ...data, manualFinanceContacts: nextManual }))
    onClearError('financeContacts')
  }

  const handleRemoveManualContact = (contactId: string) => {
    const nextManual = (data.manualFinanceContacts ?? []).filter((item) => item.id !== contactId)
    const nextSelected = data.selectedFinanceContactIds.filter((id) => id !== contactId)
    onChange(
      syncFinanceContactsFromSources({
        ...data,
        manualFinanceContacts: nextManual,
        selectedFinanceContactIds: nextSelected,
      }),
    )
    onClearError('financeContacts')
  }

  return (
    <Stack spacing={3} sx={{ pl: 2 }}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))' },
          gap: 2,
        }}
      >
        <Box>
          <Typography variant="caption" color="text.secondary">
            Agreement start date
          </Typography>
          <Typography variant="body2">{formatAgreementDate(data.startDate)}</Typography>
        </Box>
        <Box>
          <Typography variant="caption" color="text.secondary">
            Agreement expiry date
          </Typography>
          <Typography variant="body2">{formatAgreementDate(data.endDate)}</Typography>
        </Box>
      </Stack>

      <FormField label="Agreement type" required>
        <Select
          value={data.agreementType}
          onChange={(v) =>
            onChange(
              commercialAgreementService.syncDocumentsForAgreementType(
                data,
                v as CommercialAgreementFormData['agreementType'],
              ),
            )
          }
          options={[...AGREEMENT_TYPE_OPTIONS]}
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
          data={data}
          contacts={contacts}
          selectedContactIds={selectedContactIds}
          readOnly={readOnly}
          onRefresh={readOnly ? undefined : refreshContacts}
          onToggleContact={readOnly ? undefined : handleToggleContact}
          onSaveManualContact={readOnly ? undefined : handleSaveManualContact}
          onRemoveManualContact={readOnly ? undefined : handleRemoveManualContact}
        />
      </Stack>

      <Stack spacing={1.5}>
        <Typography variant="body2" fontWeight={600}>
          Onboarding documents
        </Typography>
        {readOnly ? (
          <AgreementOnboardingDocumentCards
            documents={onboardingDocuments}
            data={data}
            onChange={onChange}
            readOnly
          />
        ) : (
          <AgreementOnboardingDocumentCards
            documents={onboardingDocuments}
            data={data}
            onChange={onChange}
          />
        )}
      </Stack>

      {data.agreementType === 'agreemented' ? (
        <>
          <Divider />
          <Stack spacing={1.5}>
          <Typography variant="body2" fontWeight={600}>
            Agreement document
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Upload is required when this document is marked mandatory in Client Document Master.
          </Typography>
          {readOnly ? (
            agreementDocument ? (
              <AgreementOnboardingDocumentCards
                documents={[agreementDocument]}
                data={data}
                onChange={onChange}
                readOnly
              />
            ) : (
              <Typography variant="body2" color="text.secondary">
                No agreement document on file.
              </Typography>
            )
          ) : agreementDocument ? (
            <AgreementOnboardingDocumentCards
              documents={[agreementDocument]}
              data={data}
              onChange={onChange}
            />
          ) : null}
        </Stack>
        </>
      ) : null}
    </Stack>
  )
}
