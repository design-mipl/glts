import { useState } from 'react'
import { Stack } from '@mui/material'
import { Plus } from 'lucide-react'
import { Button, FormField, Input, MultiSelect, RichTextEditor, Select, Toggle } from '@/design-system/UIComponents'
import { AdminFormSectionsLayout } from '@/pages/admin/components/AdminFormSectionsLayout'
import { AdminOverlayFormSection } from '@/pages/admin/components/AdminOverlayFormSection'
import type { AdminFullPageFormSection } from '@/pages/admin/components/AdminFullPageFormShell'
import {
  GLTS_SCOPE_RICH_TEXT_MIN_HEIGHT,
  GLTS_SCOPE_RICH_TEXT_TOOLBAR,
} from '../../../config/documentDescriptionRichText'
import { COUNTRY_WORKSPACE_LAYOUT } from '../../../config/countryWorkspaceLayout'
import { normalizeGltsScopeRichText, normalizeRichTextForSave } from '@/shared/utils/richTextUtils'
import { PHYSICAL_DOCUMENTS_REQUIRED_LABEL } from '@/shared/constants/documentRequirementLabels'
import { generateDocumentRuleId } from '@/shared/data/countryJurisdictionDefaults'
import { countryMasterAdminService } from '@/shared/services/countryMasterAdminService'
import type {
  BusinessSegment,
  CountryJurisdictionDocumentRule,
  CountryMasterFormData,
  JurisdictionDocumentGroup,
} from '@/shared/types/countryMaster'

function documentsForGroup(
  documents: CountryJurisdictionDocumentRule[],
  group: JurisdictionDocumentGroup,
): CountryJurisdictionDocumentRule[] {
  return [...documents]
    .filter((document) => document.group === group)
    .sort((a, b) => a.sortOrder - b.sortOrder)
}

function buildReorderedDocumentIds(
  allDocuments: CountryJurisdictionDocumentRule[],
  group: JurisdictionDocumentGroup,
  fromIndex: number,
  direction: 'up' | 'down',
): string[] | null {
  const sorted = [...allDocuments].sort((a, b) => a.sortOrder - b.sortOrder)
  const groupMembers = sorted.filter((document) => document.group === group)
  const toIndex = direction === 'up' ? fromIndex - 1 : fromIndex + 1
  if (toIndex < 0 || toIndex >= groupMembers.length) return null

  const reorderedGroup = [...groupMembers]
  ;[reorderedGroup[fromIndex], reorderedGroup[toIndex]] = [
    reorderedGroup[toIndex],
    reorderedGroup[fromIndex],
  ]

  let groupCursor = 0
  return sorted.map((document) => {
    if (document.group === group) {
      return reorderedGroup[groupCursor++].id
    }
    return document.id
  })
}

interface JurisdictionDocumentSectionProps {
  segment: BusinessSegment
  title: string
  group: JurisdictionDocumentGroup
  allDocuments: CountryJurisdictionDocumentRule[]
  readOnly: boolean
  onAdd: () => void
  onChange: (rule: CountryJurisdictionDocumentRule) => void
  onDuplicate: (rule: CountryJurisdictionDocumentRule) => void
  onDelete: (rule: CountryJurisdictionDocumentRule) => void
  onReorder: (group: JurisdictionDocumentGroup, index: number, direction: 'up' | 'down') => void
}

