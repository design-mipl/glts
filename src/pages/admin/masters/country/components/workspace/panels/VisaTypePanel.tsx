import { Stack } from '@mui/material'
import { Plus } from 'lucide-react'
import { Button, FormField, Input, Select } from '@/design-system/UIComponents'
import { AdminFormSectionsLayout } from '@/pages/admin/components/AdminFormSectionsLayout'
import { AdminOverlayFormSection } from '@/pages/admin/components/AdminOverlayFormSection'
import type { AdminFullPageFormSection } from '@/pages/admin/components/AdminFullPageFormShell'
import type { BusinessSegment, CountryMasterFormData, VisaTypeStatus } from '@/shared/types/countryMaster'
import { VISA_CATEGORY_SELECT_OPTIONS } from '../../../config/countryProcessingConfig'
import { COUNTRY_WORKSPACE_LAYOUT } from '../../../config/countryWorkspaceLayout'
import { JurisdictionCardList } from '../JurisdictionCardList'
import { useCountryWorkspaceMode } from '../countryWorkspaceModeContext'

interface VisaTypePanelProps {
  segment: BusinessSegment
  visaTypeId: string
  formData: CountryMasterFormData
  onChange: (next: CountryMasterFormData) => void
  onAddJurisdiction: () => void
  onSelectJurisdiction: (jurisdictionId: string) => void
  onJurisdictionDeleted?: (jurisdictionId: string) => void
}

export function VisaTypePanel({
  segment,
  visaTypeId,
  formData,
  onChange,
  onAddJurisdiction,
  onSelectJurisdiction,
  onJurisdictionDeleted,
}: VisaTypePanelProps) {
  const { readOnly } = useCountryWorkspaceMode()
  const segConfig = formData.segments.find((s) => s.segment === segment)
  const visaType = segConfig?.visaTypes.find((v) => v.id === visaTypeId)
  if (!visaType) return null

  const patchVisa = (partial: Partial<typeof visaType>) => {
    onChange({
      ...formData,
      segments: formData.segments.map((s) =>
        s.segment === segment
          ? {
              ...s,
              visaTypes: s.visaTypes.map((v) =>
                v.id === visaTypeId ? { ...v, ...partial } : v,
              ),
            }
          : s,
      ),
    })
  }

  const patchJurisdiction = (
    jurisdictionId: string,
    partial: Partial<(typeof visaType.jurisdictions)[number]>,
  ) => {
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

  const deleteJurisdiction = (jurisdictionId: string) => {
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
                      jurisdictions: (v.jurisdictions ?? []).filter((j) => j.id !== jurisdictionId),
                    }
                  : v,
              ),
            }
          : s,
      ),
    })
    onJurisdictionDeleted?.(jurisdictionId)
  }

  const visaDetailSections: AdminFullPageFormSection[] = [
    {
      id: 'visa-general',
      title: 'General details',
      importance: 'primary',
      columns: 2,
      children: (
        <>
          <FormField label="Visa Name">
            <Input value={visaType.name} onChange={(v) => patchVisa({ name: v })} size="sm" readonly={readOnly} />
          </FormField>
          <FormField label="Category">
            <Select
              value={visaType.visaCategory}
              onChange={(v) => patchVisa({ visaCategory: String(v) })}
              options={VISA_CATEGORY_SELECT_OPTIONS}
              size="sm"
              disabled={readOnly}
            />
          </FormField>
          <FormField label="Entry Type">
            <Input value={visaType.entryType} onChange={(v) => patchVisa({ entryType: v })} size="sm" readonly={readOnly} />
          </FormField>
          <FormField label="Status">
            <Select
              value={visaType.status}
              onChange={(v) => patchVisa({ status: v as typeof visaType.status })}
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
      id: 'visa-travel',
      title: 'Travel & pricing',
      importance: 'primary',
      columns: 2,
      children: (
        <>
          <FormField label="Stay Duration">
            <Input value={visaType.stayDuration} onChange={(v) => patchVisa({ stayDuration: v })} size="sm" readonly={readOnly} />
          </FormField>
          <FormField label="Validity">
            <Input value={visaType.validity} onChange={(v) => patchVisa({ validity: v })} size="sm" readonly={readOnly} />
          </FormField>
          <FormField label="Pricing (INR)">
            <Input
              type="number"
              value={String(visaType.pricing ?? 0)}
              onChange={(v) => patchVisa({ pricing: Number(v) || 0 })}
              size="sm"
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
        sections={visaDetailSections}
        variant="page"
        sectionColumnsFrom={COUNTRY_WORKSPACE_LAYOUT.sectionColumnsFrom}
        fieldColumnsFrom={COUNTRY_WORKSPACE_LAYOUT.fieldColumnsFrom}
      />

      <AdminOverlayFormSection
        title="Jurisdictions"
        description="Embassy/VFS jurisdictions and applicable states for this visa type"
        importance="secondary"
        columns={1}
        headerAction={
          readOnly ? undefined : (
            <Button label="Add Jurisdiction" startIcon={<Plus size={14} />} onClick={onAddJurisdiction} />
          )
        }
      >
        <JurisdictionCardList
          rows={visaType.jurisdictions ?? []}
          onSelect={(row) => onSelectJurisdiction(row.id)}
          onStatusChange={(row, status: VisaTypeStatus) => patchJurisdiction(row.id, { status })}
          onDelete={(row) => deleteJurisdiction(row.id)}
        />
      </AdminOverlayFormSection>
    </Stack>
  )
}
