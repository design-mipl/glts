import { Stack } from '@mui/material'
import { Plus } from 'lucide-react'
import { Button, FormField, Input, Toggle } from '@/design-system/UIComponents'
import { AdminFormSectionsLayout } from '@/pages/admin/components/AdminFormSectionsLayout'
import { AdminOverlayFormSection } from '@/pages/admin/components/AdminOverlayFormSection'
import type { AdminFullPageFormSection } from '@/pages/admin/components/AdminFullPageFormShell'
import type { BusinessSegment, CountryMasterFormData, VisaTypeStatus } from '@/shared/types/countryMaster'
import { COUNTRY_WORKSPACE_LAYOUT } from '../../../config/countryWorkspaceLayout'
import { VisaTypeCardList } from '../VisaTypeCardList'
import { useCountryWorkspaceMode } from '../countryWorkspaceModeContext'

interface SegmentPanelProps {
  segment: BusinessSegment
  formData: CountryMasterFormData
  onChange: (next: CountryMasterFormData) => void
  onAddVisaType: () => void
  onSelectVisaType: (visaTypeId: string) => void
}

export function SegmentPanel({
  segment,
  formData,
  onChange,
  onAddVisaType,
  onSelectVisaType,
}: SegmentPanelProps) {
  const { readOnly } = useCountryWorkspaceMode()
  const segConfig = formData.segments.find((s) => s.segment === segment)
  if (!segConfig) return null

  const patchSegment = (partial: Partial<typeof segConfig>) => {
    onChange({
      ...formData,
      segments: formData.segments.map((s) =>
        s.segment === segment ? { ...s, ...partial } : s,
      ),
    })
  }

  const patchVisaType = (visaTypeId: string, partial: Partial<(typeof segConfig.visaTypes)[number]>) => {
    onChange({
      ...formData,
      segments: formData.segments.map((s) =>
        s.segment === segment
          ? {
              ...s,
              visaTypes: s.visaTypes.map((vt) => {
                if (vt.id !== visaTypeId) return vt
                const { jurisdictions, ...rest } = vt
                return {
                  ...rest,
                  ...partial,
                  jurisdictions: jurisdictions ?? [],
                }
              }),
            }
          : s,
      ),
    })
  }

  const deleteVisaType = (visaTypeId: string) => {
    onChange({
      ...formData,
      segments: formData.segments.map((s) =>
        s.segment === segment
          ? { ...s, visaTypes: s.visaTypes.filter((vt) => vt.id !== visaTypeId) }
          : s,
      ),
    })
  }

  const rules = segConfig.processingRules

  const segmentSettingSections: AdminFullPageFormSection[] = [
    {
      id: 'segment-workflow',
      title: 'Workflow & SLA',
      importance: 'primary',
      columns: 2,
      children: (
        <>
          <FormField label="Segment Status">
            <Toggle
              checked={segConfig.enabled}
              onChange={(v) => patchSegment({ enabled: v })}
              label={segConfig.enabled ? 'Enabled' : 'Disabled'}
              disabled={readOnly}
            />
          </FormField>
          <FormField label="Default Workflow">
            <Input
              value={rules.workflowProfile}
              onChange={(v) =>
                patchSegment({
                  processingRules: { ...rules, workflowProfile: v as typeof rules.workflowProfile },
                })
              }
              size="sm"
              readonly={readOnly}
            />
          </FormField>
          <FormField label="SLA Rules (days)">
            <Input
              type="number"
              value={String(rules.slaTargetDays ?? '')}
              onChange={(v) =>
                patchSegment({
                  processingRules: { ...rules, slaTargetDays: Number(v) || undefined },
                })
              }
              size="sm"
              readonly={readOnly}
            />
          </FormField>
        </>
      ),
    },
    {
      id: 'segment-requirements',
      title: 'Operational requirements',
      importance: 'primary',
      columns: 2,
      children: (
        <>
          <FormField label="Appointment Required">
            <Toggle
              checked={rules.appointmentRequired}
              onChange={(v) =>
                patchSegment({
                  processingRules: { ...rules, appointmentRequired: v },
                })
              }
              label={rules.appointmentRequired ? 'Required' : 'Not required'}
              disabled={readOnly}
            />
          </FormField>
          <FormField label="Biometrics Required">
            <Toggle
              checked={rules.biometricRequired}
              onChange={(v) =>
                patchSegment({
                  processingRules: { ...rules, biometricRequired: v },
                })
              }
              label={rules.biometricRequired ? 'Required' : 'Not required'}
              disabled={readOnly}
            />
          </FormField>
        </>
      ),
    },
  ]

  return (
    <Stack spacing={COUNTRY_WORKSPACE_LAYOUT.sectionStackGap}>
      <AdminFormSectionsLayout
        sections={segmentSettingSections}
        variant="page"
        sectionColumnsFrom={COUNTRY_WORKSPACE_LAYOUT.sectionColumnsFrom}
        fieldColumnsFrom={COUNTRY_WORKSPACE_LAYOUT.fieldColumnsFrom}
      />

      <AdminOverlayFormSection
        title="Visa types"
        description={`${segConfig.visaTypes.length} configured for this segment`}
        importance="secondary"
        columns={1}
        headerAction={
          readOnly ? undefined : (
            <Button label="Add Visa Type" startIcon={<Plus size={14} />} onClick={onAddVisaType} disabled={!segConfig.enabled} />
          )
        }
      >
        <VisaTypeCardList
          rows={segConfig.visaTypes}
          onSelect={(row) => onSelectVisaType(row.id)}
          onStatusChange={(row, status: VisaTypeStatus) => patchVisaType(row.id, { status })}
          onDelete={(row) => deleteVisaType(row.id)}
        />
      </AdminOverlayFormSection>
    </Stack>
  )
}
