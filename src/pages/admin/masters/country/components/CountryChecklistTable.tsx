import { useMemo, useState } from 'react'
import { Box, IconButton, Stack, Typography } from '@mui/material'
import { ArrowDown, ArrowUp, Trash2 } from 'lucide-react'
import { Link as RouterLink } from 'react-router-dom'
import { FormField, Select, Textarea, Toggle } from '@/design-system/UIComponents'
import { documentMasterService } from '@/shared/services/documentMasterService'
import type {
  BusinessSegment,
  CountryDocumentChecklistItem,
  CountryMasterFormData,
  CountryVisaType,
} from '@/shared/types/countryMaster'
import { SEGMENT_LABELS } from '../config/countrySegmentConfig'
import {
  checklistItemFromDocumentMaster,
  mergeVisaTypeChecklistRows,
  resolveChecklistItemDescription,
  resolveDocumentMasterDescription,
  resolveDocumentMasterLabel,
  type CountryDocumentChecklistRow,
  type CountryDocumentChecklistScope,
} from '../utils/countryChecklistUtils'

const ROW_GRID = 'minmax(0, 1fr) 72px 80px 88px'

interface CountryVisaTypeDocumentTableProps {
  visaType: CountryVisaType
  commonDocuments: CountryDocumentChecklistItem[]
  onCommonDocumentsChange: (documents: CountryDocumentChecklistItem[]) => void
  onVisaTypeChange: (next: CountryVisaType) => void
}

function reindex(items: CountryDocumentChecklistItem[]): CountryDocumentChecklistItem[] {
  return items.map((item, index) => ({ ...item, sortOrder: index }))
}

export function CountryVisaTypeDocumentTable({
  visaType,
  commonDocuments,
  onCommonDocumentsChange,
  onVisaTypeChange,
}: CountryVisaTypeDocumentTableProps) {
  const [pickerKey, setPickerKey] = useState(0)
  const activeDocuments = documentMasterService
    .list({ status: 'active' })
    .sort((a, b) => a.documentType.localeCompare(b.documentType))

  const rows = mergeVisaTypeChecklistRows(commonDocuments, visaType.applicationDocuments)
  const mappedIds = useMemo(() => new Set(rows.map((r) => r.documentId)), [rows])

  const documentOptions = useMemo(
    () =>
      activeDocuments.map((doc) => ({
        value: doc.id,
        label: doc.documentType,
        description: doc.description,
        disabled: mappedIds.has(doc.id),
      })),
    [activeDocuments, mappedIds],
  )
  const hasAddableDocument = documentOptions.some((opt) => !opt.disabled)

  const updateScopeList = (
    scope: CountryDocumentChecklistScope,
    updater: (items: CountryDocumentChecklistItem[]) => CountryDocumentChecklistItem[],
  ) => {
    if (scope === 'common') {
      onCommonDocumentsChange(updater(commonDocuments))
      return
    }
    onVisaTypeChange({ ...visaType, applicationDocuments: updater(visaType.applicationDocuments) })
  }

  const patchRow = (documentId: string, scope: CountryDocumentChecklistScope, patch: Partial<CountryDocumentChecklistItem>) => {
    updateScopeList(scope, (items) =>
      items.map((item) => (item.documentId === documentId ? { ...item, ...patch } : item)),
    )
  }

  const removeRow = (documentId: string, scope: CountryDocumentChecklistScope) => {
    updateScopeList(scope, (items) => items.filter((item) => item.documentId !== documentId))
  }

  const setRowScope = (documentId: string, fromScope: CountryDocumentChecklistScope, toScope: CountryDocumentChecklistScope) => {
    if (fromScope === toScope) return
    const source = fromScope === 'common' ? commonDocuments : visaType.applicationDocuments
    const item = source.find((entry) => entry.documentId === documentId)
    if (!item) return

    if (fromScope === 'common') {
      onCommonDocumentsChange(reindex(commonDocuments.filter((entry) => entry.documentId !== documentId)))
      onVisaTypeChange({
        ...visaType,
        applicationDocuments: reindex([...visaType.applicationDocuments, item]),
      })
      return
    }

    onVisaTypeChange({
      ...visaType,
      applicationDocuments: reindex(
        visaType.applicationDocuments.filter((entry) => entry.documentId !== documentId),
      ),
    })
    onCommonDocumentsChange(reindex([...commonDocuments, item]))
  }

  const addDocument = (documentId: string) => {
    if (mappedIds.has(documentId)) return
    onVisaTypeChange({
      ...visaType,
      applicationDocuments: reindex([
        ...visaType.applicationDocuments,
        checklistItemFromDocumentMaster(documentId, visaType.applicationDocuments.length),
      ]),
    })
    setPickerKey((k) => k + 1)
  }

  const moveRow = (row: CountryDocumentChecklistRow, direction: -1 | 1) => {
    const list = row.scope === 'common' ? [...commonDocuments] : [...visaType.applicationDocuments]
    const sorted = [...list].sort((a, b) => a.sortOrder - b.sortOrder)
    const index = sorted.findIndex((item) => item.documentId === row.documentId)
    const target = index + direction
    if (index < 0 || target < 0 || target >= sorted.length) return
    const next = [...sorted]
    const temp = next[index]
    next[index] = next[target]
    next[target] = temp
    updateScopeList(row.scope, () => reindex(next))
  }

  return (
    <Stack spacing={1.5} sx={{ width: '100%' }}>
      <FormField
        label="Add from Document Master"
        sx={{ width: '100%' }}
        helperText={
          activeDocuments.length === 0
            ? 'No active documents in Document Master. Add documents there first.'
            : !hasAddableDocument
              ? 'All active documents are already mapped for this visa type.'
              : 'Use Common for segment-wide documents; otherwise they apply to this visa type only.'
        }
      >
        <Select
          key={pickerKey}
          value=""
          placeholder="Select document…"
          fullWidth
          disabled={activeDocuments.length === 0 || !hasAddableDocument}
          onChange={(value) => {
            if (value) addDocument(String(value))
          }}
          options={documentOptions}
        />
      </FormField>
      {activeDocuments.length === 0 ? (
        <Typography variant="caption" color="text.secondary">
          <RouterLink to="/admin/masters/documents">Open Document Master</RouterLink>
        </Typography>
      ) : null}

      {rows.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          No documents mapped yet.
        </Typography>
      ) : (
        <Box sx={{ width: '100%' }}>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: ROW_GRID,
              gap: 1,
              alignItems: 'center',
              width: '100%',
              py: 0.75,
              px: 1,
              mb: 0.5,
              borderBottom: 1,
              borderColor: 'divider',
            }}
          >
            <Typography variant="caption" fontWeight={600} color="text.secondary">
              Document
            </Typography>
            <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ textAlign: 'center' }}>
              Common
            </Typography>
            <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ textAlign: 'center' }}>
              Mandatory
            </Typography>
            <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ textAlign: 'right' }}>
              Actions
            </Typography>
          </Box>
          {rows.map((row) => {
            const scopeRows = rows.filter((r) => r.scope === row.scope)
            const scopeIndex = scopeRows.findIndex((r) => r.documentId === row.documentId)
            const masterHint = resolveDocumentMasterDescription(row.documentId)
            const displayDescription = row.description?.trim()
              ? row.description
              : resolveChecklistItemDescription(row)

            return (
              <Box
                key={`${row.scope}-${row.documentId}`}
                sx={{ width: '100%', borderBottom: 1, borderColor: 'divider', py: 1.5 }}
              >
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: ROW_GRID,
                    gap: 1,
                    alignItems: 'center',
                    width: '100%',
                    mb: 1,
                  }}
                >
                  <Typography variant="body2" fontWeight={600}>
                    {resolveDocumentMasterLabel(row.documentId)}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Toggle
                      size="sm"
                      checked={row.scope === 'common'}
                      onChange={(checked) =>
                        setRowScope(row.documentId, row.scope, checked ? 'common' : 'application')
                      }
                      label=""
                    />
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Toggle
                      size="sm"
                      checked={row.mandatory}
                      onChange={(checked) => patchRow(row.documentId, row.scope, { mandatory: checked })}
                      label=""
                    />
                  </Box>
                  <Stack direction="row" justifyContent="flex-end" spacing={0.25}>
                    <IconButton size="small" disabled={scopeIndex === 0} onClick={() => moveRow(row, -1)}>
                      <ArrowUp size={14} />
                    </IconButton>
                    <IconButton
                      size="small"
                      disabled={scopeIndex === scopeRows.length - 1}
                      onClick={() => moveRow(row, 1)}
                    >
                      <ArrowDown size={14} />
                    </IconButton>
                    <IconButton size="small" onClick={() => removeRow(row.documentId, row.scope)} color="error">
                      <Trash2 size={14} />
                    </IconButton>
                  </Stack>
                </Box>
                <FormField label="Description" sx={{ width: '100%' }}>
                  <Textarea
                    value={displayDescription}
                    onChange={(value) => patchRow(row.documentId, row.scope, { description: value })}
                    placeholder={masterHint ?? 'Instructions for applicants'}
                    autoResize
                    minRows={2}
                    maxRows={6}
                    fullWidth
                  />
                </FormField>
              </Box>
            )
          })}
        </Box>
      )}
    </Stack>
  )
}

