import { useMemo, useState } from 'react'
import type { Dispatch, SetStateAction } from 'react'
import { Box, Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material'
import { Plus, Trash2 } from 'lucide-react'
import { Button, FormField, IconButton, Input, Select } from '@/design-system/UIComponents'
import type { EnquiryFormData } from '@/shared/types/enquiry'
import {
  agreementEmbeddedTableHeadCellSx,
  agreementEmbeddedTableSx,
} from '@/pages/admin/customer-accounts/agreements/components/agreementFormLayout'
import {
  getEnquiryCountryOptions,
  getEnquiryVisaTypeOptions,
  resolveEnquiryCountryName,
} from '../utils/enquiryMasterOptions'
import {
  getVisaRequirementItems,
  purposeOfVisitTableTextSx,
  syncVisaRequirementFromItems,
} from '@/shared/utils/enquiryVisaRequirementUtils'
interface EnquiryVisaRequirementSectionProps {
  formData: EnquiryFormData
  setFormData: Dispatch<SetStateAction<EnquiryFormData>>
  countriesError?: string
  visaRequirementsError?: string
}

const EMPTY_DRAFT = {
  countryId: '',
  visaType: '',
  purposeOfVisit: '',
}

export function EnquiryVisaRequirementSection({
  formData,
  setFormData,
  countriesError,
  visaRequirementsError,
}: EnquiryVisaRequirementSectionProps) {
  const [draft, setDraft] = useState(EMPTY_DRAFT)
  const [draftError, setDraftError] = useState<string | undefined>()

  const items = getVisaRequirementItems(formData.visaRequirement)
  const countryOptions = useMemo(() => getEnquiryCountryOptions(), [])
  const visaTypeOptions = useMemo(
    () => getEnquiryVisaTypeOptions(draft.countryId, formData.customer.customerType),
    [draft.countryId, formData.customer.customerType],
  )

  const updateItems = (nextItems: ReturnType<typeof getVisaRequirementItems>) => {
    setFormData((prev) => ({
      ...prev,
      visaRequirement: {
        ...prev.visaRequirement,
        ...syncVisaRequirementFromItems(nextItems),
      },
    }))
  }

  const handleAdd = () => {
    const countryName = resolveEnquiryCountryName(draft.countryId)

    if (!draft.countryId) {
      setDraftError('Select a country')
      return
    }
    if (!draft.visaType.trim()) {
      setDraftError(visaTypeOptions.length === 0 ? 'No visa types configured for this country' : 'Visa type is required')
      return
    }
    updateItems([
      ...items,
      {
        id: `vri-${Date.now()}`,
        country: countryName,
        visaType: draft.visaType.trim(),
        purposeOfVisit: draft.purposeOfVisit.trim(),
      },
    ])
    setDraft(EMPTY_DRAFT)
    setDraftError(undefined)
  }

  const handleRemove = (id: string) => {
    updateItems(items.filter((item) => item.id !== id))
  }

  const listError = visaRequirementsError || countriesError

  return (
    <Stack spacing={2}>
      <Stack spacing={1.5}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 1.5,
            alignItems: 'start',
          }}
        >
          <FormField label="Country" required error={Boolean(draftError && !draft.countryId)} helperText={draftError && !draft.countryId ? draftError : undefined}>
            <Select
              value={draft.countryId}
              onChange={(value) => {
                setDraft({ countryId: String(value), visaType: '', purposeOfVisit: draft.purposeOfVisit })
                setDraftError(undefined)
              }}
              options={countryOptions}
              placeholder="Select country"
              fullWidth
            />
          </FormField>
          <FormField
            label="Visa Type"
            error={Boolean(draftError && draft.countryId && !draft.visaType.trim())}
            helperText={
              draftError === 'Visa type is required'
                ? draftError
                : !draft.countryId
                  ? 'Select a country first'
                  : visaTypeOptions.length === 0
                    ? 'No visa types configured for this country'
                    : undefined
            }
          >
            <Select
              value={draft.visaType}
              onChange={(value) => {
                setDraft((prev) => ({ ...prev, visaType: String(value) }))
                setDraftError(undefined)
              }}
              options={visaTypeOptions}
              placeholder="Select visa type"
              fullWidth
              disabled={!draft.countryId || visaTypeOptions.length === 0}
            />
          </FormField>
        </Box>
        <FormField label="Purpose of Visit">
          <Input
            value={draft.purposeOfVisit}
            onChange={(value) => setDraft((prev) => ({ ...prev, purposeOfVisit: value }))}
            placeholder="e.g. Conference, crew change"
            size="sm"
            fullWidth
          />
        </FormField>
        <Button
          label="Add country requirement"
          variant="neutral"
          startIcon={<Plus size={14} />}
          onClick={handleAdd}
        />
      </Stack>

      {listError ? (
        <Typography variant="caption" color="error">
          {listError}
        </Typography>
      ) : null}

      {items.length === 0 ? (
        <Box sx={{ py: 3, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            No country requirements added yet. Select a country, visa type, and purpose, then add to the list.
          </Typography>
        </Box>
      ) : (
        <Box sx={agreementEmbeddedTableSx}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={agreementEmbeddedTableHeadCellSx}>Country</TableCell>
                <TableCell sx={agreementEmbeddedTableHeadCellSx}>Visa Type</TableCell>
                <TableCell sx={{ ...agreementEmbeddedTableHeadCellSx, width: '36%' }}>Purpose of Visit</TableCell>
                <TableCell sx={agreementEmbeddedTableHeadCellSx} align="center">
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.country}</TableCell>
                  <TableCell>{item.visaType}</TableCell>
                  <TableCell sx={{ maxWidth: 0, width: '36%' }}>
                    <Typography variant="body2" sx={purposeOfVisitTableTextSx}>
                      {item.purposeOfVisit || '—'}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      icon={<Trash2 size={14} />}
                      variant="soft"
                      color="error"
                      tooltip="Remove requirement"
                      onClick={() => handleRemove(item.id)}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      )}
    </Stack>
  )
}
