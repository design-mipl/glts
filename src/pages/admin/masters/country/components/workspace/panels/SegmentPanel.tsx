import { Stack } from '@mui/material'
import { Plus } from 'lucide-react'
import { Button } from '@/design-system/UIComponents'
import { AdminOverlayFormSection } from '@/pages/admin/components/AdminOverlayFormSection'
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
