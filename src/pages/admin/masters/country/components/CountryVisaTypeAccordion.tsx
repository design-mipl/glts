import { useState } from 'react'
import { Box, Collapse, Grid, IconButton, Stack, Typography } from '@mui/material'
import { ChevronDown, Copy, Trash2 } from 'lucide-react'
import { Button, FormField, Input, Select } from '@/design-system/UIComponents'
import type { CountryVisaType, VisaTypeStatus } from '@/shared/types/countryMaster'
import { VISA_CATEGORY_OPTIONS } from '../config/countryProcessingConfig'

function purposeIdFromLabel(label: string): string | undefined {
  const slug = label
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_|_$/g, '')
  return slug ? slug.slice(0, 32) : undefined
}
import { SEGMENT_LABELS } from '../config/countrySegmentConfig'
import type { BusinessSegment } from '@/shared/types/countryMaster'

interface CountryVisaTypeAccordionProps {
  segment: BusinessSegment
  visaType: CountryVisaType
  onChange: (next: CountryVisaType) => void
  onRemove: () => void
  onDuplicate: () => void
  defaultExpanded?: boolean
}

export function CountryVisaTypeAccordion({
  segment,
  visaType,
  onChange,
  onRemove,
  onDuplicate,
  defaultExpanded = false,
}: CountryVisaTypeAccordionProps) {
  const [expanded, setExpanded] = useState(defaultExpanded)
  const patch = (partial: Partial<CountryVisaType>) => onChange({ ...visaType, ...partial })

  return (
    <Box
      sx={{
        border: 1,
        borderColor: 'divider',
        borderRadius: 2,
        overflow: 'hidden',
        bgcolor: 'background.paper',
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ px: 2, py: 1.25, cursor: 'pointer', bgcolor: 'action.hover' }}
        onClick={() => setExpanded((v) => !v)}
      >
        <Stack direction="row" spacing={1} alignItems="center">
          <ChevronDown
            size={18}
            style={{
              transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.2s',
            }}
          />
          <Box>
            <Typography variant="body2" fontWeight={700}>
              {visaType.name || 'New visa type'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {SEGMENT_LABELS[segment]}
              {visaType.purposeLabel ? ` · ${visaType.purposeLabel}` : ''}
              {visaType.processingTime ? ` · ${visaType.processingTime}` : ' · Processing time TBD'}
            </Typography>
          </Box>
        </Stack>
        <Stack direction="row" spacing={0.5} onClick={(e) => e.stopPropagation()}>
          <IconButton size="small" aria-label="Duplicate" onClick={onDuplicate}>
            <Copy size={16} />
          </IconButton>
          <IconButton size="small" aria-label="Remove" onClick={onRemove}>
            <Trash2 size={16} />
          </IconButton>
        </Stack>
      </Stack>
      <Collapse in={expanded}>
        <Box sx={{ p: 2, pt: 1 }}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <FormField label="Visa type name">
                <Input value={visaType.name} onChange={(value) => patch({ name: value })} />
              </FormField>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <FormField label="Visa category">
                <Select
                  value={visaType.visaCategory}
                  onChange={(value) => patch({ visaCategory: String(value) })}
                  options={VISA_CATEGORY_OPTIONS.map((v) => ({ value: v, label: v }))}
                />
              </FormField>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <FormField label="Purpose of visit">
                <Input
                  value={visaType.purposeLabel ?? ''}
                  onChange={(value) =>
                    patch({
                      purposeLabel: value,
                      purposeId: purposeIdFromLabel(value),
                    })
                  }
                  placeholder="e.g. Conference, family visit, crew change"
                />
              </FormField>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <FormField label="Processing time">
                <Input
                  value={visaType.processingTime}
                  onChange={(value) => patch({ processingTime: value })}
                />
              </FormField>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <FormField label="Entry type">
                <Input value={visaType.entryType} onChange={(value) => patch({ entryType: value })} />
              </FormField>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <FormField label="Validity">
                <Input value={visaType.validity} onChange={(value) => patch({ validity: value })} />
              </FormField>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <FormField label="Stay duration">
                <Input
                  value={visaType.stayDuration}
                  onChange={(value) => patch({ stayDuration: value })}
                />
              </FormField>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <FormField label="Status">
                <Select
                  value={visaType.status}
                  onChange={(value) => patch({ status: value as VisaTypeStatus })}
                  options={[
                    { value: 'active', label: 'Active' },
                    { value: 'inactive', label: 'Inactive' },
                  ]}
                />
              </FormField>
            </Grid>
          </Grid>
        </Box>
      </Collapse>
    </Box>
  )
}

interface CountryVisaTypesStepProps {
  data: import('@/shared/types/countryMaster').CountryMasterFormData
  onChange: (next: import('@/shared/types/countryMaster').CountryMasterFormData) => void
}

function newVisaTypeId() {
  return `vt-${Date.now()}-${Math.floor(Math.random() * 1000)}`
}

export function CountryFormVisaTypesStep({ data, onChange }: CountryVisaTypesStepProps) {
  const enabledSegments = data.segments.filter((s) => s.enabled)

  const updateSegmentVisaTypes = (
    segment: BusinessSegment,
    visaTypes: CountryVisaType[],
  ) => {
    onChange({
      ...data,
      segments: data.segments.map((s) =>
        s.segment === segment ? { ...s, visaTypes } : s,
      ),
    })
  }

  const addVisaType = (segment: BusinessSegment) => {
    const seg = data.segments.find((s) => s.segment === segment)
    if (!seg) return
    const next: CountryVisaType = {
      id: newVisaTypeId(),
      name: '',
      visaCategory: 'Tourism',
      processingTime: '',
      entryType: '',
      validity: '',
      stayDuration: '',
      prioritySupport: false,
      status: 'active',
      jurisdictions: [],
      applicationDocuments: [],
    }
    updateSegmentVisaTypes(segment, [...seg.visaTypes, next])
  }

  if (enabledSegments.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary">
        Enable at least one business segment in the previous step.
      </Typography>
    )
  }

  return (
    <Stack spacing={3}>
      {enabledSegments.map((seg) => (
        <Box key={seg.segment}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
            <Typography variant="subtitle2" fontWeight={700}>
              {SEGMENT_LABELS[seg.segment]}
            </Typography>
            <Button
              label={`Add ${SEGMENT_LABELS[seg.segment]} visa type`}
              variant="outlined"
              size="sm"
              onClick={() => addVisaType(seg.segment)}
            />
          </Stack>
          <Stack spacing={1}>
            {seg.visaTypes.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                No visa types yet. Add one to continue.
              </Typography>
            ) : (
              seg.visaTypes.map((vt, index) => (
                <CountryVisaTypeAccordion
                  key={vt.id}
                  segment={seg.segment}
                  visaType={vt}
                  defaultExpanded={index === seg.visaTypes.length - 1}
                  onChange={(next) =>
                    updateSegmentVisaTypes(
                      seg.segment,
                      seg.visaTypes.map((v) => (v.id === vt.id ? next : v)),
                    )
                  }
                  onRemove={() =>
                    updateSegmentVisaTypes(
                      seg.segment,
                      seg.visaTypes.filter((v) => v.id !== vt.id),
                    )
                  }
                  onDuplicate={() => {
                    const copy = {
                      ...vt,
                      id: newVisaTypeId(),
                      name: `${vt.name} (copy)`,
                      applicationDocuments: structuredClone(vt.applicationDocuments),
                    }
                    updateSegmentVisaTypes(seg.segment, [...seg.visaTypes, copy])
                  }}
                />
              ))
            )}
          </Stack>
        </Box>
      ))}
    </Stack>
  )
}
