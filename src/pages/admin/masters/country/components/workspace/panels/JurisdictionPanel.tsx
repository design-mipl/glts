import { Stack } from '@mui/material'
import { FormField, Input, MultiSelect, Select } from '@/design-system/UIComponents'
import { AdminFormSectionsLayout } from '@/pages/admin/components/AdminFormSectionsLayout'
import type { AdminFullPageFormSection } from '@/pages/admin/components/AdminFullPageFormShell'
import type { BusinessSegment, CountryMasterFormData } from '@/shared/types/countryMaster'
import { INDIAN_STATE_SELECT_OPTIONS } from '../../../config/indianStates'
import { COUNTRY_WORKSPACE_LAYOUT } from '../../../config/countryWorkspaceLayout'
import { parseJurisdictionProcessingDays } from '../../../utils/jurisdictionProcessingTime'
import { CountryVisaConfigurationTabs } from '../CountryVisaConfigurationTabs'
import { useCountryWorkspaceMode } from '../countryWorkspaceModeContext'

interface JurisdictionPanelProps {
  countryId: string
  segment: BusinessSegment
  visaTypeId: string
  jurisdictionId: string
  formData: CountryMasterFormData
  onChange: (next: CountryMasterFormData) => void
  onRefresh: () => void
}

export function JurisdictionPanel({
  countryId,
  segment,
  visaTypeId,
  jurisdictionId,
  formData,
  onChange,
  onRefresh,
}: JurisdictionPanelProps) {
  const { readOnly } = useCountryWorkspaceMode()
  const segConfig = formData.segments.find((s) => s.segment === segment)
  const visaType = segConfig?.visaTypes.find((v) => v.id === visaTypeId)
  const jurisdiction = visaType?.jurisdictions?.find((j) => j.id === jurisdictionId)

  if (!jurisdiction) return null

  const patchJurisdiction = (partial: Partial<typeof jurisdiction>) => {
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
                        j.id === jurisdictionId ? { ...j, ...partial } : j,
                      ),
                    }
                  : v,
              ),
            }
          : s,
      ),
    })
  }

  const jurisdictionDetailSections: AdminFullPageFormSection[] = [
    {
      id: 'jurisdiction-details',
      title: 'Jurisdiction details',
      importance: 'primary',
      columns: 2,
      children: (
        <>
          <FormField label="Jurisdiction Name">
            <Input value={jurisdiction.name} onChange={(v) => patchJurisdiction({ name: v })} size="sm" readonly={readOnly} />
          </FormField>
          <FormField label="Embassy / VFS">
            <Input value={jurisdiction.embassyOrVfs} onChange={(v) => patchJurisdiction({ embassyOrVfs: v })} size="sm" readonly={readOnly} />
          </FormField>
          <FormField label="Submission Center">
            <Input value={jurisdiction.submissionCenter} onChange={(v) => patchJurisdiction({ submissionCenter: v })} size="sm" readonly={readOnly} />
          </FormField>
          <FormField label="Processing Time (days)">
            <Input
              type="number"
              value={parseJurisdictionProcessingDays(jurisdiction.processingTime)}
              onChange={(v) => patchJurisdiction({ processingTime: v.trim() })}
              size="sm"
              readonly={readOnly}
            />
          </FormField>
          <FormField label="Status">
            <Select
              value={jurisdiction.status}
              onChange={(v) => patchJurisdiction({ status: v as typeof jurisdiction.status })}
              options={[
                { value: 'active', label: 'Active' },
                { value: 'inactive', label: 'Inactive' },
              ]}
              size="sm"
              disabled={readOnly}
            />
          </FormField>
        </>
      ),
    },
    {
      id: 'applicable-states',
      title: 'Applicable states',
      description: 'Select all states where this jurisdiction applies',
      importance: 'primary',
      columns: 1,
      children: (
        <FormField label="States">
          <MultiSelect
            value={jurisdiction.applicableStates}
            onChange={(value) => patchJurisdiction({ applicableStates: value as string[] })}
            options={INDIAN_STATE_SELECT_OPTIONS}
            placeholder="Search and select states"
            searchable
            size="sm"
            fullWidth
            chipPlacement="below"
            disabled={readOnly}
          />
        </FormField>
      ),
    },
  ]

  return (
    <Stack spacing={COUNTRY_WORKSPACE_LAYOUT.sectionStackGap}>
      <AdminFormSectionsLayout
        sections={jurisdictionDetailSections}
        variant="page"
        sectionColumnsFrom={COUNTRY_WORKSPACE_LAYOUT.sectionColumnsFrom}
        fieldColumnsFrom={COUNTRY_WORKSPACE_LAYOUT.fieldColumnsFrom}
      />

      <CountryVisaConfigurationTabs
        scope="jurisdiction"
        countryId={countryId}
        segment={segment}
        visaTypeId={visaTypeId}
        jurisdictionId={jurisdictionId}
        formData={formData}
        onChange={onChange}
        onRefresh={onRefresh}
        readOnly={readOnly}
      />
    </Stack>
  )
}
