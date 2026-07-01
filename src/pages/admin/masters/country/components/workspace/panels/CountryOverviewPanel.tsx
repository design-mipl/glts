import { useMemo } from 'react'
import { Divider, Grid, Stack } from '@mui/material'
import { FormField, Input, Select, Textarea, Toggle } from '@/design-system/UIComponents'
import { AdminFormSectionsLayout } from '@/pages/admin/components/AdminFormSectionsLayout'
import { AdminOverlayFormSection } from '@/pages/admin/components/AdminOverlayFormSection'
import {
  AdminFullPageFormFieldSpan,
  type AdminFullPageFormSection,
} from '@/pages/admin/components/AdminFullPageFormShell'
import { countryMasterAdminService } from '@/shared/services/countryMasterAdminService'
import type {
  BusinessSegment,
  CountryMasterFormData,
  VisaApplicationWindowUnit,
} from '@/shared/types/countryMaster'
import {
  COUNTRY_STATUS_OPTIONS,
  PROCESSING_TYPE_OPTIONS,
  VISA_APPLICATION_WINDOW_UNIT_OPTIONS,
  VISA_APPLICATION_WINDOW_VALUE_OPTIONS,
} from '../../../config/countryProcessingConfig'
import { COUNTRY_WORKSPACE_LAYOUT } from '../../../config/countryWorkspaceLayout'
import {
  buildCountryReferenceSelectOptions,
  resolveCountryReferenceByCode,
} from '../../../utils/countryReferenceOptions'
import { CountryFormImageField } from '../../CountryFormImageField'
import { SegmentCard } from '../SegmentCard'
import { useCountryWorkspaceMode } from '../countryWorkspaceModeContext'

interface CountryOverviewPanelProps {
  countryId: string
  formData: CountryMasterFormData
  onChange: (next: CountryMasterFormData) => void
  onSelectSegment: (segment: BusinessSegment) => void
}