interface CountryFormChecklistStepProps {
  data: CountryMasterFormData
  onChange: (next: CountryMasterFormData) => void
}

export function CountryFormChecklistStep({ data, onChange }: CountryFormChecklistStepProps) {
  const enabledSegments = data.segments.filter((s) => s.enabled && s.visaTypes.length > 0)

  if (enabledSegments.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary">
        Add visa types in the previous step before mapping documents.
      </Typography>
    )
  }

  const updateSegmentCommon = (
    segment: BusinessSegment,
    commonDocuments: CountryDocumentChecklistItem[],
  ) => {
    onChange({
      ...data,
      segments: data.segments.map((s) =>
        s.segment === segment ? { ...s, commonDocuments } : s,
      ),
    })
  }

  return (
    <Stack spacing={3} sx={{ width: '100%' }}>
      {enabledSegments.map((seg) => (
        <Stack key={seg.segment} spacing={2} sx={{ width: '100%' }}>
          <Typography variant="subtitle2" fontWeight={700}>
            {SEGMENT_LABELS[seg.segment]}
          </Typography>
          <Stack spacing={2.5} sx={{ width: '100%' }}>
            {seg.visaTypes.map((vt) => (
              <Stack key={vt.id} spacing={1} sx={{ width: '100%' }}>
                <Typography variant="body2" fontWeight={600}>
                  {vt.name || 'Unnamed visa type'}
                </Typography>
                <CountryVisaTypeDocumentTable
                  visaType={vt}
                  commonDocuments={seg.commonDocuments}
                  onCommonDocumentsChange={(commonDocuments) =>
                    updateSegmentCommon(seg.segment, commonDocuments)
                  }
                  onVisaTypeChange={(next) => {
                    onChange({
                      ...data,
                      segments: data.segments.map((s) =>
                        s.segment === seg.segment
                          ? {
                              ...s,
                              visaTypes: s.visaTypes.map((v) => (v.id === vt.id ? next : v)),
                            }
                          : s,
                      ),
                    })
                  }}
                />
              </Stack>
            ))}
          </Stack>
        </Stack>
      ))}
    </Stack>
  )
}
