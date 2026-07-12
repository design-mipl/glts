import { Box, Divider, Stack, Typography } from '@mui/material'
import { useEffect, useMemo, useState } from 'react'
import { Button, FormField, FormSection, Modal, Select } from '@/design-system/UIComponents'
import type { AgreementWorkflowType } from '@/shared/types/commercialAgreement'
import type { QuotationServiceLine, QuotationVfsServiceLine, RetailVisaPricingItem } from '@/shared/types/quotation'
import { formatInr } from '@/shared/utils/invoiceCalculations'
import { getCountrySelectOptions } from '@/pages/admin/customer-accounts/agreements/utils/agreementMasterOptions'
import {
  getJurisdictionSelectOptions,
  getServiceMasterPickerOptions,
  getVisaTypeSelectOptionsWithIds,
} from '../../utils/quotationMasterOptions'
import { QuotationSearchableSelect } from './QuotationSearchableSelect'
import { SearchableServicePicker, SelectedServiceList } from './SearchableServicePicker'
import { VfsServiceSelector } from './VfsServiceSelector'

interface RetailAddPricingModalProps {
  open: boolean
  workflowType: AgreementWorkflowType
  initial?: RetailVisaPricingItem | null
  onClose: () => void
  onSave: (item: RetailVisaPricingItem) => void
}

function emptyDraft(id?: string): RetailVisaPricingItem {
  return {
    id: id ?? `rvp-${Math.random().toString(36).slice(2, 8)}`,
    countryId: '',
    country: '',
    visaType: '',
    visaTypeId: undefined,
    jurisdictionId: undefined,
    jurisdictionName: undefined,
    gltsServices: [],
    vfsServices: [],
  }
}

export function RetailAddPricingModal({
  open,
  workflowType,
  initial,
  onClose,
  onSave,
}: RetailAddPricingModalProps) {
  const [draft, setDraft] = useState<RetailVisaPricingItem>(emptyDraft())

  useEffect(() => {
    if (!open) return
    setDraft(initial ? structuredClone(initial) : emptyDraft())
  }, [open, initial])

  const countryOptions = useMemo(() => getCountrySelectOptions(), [])
  const visaOptions = useMemo(
    () => (draft.countryId ? getVisaTypeSelectOptionsWithIds(draft.countryId, workflowType) : []),
    [draft.countryId, workflowType],
  )
  const jurisdictionOptions = useMemo(
    () =>
      draft.countryId && draft.visaTypeId
        ? getJurisdictionSelectOptions(draft.countryId, draft.visaTypeId)
        : [],
    [draft.countryId, draft.visaTypeId],
  )
  const gltsOptions = useMemo(
    () => getServiceMasterPickerOptions(workflowType, { excludeServiceTypes: ['vfs'] }),
    [workflowType],
  )

  useEffect(() => {
    if (!open) return
    if (jurisdictionOptions.length === 1 && !draft.jurisdictionId) {
      const only = jurisdictionOptions[0]!
      setDraft((prev) => ({
        ...prev,
        jurisdictionId: only.value,
        jurisdictionName: only.label,
      }))
    }
  }, [draft.jurisdictionId, jurisdictionOptions, open])

  const gltsTotal = draft.gltsServices.reduce((s, x) => s + x.amount, 0)
  const vfsTotal = draft.vfsServices.reduce((s, x) => s + x.amount, 0)
  const runningTotal = gltsTotal + vfsTotal
  const selectedCount = draft.gltsServices.length + draft.vfsServices.length

  const canSave =
    Boolean(draft.countryId) &&
    Boolean(draft.visaType.trim()) &&
    (draft.gltsServices.length > 0 || draft.vfsServices.length > 0)

  const patch = (partial: Partial<RetailVisaPricingItem>) => {
    setDraft((prev) => ({ ...prev, ...partial }))
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={initial ? 'Edit Visa Pricing' : 'Add Visa Pricing'}
      subtitle="Configure GLTS and VFS services for one country visa quotation."
      size="md"
      footer={
        <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between" sx={{ width: 1 }}>
          <Stack spacing={0.25}>
            <Typography variant="caption" color="text.secondary">
              Selected services · {selectedCount}
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 700 }}>
              Running total {formatInr(runningTotal)}
            </Typography>
          </Stack>
          <Stack direction="row" spacing={1}>
            <Button label="Cancel" variant="neutral" onClick={onClose} />
            <Button
              label="Save"
              onClick={() => {
                if (!canSave) return
                onSave(draft)
                onClose()
              }}
              disabled={!canSave}
            />
          </Stack>
        </Stack>
      }
    >
      <Stack spacing={2.5}>
        <FormSection title="Visa Details" columns={2}>
          <FormField label="Country" required>
            <QuotationSearchableSelect
              value={draft.countryId}
              onChange={(countryId) => {
                const country = countryOptions.find((c) => c.value === countryId)
                patch({
                  countryId,
                  country: country?.label ?? '',
                  visaType: '',
                  visaTypeId: undefined,
                  jurisdictionId: undefined,
                  jurisdictionName: undefined,
                  vfsServices: [],
                })
              }}
              options={countryOptions}
              placeholder="Select country"
            />
          </FormField>
          <FormField label="Visa Type" required>
            <Select
              value={draft.visaType}
              onChange={(v) => {
                const name = String(v)
                const match = visaOptions.find((o) => o.value === name)
                patch({
                  visaType: name,
                  visaTypeId: match?.offeringId,
                  jurisdictionId: undefined,
                  jurisdictionName: undefined,
                  vfsServices: [],
                })
              }}
              options={visaOptions}
              placeholder="Select visa type"
              fullWidth
              disabled={!draft.countryId}
            />
          </FormField>
          {jurisdictionOptions.length > 0 ? (
            <FormField label="Jurisdiction">
              <Select
                value={draft.jurisdictionId ?? ''}
                onChange={(v) => {
                  const jurisdictionId = String(v)
                  const match = jurisdictionOptions.find((o) => o.value === jurisdictionId)
                  patch({
                    jurisdictionId: jurisdictionId || undefined,
                    jurisdictionName: match?.label,
                    vfsServices: [],
                  })
                }}
                options={[{ value: '', label: 'Select jurisdiction' }, ...jurisdictionOptions]}
                placeholder="Select jurisdiction"
                fullWidth
              />
            </FormField>
          ) : null}
        </FormSection>

        <Divider />

        <Box>
          <Typography variant="subtitle2" sx={{ mb: 1.25, fontWeight: 700 }}>
            GLTS Services
          </Typography>
          <Stack spacing={1.5}>
            <SearchableServicePicker
              options={gltsOptions}
              selected={draft.gltsServices}
              onChange={(gltsServices: QuotationServiceLine[]) => patch({ gltsServices })}
            />
            <SelectedServiceList
              services={draft.gltsServices}
              onChange={(gltsServices) => patch({ gltsServices })}
            />
          </Stack>
        </Box>

        <Divider />

        <Box>
          <Typography variant="subtitle2" sx={{ mb: 1.25, fontWeight: 700 }}>
            VFS Services
          </Typography>
          <VfsServiceSelector
            country={draft.country}
            visaType={draft.visaType}
            countryId={draft.countryId || undefined}
            visaOfferingId={draft.visaTypeId}
            jurisdictionId={draft.jurisdictionId}
            selected={draft.vfsServices}
            onChange={(vfsServices: QuotationVfsServiceLine[]) => patch({ vfsServices })}
          />
        </Box>
      </Stack>
    </Modal>
  )
}