export function CountryOverviewPanel({
  countryId,
  formData,
  onChange,
  onSelectSegment,
}: CountryOverviewPanelProps) {
  const { readOnly } = useCountryWorkspaceMode()
  const patch = (partial: Partial<CountryMasterFormData>) => onChange({ ...formData, ...partial })

  const patchVisaApplicationWindow = (partial: Partial<CountryMasterFormData['visaApplicationWindow']>) => {
    patch({
      visaApplicationWindow: { ...formData.visaApplicationWindow, ...partial },
    })
  }

  const patchTravelDateRiskThresholds = (
    partial: Partial<CountryMasterFormData['travelDateRiskThresholds']>,
  ) => {
    patch({
      travelDateRiskThresholds: { ...formData.travelDateRiskThresholds, ...partial },
    })
  }

  const countryNameOptions = useMemo(
    () => buildCountryReferenceSelectOptions({ name: formData.name, code: formData.code }),
    [formData.name, formData.code],
  )

  const handleCountrySelect = (code: string | number) => {
    const ref = resolveCountryReferenceByCode(String(code))
    if (ref) {
      patch({
        name: ref.name,
        code: ref.code,
        region: ref.region,
        flag: ref.flags || formData.flag,
      })
      return
    }
    patch({ code: String(code) })
  }

  const toggleSegment = (segment: BusinessSegment, enabled: boolean) => {
    if (readOnly) return
    countryMasterAdminService.toggleSegment(countryId, segment, enabled)
    onChange({
      ...formData,
      segments: formData.segments.map((s) =>
        s.segment === segment ? { ...s, enabled } : s,
      ),
    })
  }

  const layoutProps = {
    variant: 'page' as const,
    sectionColumnsFrom: COUNTRY_WORKSPACE_LAYOUT.sectionColumnsFrom,
    fieldColumnsFrom: COUNTRY_WORKSPACE_LAYOUT.fieldColumnsFrom,
  }

  const primarySections: AdminFullPageFormSection[] = [
    {
      id: 'basic',
      title: 'Basic information',
      importance: 'primary',
      columns: 2,
      children: (
        <>
          <AdminFullPageFormFieldSpan>
            <FormField label="Country Name">
              <Select
                value={formData.code}
                onChange={handleCountrySelect}
                placeholder="Select country"
                options={countryNameOptions}
                size="sm"
                disabled={readOnly}
              />
            </FormField>
          </AdminFullPageFormFieldSpan>
          <FormField label="Country Code">
            <Input value={formData.code} size="sm" readonly />
          </FormField>
          <FormField label="Region">
            <Input value={formData.region} onChange={(v) => patch({ region: v })} size="sm" readonly={readOnly} />
          </FormField>
          <FormField label="Processing Type">
            <Select
              value={formData.processingType}
              onChange={(v) => patch({ processingType: v as CountryMasterFormData['processingType'] })}
              options={PROCESSING_TYPE_OPTIONS}
              size="sm"
              disabled={readOnly}
            />
          </FormField>
          <FormField label="Status">
            <Select
              value={formData.status}
              onChange={(v) => patch({ status: v as CountryMasterFormData['status'] })}
              options={COUNTRY_STATUS_OPTIONS}
              size="sm"
              disabled={readOnly}
            />
          </FormField>
          <AdminFullPageFormFieldSpan>
            <FormField label="Application Tracking URL" optional>
              <Input
                value={formData.applicationTrackingUrl}
                onChange={(v) => patch({ applicationTrackingUrl: v })}
                placeholder="https://visa.vfsglobal.com/..."
                size="sm"
                readonly={readOnly}
                fullWidth
              />
            </FormField>
          </AdminFullPageFormFieldSpan>
          <AdminFullPageFormFieldSpan>
            <Divider sx={{ my: 2 }} />
          </AdminFullPageFormFieldSpan>
          <FormField label="Application window unit">
            <Select
              value={formData.visaApplicationWindow.unit}
              onChange={(v) => patchVisaApplicationWindow({ unit: v as VisaApplicationWindowUnit })}
              options={VISA_APPLICATION_WINDOW_UNIT_OPTIONS}
              size="sm"
              disabled={readOnly}
            />
          </FormField>
          <FormField label="Application window value">
            <Select
              value={String(formData.visaApplicationWindow.value)}
              onChange={(v) => patchVisaApplicationWindow({ value: Number(v) || 1 })}
              options={VISA_APPLICATION_WINDOW_VALUE_OPTIONS}
              size="sm"
              disabled={readOnly}
            />
          </FormField>
          <FormField label="Escalation buffer (working days)">
            <Input
              type="number"
              value={String(formData.travelDateRiskThresholds.escalationBufferDays)}
              onChange={(v) =>
                patchTravelDateRiskThresholds({ escalationBufferDays: Number(v) || 0 })
              }
              size="sm"
              readonly={readOnly}
            />
          </FormField>
          <FormField label="Safe buffer (working days)">
            <Input
              type="number"
              value={String(formData.travelDateRiskThresholds.safeBufferDays)}
              onChange={(v) => patchTravelDateRiskThresholds({ safeBufferDays: Number(v) || 0 })}
              size="sm"
              readonly={readOnly}
            />
          </FormField>
        </>
      ),
    },
    {
      id: 'public-website',
      title: 'Public website configuration',
      importance: 'secondary',
      columns: 2,
      children: (
        <>
          <FormField label="Display Processing Time">
            <Input value={formData.processingTime} onChange={(v) => patch({ processingTime: v })} size="sm" readonly={readOnly} />
          </FormField>
          <FormField label="Starting Price (INR)">
            <Input type="number" value={String(formData.price)} onChange={(v) => patch({ price: Number(v) || 0 })} size="sm" readonly={readOnly} />
          </FormField>
          <FormField label="Trending">
            <Toggle checked={formData.trending} onChange={(v) => patch({ trending: v })} label={formData.trending ? 'Trending' : 'Not trending'} disabled={readOnly} />
          </FormField>
          <FormField label="Rating">
            <Input type="number" value={String(formData.rating)} onChange={(v) => patch({ rating: Number(v) || 0 })} size="sm" readonly={readOnly} />
          </FormField>
          <FormField label="Validity Label">
            <Input value={formData.validity} onChange={(v) => patch({ validity: v })} size="sm" readonly={readOnly} />
          </FormField>
        </>
      ),
    },
  ]

  const notesSection: AdminFullPageFormSection[] = [
    {
      id: 'internal-notes',
      title: 'Internal notes',
      importance: 'secondary',
      columns: 2,
      children: (
        <>
          <FormField label="Embassy Notes">
            <Textarea value={formData.embassyNotes} onChange={(v) => patch({ embassyNotes: v })} rows={3} readonly={readOnly} />
          </FormField>
          <FormField label="Internal Operations Notes">
            <Textarea value={formData.internalNotes} onChange={(v) => patch({ internalNotes: v })} rows={3} readonly={readOnly} />
          </FormField>
        </>
      ),
    },
  ]

  const segmentSections: AdminFullPageFormSection[] = [
    {
      id: 'segments',
      title: 'Business segments',
      importance: 'primary',
      span: 2,
      columns: 1,
      children: (
        <Grid container spacing={1.5}>
          {formData.segments.map((seg) => (
            <Grid key={seg.segment} size={{ xs: 12, md: 6 }}>
              <SegmentCard
                segment={seg}
                onToggle={(enabled) => toggleSegment(seg.segment, enabled)}
                onClick={() => onSelectSegment(seg.segment)}
              />
            </Grid>
          ))}
        </Grid>
      ),
    },
  ]

  return (
    <Stack spacing={COUNTRY_WORKSPACE_LAYOUT.sectionStackGap}>
      <AdminFormSectionsLayout sections={primarySections} {...layoutProps} />

      <AdminOverlayFormSection
        title="Media"
        importance="secondary"
        columns={2}
        fieldColumnsFrom={COUNTRY_WORKSPACE_LAYOUT.fieldColumnsFrom}
      >
        <CountryFormImageField
          label="Flag"
          value={formData.flag}
          onChange={(v) => patch({ flag: v })}
          helperText="Flag image for listings and destination cards"
          dropzoneTitle="Upload flag image"
          dropzoneCaption="PNG, JPG, WebP, SVG, or emoji URL — up to 2 MB"
          disabled={readOnly}
        />
        <CountryFormImageField
          label="Hero Banner"
          value={formData.heroPhotoId}
          onChange={(v) => patch({ heroPhotoId: v })}
          dropzoneTitle="Upload hero banner"
          disabled={readOnly}
        />
      </AdminOverlayFormSection>

      <AdminFormSectionsLayout sections={notesSection} {...layoutProps} />
      <AdminFormSectionsLayout sections={segmentSections} {...layoutProps} />
    </Stack>
  )
}
