import {
  Box,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import { ArrowDown, ArrowUp, Trash2 } from 'lucide-react'
import { FormField, Input, Select, Toggle } from '@/design-system/UIComponents'
import { documentMasterService } from '@/shared/services/documentMasterService'
import type { CountryDocumentChecklistItem, CountryVisaType } from '@/shared/types/countryMaster'

interface CountryChecklistTableProps {
  visaType: CountryVisaType
  onChange: (next: CountryVisaType) => void
}

function newChecklistItem(documentId: string, name: string, sortOrder: number): CountryDocumentChecklistItem {
  return {
    documentId,
    name,
    mandatory: false,
    ocrEnabled: false,
    sortOrder,
    validationRule: '',
    remarks: '',
  }
}

export function CountryChecklistTable({ visaType, onChange }: CountryChecklistTableProps) {
  const documents = documentMasterService.list({ status: 'active' })
  const sorted = [...visaType.checklist].sort((a, b) => a.sortOrder - b.sortOrder)

  const updateChecklist = (checklist: CountryDocumentChecklistItem[]) => {
    onChange({ ...visaType, checklist })
  }

  const addDocument = (documentId: string) => {
    const doc = documents.find((d) => d.id === documentId)
    if (!doc) return
    if (visaType.checklist.some((c) => c.documentId === documentId)) return
    updateChecklist([
      ...visaType.checklist,
      newChecklistItem(doc.id, doc.documentType, visaType.checklist.length),
    ])
  }

  const moveItem = (index: number, direction: -1 | 1) => {
    const next = [...sorted]
    const target = index + direction
    if (target < 0 || target >= next.length) return
    const temp = next[index]
    next[index] = next[target]
    next[target] = temp
    updateChecklist(next.map((item, i) => ({ ...item, sortOrder: i })))
  }

  return (
    <Box>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ mb: 2 }} alignItems="flex-end">
        <FormField label="Add from Document Master" sx={{ flex: 1, minWidth: 200 }}>
          <Select
            value=""
            placeholder="Select document…"
            onChange={(value) => {
              if (value) addDocument(String(value))
            }}
            options={[
              ...documents
                .filter((d) => !visaType.checklist.some((c) => c.documentId === d.id))
                .map((d) => ({ value: d.id, label: d.documentType })),
            ]}
          />
        </FormField>
      </Stack>

      {sorted.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          No documents mapped yet.
        </Typography>
      ) : (
        <Box sx={{ overflowX: 'auto' }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Document</TableCell>
                <TableCell width={90}>Mandatory</TableCell>
                <TableCell width={70}>OCR</TableCell>
                <TableCell>Validation rule</TableCell>
                <TableCell>Remarks</TableCell>
                <TableCell width={100} align="right">
                  Order
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sorted.map((item, index) => (
                <TableRow key={item.documentId}>
                  <TableCell>
                    <Typography variant="body2" fontWeight={600}>
                      {item.name}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Toggle
                      checked={item.mandatory}
                      onChange={(checked) =>
                        updateChecklist(
                          visaType.checklist.map((c) =>
                            c.documentId === item.documentId ? { ...c, mandatory: checked } : c,
                          ),
                        )
                      }
                      label=""
                    />
                  </TableCell>
                  <TableCell>
                    <Toggle
                      checked={item.ocrEnabled}
                      onChange={(checked) =>
                        updateChecklist(
                          visaType.checklist.map((c) =>
                            c.documentId === item.documentId ? { ...c, ocrEnabled: checked } : c,
                          ),
                        )
                      }
                      label=""
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      value={item.validationRule ?? ''}
                      onChange={(value) =>
                        updateChecklist(
                          visaType.checklist.map((c) =>
                            c.documentId === item.documentId
                              ? { ...c, validationRule: value }
                              : c,
                          ),
                        )
                      }
                      placeholder="e.g. Min 6 months validity"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      value={item.remarks ?? ''}
                      onChange={(value) =>
                        updateChecklist(
                          visaType.checklist.map((c) =>
                            c.documentId === item.documentId
                              ? { ...c, remarks: value }
                              : c,
                          ),
                        )
                      }
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Stack direction="row" justifyContent="flex-end">
                      <IconButton
                        size="small"
                        disabled={index === 0}
                        onClick={() => moveItem(index, -1)}
                      >
                        <ArrowUp size={14} />
                      </IconButton>
                      <IconButton
                        size="small"
                        disabled={index === sorted.length - 1}
                        onClick={() => moveItem(index, 1)}
                      >
                        <ArrowDown size={14} />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() =>
                          updateChecklist(
                            visaType.checklist.filter((c) => c.documentId !== item.documentId),
                          )
                        }
                      >
                        <Trash2 size={14} />
                      </IconButton>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      )}
    </Box>
  )
}

interface CountryFormChecklistStepProps {
  data: import('@/shared/types/countryMaster').CountryMasterFormData
  onChange: (next: import('@/shared/types/countryMaster').CountryMasterFormData) => void
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

  return (
    <Stack spacing={3}>
      {enabledSegments.map((seg) =>
        seg.visaTypes.map((vt) => (
          <Box key={`${seg.segment}-${vt.id}`} sx={{ mb: 2 }}>
            <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1.5 }}>
              {vt.name || 'Unnamed visa type'} · {seg.segment}
            </Typography>
            <CountryChecklistTable
              visaType={vt}
              onChange={(next) => {
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
          </Box>
        )),
      )}
    </Stack>
  )
}
