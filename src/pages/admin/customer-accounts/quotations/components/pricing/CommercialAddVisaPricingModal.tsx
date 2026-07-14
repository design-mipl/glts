import { Stack } from '@mui/material'
import { useEffect, useMemo, useState } from 'react'
import {
  Button,
  Checkbox,
  FormField,
  FormSection,
  Input,
  Modal,
  RadioGroup,
  Select,
  Textarea,
} from '@/design-system/UIComponents'
import type { CommercialVisaPricingRule, CommercialVisaPricingScope } from '@/shared/types/quotation'
import { countryGroupMasterService } from '@/shared/services/countryGroupMasterService'
import {
  getCountrySelectOptions,
  getVisaTypeOptions,
} from '@/pages/admin/customer-accounts/agreements/utils/agreementMasterOptions'
import type { AgreementWorkflowType } from '@/shared/types/commercialAgreement'
import { AdminFullPageFormFieldSpan } from '@/pages/admin/components/AdminFullPageFormShell'
import { QuotationSearchableSelect } from './QuotationSearchableSelect'

interface CommercialAddVisaPricingModalProps {
  open: boolean
  workflowType: AgreementWorkflowType
  initial?: CommercialVisaPricingRule | null
  onClose: () => void
  onSave: (rule: CommercialVisaPricingRule) => void
}

function emptyRule(id?: string): CommercialVisaPricingRule {
  return {
    id: id ?? `cvr-${Math.random().toString(36).slice(2, 8)}`,
    scope: 'country',
    countryId: '',
    country: '',
    countryGroupId: undefined,
    countryGroupName: undefined,
    visaType: '',
    serviceFee: 0,
    gstApplicable: true,
    remarks: '',
  }
}

const SCOPE_OPTIONS = [
  { value: 'country', label: 'Country' },
  { value: 'country_group', label: 'Country Group' },
  { value: 'rest_of_countries_online', label: 'Rest of the countries online' },
  { value: 'rest_of_countries_offline', label: 'Rest of the countries offline' },
]

export function CommercialAddVisaPricingModal({
  open,
  workflowType,
  initial,
  onClose,
  onSave,
}: CommercialAddVisaPricingModalProps) {
  const [draft, setDraft] = useState<CommercialVisaPricingRule>(emptyRule())

  useEffect(() => {
    if (!open) return
    setDraft(initial ? structuredClone(initial) : emptyRule())
  }, [open, initial])

  const countryOptions = useMemo(() => getCountrySelectOptions(), [])
  const groupOptions = useMemo(() => countryGroupMasterService.listSelectOptions(), [])
  const visaOptions = useMemo(
    () =>
      draft.scope === 'country' && draft.countryId
        ? getVisaTypeOptions(draft.countryId, workflowType)
        : [
            { value: 'Tourist Visa', label: 'Tourist Visa' },
            { value: 'Business Visa', label: 'Business Visa' },
            { value: 'Work Visa', label: 'Work Visa' },
            { value: 'Crew Visa', label: 'Crew Visa' },
          ],
    [draft.countryId, draft.scope, workflowType],
  )

  const canSave =
    draft.serviceFee > 0 &&
    (draft.scope !== 'country' || Boolean(draft.countryId)) &&
    (draft.scope !== 'country_group' || Boolean(draft.countryGroupId))

  const patch = (partial: Partial<CommercialVisaPricingRule>) => {
    setDraft((prev) => ({ ...prev, ...partial }))
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={initial ? 'Edit Visa Pricing' : 'Add Visa Pricing'}
      subtitle="Set the GLTS service fee for a country, country group, or rest of countries (online / offline)."
      size="md"
      footer={
        <Stack direction="row" spacing={1} justifyContent="flex-end">
          <Button label="Cancel" variant="neutral" onClick={onClose} />
          <Button
            label="Save"
            disabled={!canSave}
            onClick={() => {
              if (!canSave) return
              onSave(draft)
              onClose()
            }}
          />
        </Stack>
      }
    >
      <FormSection title="Visa pricing" columns={2}>
        <AdminFullPageFormFieldSpan>
          <FormField label="Applies to" required>
            <RadioGroup
              value={draft.scope}
              onChange={(v) => {
                const scope = String(v) as CommercialVisaPricingScope
                patch({
                  scope,
                  countryId: scope === 'country' ? draft.countryId : undefined,
                  country: scope === 'country' ? draft.country : undefined,
                  countryGroupId: scope === 'country_group' ? draft.countryGroupId : undefined,
                  countryGroupName: scope === 'country_group' ? draft.countryGroupName : undefined,
                  visaType: '',
                })
              }}
              options={SCOPE_OPTIONS}
              orientation="horizontal"
              sx={{ pl: 1.5, '& .MuiFormGroup-root': { flexWrap: 'wrap', gap: 0.5 } }}
            />
          </FormField>
        </AdminFullPageFormFieldSpan>

        {draft.scope === 'country' ? (
          <FormField label="Country" required>
            <QuotationSearchableSelect
              value={draft.countryId ?? ''}
              onChange={(countryId) => {
                const match = countryOptions.find((c) => c.value === countryId)
                patch({ countryId, country: match?.label ?? '', visaType: '' })
              }}
              options={countryOptions}
              placeholder="Select country"
            />
          </FormField>
        ) : null}

        {draft.scope === 'country_group' ? (
          <FormField label="Country Group" required>
            <QuotationSearchableSelect
              value={draft.countryGroupId ?? ''}
              onChange={(countryGroupId) => {
                const match = groupOptions.find((g) => g.value === countryGroupId)
                patch({
                  countryGroupId,
                  countryGroupName: match?.label ?? '',
                })
              }}
              options={groupOptions}
              placeholder="Select country group"
            />
          </FormField>
        ) : null}

        <FormField label="Visa Type">
          <Select
            value={draft.visaType}
            onChange={(v) => patch({ visaType: String(v) })}
            options={visaOptions}
            placeholder="Select visa type"
            fullWidth
            disabled={draft.scope === 'country' && !draft.countryId}
          />
        </FormField>

        <FormField label="GLTS Service Fee" required>
          <Input
            type="number"
            value={String(draft.serviceFee || '')}
            onChange={(v) => patch({ serviceFee: Number(v) || 0 })}
            placeholder="Enter fee amount"
            fullWidth
          />
        </FormField>

        <FormField label="GST Applicable">
          <Checkbox
            checked={draft.gstApplicable}
            onChange={(checked) => patch({ gstApplicable: checked })}
          />
        </FormField>

        <AdminFullPageFormFieldSpan>
          <FormField label="Remarks">
            <Textarea
              value={draft.remarks}
              onChange={(v) => patch({ remarks: v })}
              placeholder="Optional remarks"
              minRows={2}
              fullWidth
            />
          </FormField>
        </AdminFullPageFormFieldSpan>
      </FormSection>
    </Modal>
  )
}
