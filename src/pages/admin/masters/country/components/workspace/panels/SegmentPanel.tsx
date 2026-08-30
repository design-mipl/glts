import { useMemo } from 'react'
import { Stack } from '@mui/material'
import { Plus } from 'lucide-react'
import { Button, FormField, Select } from '@/design-system/UIComponents'
import { AdminOverlayFormSection } from '@/pages/admin/components/AdminOverlayFormSection'
import type { BusinessSegment, CountryMasterFormData, VisaTypeStatus } from '@/shared/types/countryMaster'
import { getActiveRequirementPackSelectOptions } from '@/shared/utils/countryRequirementPackUtils'
import { getActiveWorkflowSelectOptions } from '@/shared/utils/countryWorkflowUtils'
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
  const workflowOptions = useMemo(
    () => [{ value: '', label: 'Not mapped' }, ...getActiveWorkflowSelectOptions()],
    [],
  )
  const requirementPackOptions = useMemo(
    () => [{ value: '', label: 'Not mapped' }, ...getActiveRequirementPackSelectOptions()],
    [],
  )

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

  return (
    <Stack spacing={COUNTRY_WORKSPACE_LAYOUT.sectionStackGap}>
      <AdminOverlayFormSection
        title="Workflow"
        description="Default processing workflow for all visa types in this segment. Individual visa types can override."
        importance="primary"
        columns={1}
      >
        <FormField
          label="Default workflow"
          helperText="Uses status steps from Workflow Master. Change anytime to update this segment mapping."
        >
          <Select
            value={segConfig.workflowId ?? ''}
            onChange={(v) => patchSegment({ workflowId: String(v) || undefined })}
            options={workflowOptions}
            placeholder="Select workflow"
            size="sm"
            disabled={readOnly || !segConfig.enabled}
          />
        </FormField>
      </AdminOverlayFormSection>

      {segment === 'retail' ? (
        <AdminOverlayFormSection
          title="Requirement pack"
          description="Default intake pack for retail. Overridden per visa type (no jurisdictions) or per jurisdiction (when jurisdictions are enabled)."
          importance="primary"
          columns={1}
        >
          <FormField
            label="Default requirement pack"
            helperText="Fallback when visa type / jurisdiction has no pack mapped. Packs come from Requirement Master."
          >
            <Select
              value={segConfig.requirementPackId ?? ''}
              onChange={(v) =>
                patchSegment({ requirementPackId: String(v) || undefined })
              }
              options={requirementPackOptions}
              placeholder="Select requirement pack"
              size="sm"
              disabled={readOnly || !segConfig.enabled}
              fullWidth
            />
          </FormField>
        </AdminOverlayFormSection>
      ) : null}

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