function JurisdictionDocumentSection({
  segment,
  title,
  group,
  allDocuments,
  readOnly,
  onAdd,
  onChange,
  onDuplicate,
  onDelete,
  onReorder,
}: JurisdictionDocumentSectionProps) {
  const rules = documentsForGroup(allDocuments, group)

  return (
    <AdminOverlayFormSection
      title={title}
      importance="secondary"
      columns={1}
      headerAction={
        readOnly ? undefined : (
          <Button
            label="Add document"
            size="sm"
            startIcon={<Plus size={14} />}
            onClick={onAdd}
          />
        )
      }
    >
      <DocumentCardList
        segment={segment}
        rules={rules}
        onChange={onChange}
        onDuplicate={onDuplicate}
        onDelete={onDelete}
        onMoveUp={(index) => onReorder(group, index, 'up')}
        onMoveDown={(index) => onReorder(group, index, 'down')}
      />
    </AdminOverlayFormSection>
  )
}
import { INDIAN_STATE_SELECT_OPTIONS } from '../../../config/indianStates'
import { parseJurisdictionProcessingDays } from '../../../utils/jurisdictionProcessingTime'
import { DocumentCardList } from '../DocumentCardList'
import { AddDocumentModal } from '../drawers/AddDocumentModal'
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
  const [addDocOpen, setAddDocOpen] = useState(false)

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

  const persistDocument = (rule: CountryJurisdictionDocumentRule) => {
    countryMasterAdminService.upsertJurisdictionDocument(
      countryId,
      segment,
      visaTypeId,
      jurisdictionId,
      rule,
    )
    onRefresh()
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

      <AdminOverlayFormSection title="Processing rules" importance="secondary" columns={2}>
        <Toggle
          checked={jurisdiction.processingRules.biometricsRequired}
          onChange={(v) => patchJurisdiction({ processingRules: { ...jurisdiction.processingRules, biometricsRequired: v } })}
          label="Biometrics Required"
          disabled={readOnly}
        />
        <Toggle
          checked={jurisdiction.processingRules.interviewRequired}
          onChange={(v) => patchJurisdiction({ processingRules: { ...jurisdiction.processingRules, interviewRequired: v } })}
          label="Interview Required"
          disabled={readOnly}
        />
        <Toggle
          checked={jurisdiction.processingRules.originalDocumentsRequired}
          onChange={(v) => patchJurisdiction({ processingRules: { ...jurisdiction.processingRules, originalDocumentsRequired: v } })}
          label={PHYSICAL_DOCUMENTS_REQUIRED_LABEL}
          disabled={readOnly}
        />
        <Toggle
          checked={jurisdiction.processingRules.appointmentMandatory}
          onChange={(v) => patchJurisdiction({ processingRules: { ...jurisdiction.processingRules, appointmentMandatory: v } })}
          label="Appointment Mandatory"
          disabled={readOnly}
        />
      </AdminOverlayFormSection>

      <JurisdictionDocumentSection
        segment={segment}
        title="Jurisdiction Specific Documents"
        group="jurisdiction"
        allDocuments={jurisdiction.documents}
        readOnly={readOnly}
        onAdd={() => setAddDocOpen(true)}
        onChange={persistDocument}
        onDuplicate={(rule) => {
          persistDocument({
            ...rule,
            id: generateDocumentRuleId(),
            sortOrder: jurisdiction.documents.length,
          })
        }}
        onDelete={(rule) => {
          countryMasterAdminService.removeJurisdictionDocument(
            countryId,
            segment,
            visaTypeId,
            jurisdictionId,
            rule.id,
          )
          onRefresh()
        }}
        onReorder={(documentGroup, index, direction) => {
          const ids = buildReorderedDocumentIds(
            jurisdiction.documents,
            documentGroup,
            index,
            direction,
          )
          if (!ids) return
          countryMasterAdminService.reorderJurisdictionDocuments(
            countryId,
            segment,
            visaTypeId,
            jurisdictionId,
            ids,
          )
          onRefresh()
        }}
      />

      <AdminOverlayFormSection
        title="GLTS Scope (optional)"
        importance="secondary"
        columns={1}
      >
        <RichTextEditor
          value={normalizeGltsScopeRichText(jurisdiction.gltsScope ?? '')}
          onChange={(v) =>
            patchJurisdiction({ gltsScope: normalizeRichTextForSave(normalizeGltsScopeRichText(v)) })
          }
          placeholder="e.g. Document verification, appointment booking, embassy submission, and status tracking"
          minHeight={GLTS_SCOPE_RICH_TEXT_MIN_HEIGHT}
          toolbar={GLTS_SCOPE_RICH_TEXT_TOOLBAR}
          disabled={readOnly}
        />
      </AdminOverlayFormSection>

      <AddDocumentModal
        open={addDocOpen}
        segment={segment}
        group="jurisdiction"
        onClose={() => setAddDocOpen(false)}
        onSubmit={({ documentId, description, ownerType, sampleDocument }) => {
          countryMasterAdminService.addJurisdictionDocumentFromMaster(
            countryId,
            segment,
            visaTypeId,
            jurisdictionId,
            documentId,
            'jurisdiction',
            description,
            ownerType,
            sampleDocument,
          )
          onRefresh()
          setAddDocOpen(false)
        }}
      />
    </Stack>
  )
}
