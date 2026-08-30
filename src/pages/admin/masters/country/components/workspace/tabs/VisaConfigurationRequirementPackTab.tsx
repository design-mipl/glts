import { useMemo } from 'react'
import { Box, Stack, Typography } from '@mui/material'
import { FormField, Select } from '@/design-system/UIComponents'
import { documentMasterService } from '@/shared/services/documentMasterService'
import { requirementMasterService } from '@/shared/services/requirementMasterService'
import type { BusinessSegment, CountryMasterFormData } from '@/shared/types/countryMaster'
import { collectRequirementDocumentIds } from '@/shared/types/requirementMaster'
import { getActiveRequirementPackSelectOptions } from '@/shared/utils/countryRequirementPackUtils'
import { COUNTRY_WORKSPACE_LAYOUT } from '../../../config/countryWorkspaceLayout'
import type { VisaConfigurationScope } from './VisaConfigurationDocumentsTab'

interface VisaConfigurationRequirementPackTabProps {
  scope: VisaConfigurationScope
  segment: BusinessSegment
  visaTypeId: string
  jurisdictionId?: string
  formData: CountryMasterFormData
  onChange: (next: CountryMasterFormData) => void
  readOnly: boolean
}

function documentLabel(documentId: string): string {
  return documentMasterService.getById(documentId)?.documentType ?? documentId
}

export function VisaConfigurationRequirementPackTab({
  scope,
  segment,
  visaTypeId,
  jurisdictionId,
  formData,
  onChange,
  readOnly,
}: VisaConfigurationRequirementPackTabProps) {
  const segConfig = formData.segments.find((s) => s.segment === segment)
  const visaType = segConfig?.visaTypes.find((v) => v.id === visaTypeId)
  const jurisdiction =
    scope === 'jurisdiction' && jurisdictionId
      ? visaType?.jurisdictions?.find((j) => j.id === jurisdictionId)
      : undefined

  const packOptions = useMemo(
    () => [{ value: '', label: 'Not mapped' }, ...getActiveRequirementPackSelectOptions()],
    [],
  )

  if (!visaType || !segConfig) return null
  if (scope === 'jurisdiction' && !jurisdiction) return null

  const selectedPackId =
    scope === 'jurisdiction'
      ? (jurisdiction?.requirementPackId ?? '')
      : (visaType.requirementPackId ?? '')

  const selectedPack = selectedPackId
    ? requirementMasterService.getById(selectedPackId)
    : undefined

  const segmentDefaultLabel = segConfig.requirementPackId
    ? requirementMasterService.getById(segConfig.requirementPackId)?.name ??
      segConfig.requirementPackId
    : null

  const visaTypePackLabel = visaType.requirementPackId
    ? requirementMasterService.getById(visaType.requirementPackId)?.name ??
      visaType.requirementPackId
    : null

  const patchPack = (requirementPackId: string | null) => {
    if (scope === 'jurisdiction' && jurisdictionId) {
      onChange({
        ...formData,
        segments: formData.segments.map((s) =>
          s.segment === segment
            ? {
                ...s,
                visaTypes: s.visaTypes.map((v) =>
                  v.id === visaTypeId
                    ? {
                        ...v,
                        jurisdictions: (v.jurisdictions ?? []).map((j) =>
                          j.id === jurisdictionId ? { ...j, requirementPackId } : j,
                        ),
                      }
                    : v,
                ),
              }
            : s,
        ),
      })
      return
    }

    onChange({
      ...formData,
      segments: formData.segments.map((s) =>
        s.segment === segment
          ? {
              ...s,
              visaTypes: s.visaTypes.map((v) =>
                v.id === visaTypeId ? { ...v, requirementPackId } : v,
              ),
            }
          : s,
      ),
    })
  }

  const helperText =
    scope === 'jurisdiction'
      ? segmentDefaultLabel || visaTypePackLabel
        ? `Maps this consulate’s retail intake pack. Unmapped falls back to ${
            visaTypePackLabel
              ? `visa type (${visaTypePackLabel})`
              : `segment default (${segmentDefaultLabel})`
          }.`
        : 'Select a Requirement Master pack for retail intake at this jurisdiction.'
      : segmentDefaultLabel
        ? `Leave unmapped to inherit segment default (${segmentDefaultLabel}). Packs are managed in Requirement Master.`
        : 'Select a Requirement Master pack for retail intake questions. Leave unmapped if none apply.'

  const emptyHint =
    scope === 'jurisdiction'
      ? visaTypePackLabel
        ? `No jurisdiction pack. Retail will fall back to the visa-type pack (${visaTypePackLabel}).`
        : segmentDefaultLabel
          ? `No jurisdiction pack. Retail will fall back to the segment default (${segmentDefaultLabel}).`
          : 'No pack mapped. Retail apply will fall back to any hardcoded journey rules for this offering.'
      : segmentDefaultLabel
        ? `No visa-type override. Retail will use the segment default pack (${segmentDefaultLabel}).`
        : 'No pack mapped. Retail apply will fall back to any hardcoded journey rules for this offering.'

  const documentCount = selectedPack ? collectRequirementDocumentIds(selectedPack).length : 0

  return (
    <Stack spacing={COUNTRY_WORKSPACE_LAYOUT.sectionStackGap}>
      <FormField label="Requirement pack" helperText={helperText}>
        <Select
          value={selectedPackId}
          onChange={(v) => {
            const next = String(v)
            patchPack(next ? next : null)
          }}
          options={packOptions}
          placeholder="Select requirement pack"
          size="sm"
          disabled={readOnly}
          fullWidth
        />
      </FormField>

      {selectedPack ? (
        <Box
          sx={{
            border: 1,
            borderColor: 'divider',
            borderRadius: '10px',
            p: 2,
          }}
        >
          <Stack spacing={1.5}>
            <Box>
              <Typography variant="subtitle2" fontWeight={600}>
                {selectedPack.name}
              </Typography>
              {selectedPack.description ? (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  {selectedPack.description}
                </Typography>
              ) : null}
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.75 }}>
                {selectedPack.questions.length} questions · {documentCount} documents
              </Typography>
            </Box>

            {selectedPack.questions.map((question) => (
              <Box key={question.id}>
                <Typography variant="body2" fontWeight={600}>
                  {question.prompt}
                  {question.required ? (
                    <Typography component="span" variant="caption" color="error.main" sx={{ ml: 0.5 }}>
                      *
                    </Typography>
                  ) : null}
                </Typography>
                <Stack spacing={0.5} sx={{ mt: 0.75, pl: 1.5 }}>
                  {question.options.map((option) => (
                    <Typography key={option.id} variant="caption" color="text.secondary" component="div">
                      {option.label}
                      {option.documentIds.length > 0
                        ? ` → ${option.documentIds.map(documentLabel).join(', ')}`
                        : ' → no extra documents'}
                    </Typography>
                  ))}
                </Stack>
              </Box>
            ))}
          </Stack>
        </Box>
      ) : (
        <Typography variant="body2" color="text.secondary">
          {emptyHint}
        </Typography>
      )}
    </Stack>
  )
}
