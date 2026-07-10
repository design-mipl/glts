import { useState } from 'react'
import { Stack } from '@mui/material'
import { Plus } from 'lucide-react'
import { Button, RichTextEditor } from '@/design-system/UIComponents'
import { AdminOverlayFormSection } from '@/pages/admin/components/AdminOverlayFormSection'
import {
  GLTS_SCOPE_RICH_TEXT_MIN_HEIGHT,
  GLTS_SCOPE_RICH_TEXT_TOOLBAR,
} from '../../../config/documentDescriptionRichText'
import { COUNTRY_WORKSPACE_LAYOUT } from '../../../config/countryWorkspaceLayout'
import { generateDocumentRuleId } from '@/shared/data/countryJurisdictionDefaults'
import { countryMasterAdminService } from '@/shared/services/countryMasterAdminService'
import type {
  BusinessSegment,
  CountryJurisdictionDocumentRule,
  CountryMasterFormData,
  JurisdictionDocumentGroup,
} from '@/shared/types/countryMaster'
import { normalizeGltsScopeRichText, normalizeRichTextForSave } from '@/shared/utils/richTextUtils'
import {
  buildReorderedDocumentIds,
  documentsForGroup,
} from '../../../utils/countryDocumentRuleUtils'
import { DocumentCardList } from '../DocumentCardList'
import { AddDocumentModal } from '../drawers/AddDocumentModal'

export type VisaConfigurationScope = 'visaType' | 'jurisdiction'

interface VisaConfigurationDocumentsTabProps {
  scope: VisaConfigurationScope
  countryId: string
  segment: BusinessSegment
  visaTypeId: string
  jurisdictionId?: string
  formData: CountryMasterFormData
  onChange: (next: CountryMasterFormData) => void
  onRefresh: () => void
  readOnly: boolean
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

export function VisaConfigurationDocumentsTab({
  scope,
  countryId,
  segment,
  visaTypeId,
  jurisdictionId,
  formData,
  onChange,
  onRefresh,
  readOnly,
}: VisaConfigurationDocumentsTabProps) {
  const [addDocOpen, setAddDocOpen] = useState(false)

  const segConfig = formData.segments.find((s) => s.segment === segment)
  const visaType = segConfig?.visaTypes.find((v) => v.id === visaTypeId)
  const jurisdiction =
    scope === 'jurisdiction' && jurisdictionId
      ? visaType?.jurisdictions?.find((j) => j.id === jurisdictionId)
      : undefined

  if (!visaType) return null
  if (scope === 'jurisdiction' && !jurisdiction) return null

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

  const patchJurisdiction = (partial: Partial<NonNullable<typeof jurisdiction>>) => {
    if (!jurisdictionId) return
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

  const gltsScopeValue =
    scope === 'visaType' ? (visaType.gltsScope ?? '') : (jurisdiction?.gltsScope ?? '')

  const onGltsScopeChange = (value: string) => {
    const normalized = normalizeRichTextForSave(normalizeGltsScopeRichText(value))
    if (scope === 'visaType') {
      patchVisa({ gltsScope: normalized })
    } else {
      patchJurisdiction({ gltsScope: normalized })
    }
  }

  const visaDocuments = visaType.documents ?? []

  const persistVisaTypeDocument = (rule: CountryJurisdictionDocumentRule) => {
    countryMasterAdminService.upsertVisaTypeDocument(countryId, segment, visaTypeId, rule)
    onRefresh()
  }

  const persistJurisdictionDocument = (rule: CountryJurisdictionDocumentRule) => {
    if (!jurisdictionId) return
    countryMasterAdminService.upsertJurisdictionDocument(
      countryId,
      segment,
      visaTypeId,
      jurisdictionId,
      rule,
    )
    onRefresh()
  }

  return (
    <Stack spacing={COUNTRY_WORKSPACE_LAYOUT.sectionStackGap}>
      {scope === 'visaType' ? (
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
            onChange={persistVisaTypeDocument}
            onDuplicate={(rule) => {
              persistVisaTypeDocument({
                ...rule,
                id: generateDocumentRuleId(),
                sortOrder: visaDocuments.length,
              })
            }}
            onDelete={(rule) => {
              countryMasterAdminService.removeVisaTypeDocument(
                countryId,
                segment,
                visaTypeId,
                rule.id,
              )
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
      ) : (
        <JurisdictionDocumentSection
          segment={segment}
          title="Jurisdiction Specific Documents"
          group="jurisdiction"
          allDocuments={jurisdiction!.documents}
          readOnly={readOnly}
          onAdd={() => setAddDocOpen(true)}
          onChange={persistJurisdictionDocument}
          onDuplicate={(rule) => {
            persistJurisdictionDocument({
              ...rule,
              id: generateDocumentRuleId(),
              sortOrder: jurisdiction!.documents.length,
            })
          }}
          onDelete={(rule) => {
            if (!jurisdictionId) return
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
            if (!jurisdictionId) return
            const ids = buildReorderedDocumentIds(
              jurisdiction!.documents,
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
      )}

      <AdminOverlayFormSection title="GLTS Scope (optional)" importance="secondary" columns={1}>
        <RichTextEditor
          value={normalizeGltsScopeRichText(gltsScopeValue)}
          onChange={onGltsScopeChange}
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
          if (scope === 'visaType') {
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
          } else if (jurisdictionId) {
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
          }
          onRefresh()
          setAddDocOpen(false)
        }}
      />
    </Stack>
  )
}
