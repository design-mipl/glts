import { useState } from 'react'
import { Stack } from '@mui/material'
import { Plus } from 'lucide-react'
import {
  Button,
  FormField,
  Input,
  RichTextEditor,
  Select,
  Toggle,
} from '@/design-system/UIComponents'
import { AdminFormSectionsLayout } from '@/pages/admin/components/AdminFormSectionsLayout'
import { AdminOverlayFormSection } from '@/pages/admin/components/AdminOverlayFormSection'
import type { AdminFullPageFormSection } from '@/pages/admin/components/AdminFullPageFormShell'
import { generateDocumentRuleId } from '@/shared/data/countryJurisdictionDefaults'
import { countryMasterAdminService } from '@/shared/services/countryMasterAdminService'
import type {
  BusinessSegment,
  CountryJurisdictionDocumentRule,
  CountryMasterFormData,
  JurisdictionDocumentGroup,
  VisaMode,
  VisaTypeStatus,
} from '@/shared/types/countryMaster'
import { normalizeGltsScopeRichText, normalizeRichTextForSave } from '@/shared/utils/richTextUtils'
import {
  DEFAULT_VISA_MODE,
  VISA_CATEGORY_SELECT_OPTIONS,
  VISA_MODE_SELECT_OPTIONS,
} from '../../../config/countryProcessingConfig'
import {
  GLTS_SCOPE_RICH_TEXT_MIN_HEIGHT,
  GLTS_SCOPE_RICH_TEXT_TOOLBAR,
} from '../../../config/documentDescriptionRichText'
import { COUNTRY_WORKSPACE_LAYOUT } from '../../../config/countryWorkspaceLayout'
import { DocumentCardList } from '../DocumentCardList'
import { AddDocumentModal } from '../drawers/AddDocumentModal'
import { JurisdictionCardList } from '../JurisdictionCardList'
import { useCountryWorkspaceMode } from '../countryWorkspaceModeContext'

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

interface VisaTypePanelProps {
  countryId: string
  segment: BusinessSegment
  visaTypeId: string
  formData: CountryMasterFormData
  onChange: (next: CountryMasterFormData) => void
  onRefresh: () => void
  onAddJurisdiction: () => void
  onSelectJurisdiction: (jurisdictionId: string) => void
  onJurisdictionDeleted?: (jurisdictionId: string) => void
}

export function VisaTypePanel({
  countryId,
  segment,
  visaTypeId,
  formData,
  onChange,
  onRefresh,
  onAddJurisdiction,
  onSelectJurisdiction,
  onJurisdictionDeleted,
}: VisaTypePanelProps) {
  const { readOnly } = useCountryWorkspaceMode()
  const [addDocOpen, setAddDocOpen] = useState(false)
  const segConfig = formData.segments.find((s) => s.segment === segment)
  const visaType = segConfig?.visaTypes.find((v) => v.id === visaTypeId)
  if (!visaType) return null

  const visaDocuments = visaType.documents ?? []

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

  const persistDocument = (rule: CountryJurisdictionDocumentRule) => {
    countryMasterAdminService.upsertVisaTypeDocument(countryId, segment, visaTypeId, rule)
    onRefresh()
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
          <FormField label="Visa Mode">
            <Select
              value={visaType.visaMode ?? DEFAULT_VISA_MODE}
              onChange={(v) => patchVisa({ visaMode: v as VisaMode })}
              options={VISA_MODE_SELECT_OPTIONS}
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
          <FormField label="Jurisdiction">
            <Toggle
              checked={Boolean(visaType.jurisdictionEnabled)}
              onChange={(enabled) => patchVisa({ jurisdictionEnabled: enabled })}
              label={visaType.jurisdictionEnabled ? 'Enabled' : 'Disabled'}
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

      {visaType.jurisdictionEnabled === true ? (
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
      ) : (
        <>
          <AdminOverlayFormSection
            title="Visa type documents"
            importance="secondary"
            columns={1}
            headerAction={
              readOnly ? undefined : (
                <Button
                  label="Add document"
                  size="sm"
                  startIcon={<Plus size={14} />}
                  onClick={() => setAddDocOpen(true)}
                />
              )
            }
          >
            <DocumentCardList
              segment={segment}
              rules={documentsForGroup(visaDocuments, 'jurisdiction')}
              showPhysicalDocumentToggle={false}
              onChange={persistDocument}
              onDuplicate={(rule) => {
                persistDocument({
                  ...rule,
                  id: generateDocumentRuleId(),
                  sortOrder: visaDocuments.length,
                })
              }}
              onDelete={(rule) => {
                countryMasterAdminService.removeVisaTypeDocument(countryId, segment, visaTypeId, rule.id)
                onRefresh()
              }}
              onMoveUp={(index) => {
                const ids = buildReorderedDocumentIds(visaDocuments, 'jurisdiction', index, 'up')
                if (!ids) return
                countryMasterAdminService.reorderVisaTypeDocuments(countryId, segment, visaTypeId, ids)
                onRefresh()
              }}
              onMoveDown={(index) => {
                const ids = buildReorderedDocumentIds(visaDocuments, 'jurisdiction', index, 'down')
                if (!ids) return
                countryMasterAdminService.reorderVisaTypeDocuments(countryId, segment, visaTypeId, ids)
                onRefresh()
              }}
            />
          </AdminOverlayFormSection>

          <AdminOverlayFormSection title="GLTS Scope (optional)" importance="secondary" columns={1}>
            <RichTextEditor
              value={normalizeGltsScopeRichText(visaType.gltsScope ?? '')}
              onChange={(v) =>
                patchVisa({ gltsScope: normalizeRichTextForSave(normalizeGltsScopeRichText(v)) })
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
              countryMasterAdminService.addVisaTypeDocumentFromMaster(
                countryId,
                segment,
                visaTypeId,
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
        </>
      )}
    </Stack>
  )
}
