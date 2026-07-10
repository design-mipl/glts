import { useEffect, useState } from 'react'
import { Box, Divider, IconButton, Stack, Typography } from '@mui/material'
import { ChevronDown, ChevronUp, Plus, Trash2 } from 'lucide-react'
import {
  Button,
  FormField,
  Input,
  Modal,
  Toggle,
} from '@/design-system/UIComponents'
import { AdminFullPageFormFooter } from '@/pages/admin/components/AdminFullPageFormFooter'
import { applyQcChecklistKindMetadata } from '@/shared/data/countryQcChecklistDefaults'
import type { CountryQcChecklistKind, CountryQcChecklistTemplate } from '@/shared/types/countryMaster'
import {
  cloneQcChecklistTemplate,
  generateQcChecklistItemId,
  generateQcChecklistSectionId,
  normalizeQcChecklistTemplate,
  reorderQcChecklistItems,
  reorderQcChecklistSections,
} from '@/shared/utils/countryQcChecklistUtils'

const KIND_LABELS: Record<CountryQcChecklistKind, string> = {
  ops: 'OPS',
  docs: 'Documentation',
}

interface EditQcChecklistModalProps {
  open: boolean
  kind: CountryQcChecklistKind
  initialTemplate: CountryQcChecklistTemplate
  readOnly?: boolean
  onClose: () => void
  onSubmit: (template: CountryQcChecklistTemplate) => void
}

export function EditQcChecklistModal({
  open,
  kind,
  initialTemplate,
  readOnly = false,
  onClose,
  onSubmit,
}: EditQcChecklistModalProps) {
  const [draft, setDraft] = useState<CountryQcChecklistTemplate>(() =>
    cloneQcChecklistTemplate(initialTemplate),
  )

  useEffect(() => {
    if (open) {
      setDraft(cloneQcChecklistTemplate(initialTemplate))
    }
  }, [open, initialTemplate])

  const updateDraft = (next: CountryQcChecklistTemplate) => {
    setDraft(next)
  }

  const handleSave = () => {
    onSubmit(applyQcChecklistKindMetadata(kind, normalizeQcChecklistTemplate(draft)))
  }

  const addSection = () => {
    const nextSortOrder = draft.sections.length
    updateDraft({
      ...draft,
      sections: [
        ...draft.sections,
        {
          id: generateQcChecklistSectionId(),
          title: `Section ${nextSortOrder + 1}`,
          sortOrder: nextSortOrder,
          enabled: true,
          items: [],
        },
      ],
    })
  }

  const addItem = (sectionId: string) => {
    updateDraft({
      ...draft,
      sections: draft.sections.map((section) => {
        if (section.id !== sectionId) return section
        const nextSortOrder = section.items.length
        return {
          ...section,
          items: [
            ...section.items,
            {
              id: generateQcChecklistItemId(),
              label: `Checklist item ${nextSortOrder + 1}`,
              sortOrder: nextSortOrder,
              enabled: true,
            },
          ],
        }
      }),
    })
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="lg"
      title={readOnly ? `View ${KIND_LABELS[kind]} checklist` : `Edit ${KIND_LABELS[kind]} checklist`}
      subtitle="Configure sections and checklist items used during application verification."
      footer={
        readOnly ? (
          <AdminFullPageFormFooter onCancel={onClose} cancelLabel="Close" />
        ) : (
          <AdminFullPageFormFooter
            onCancel={onClose}
            onSave={handleSave}
            saveLabel="Save checklist"
          />
        )
      }
    >
      <Stack spacing={2}>
        {draft.sections.map((section, sectionIndex) => (
          <Box
            key={section.id}
            sx={{
              border: 1,
              borderColor: 'divider',
              borderRadius: 2,
              p: 2,
              bgcolor: section.enabled ? 'background.paper' : 'action.hover',
            }}
          >
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              spacing={1}
              sx={{ mb: 1.5 }}
            >
              <Typography variant="subtitle2" fontWeight={700} sx={{ fontSize: 14 }}>
                Section {sectionIndex + 1}
              </Typography>
              {!readOnly ? (
                <Stack direction="row" alignItems="center" spacing={0.5} sx={{ flexShrink: 0 }}>
                  <Toggle
                    checked={section.enabled}
                    onChange={(enabled) =>
                      updateDraft({
                        ...draft,
                        sections: draft.sections.map((entry) =>
                          entry.id === section.id ? { ...entry, enabled } : entry,
                        ),
                      })
                    }
                    label="Enabled"
                    size="sm"
                  />
                  <IconButton
                    size="small"
                    disabled={sectionIndex === 0}
                    onClick={() =>
                      updateDraft({
                        ...draft,
                        sections: reorderQcChecklistSections(draft.sections, section.id, 'up'),
                      })
                    }
                    aria-label="Move section up"
                  >
                    <ChevronUp size={16} />
                  </IconButton>
                  <IconButton
                    size="small"
                    disabled={sectionIndex === draft.sections.length - 1}
                    onClick={() =>
                      updateDraft({
                        ...draft,
                        sections: reorderQcChecklistSections(draft.sections, section.id, 'down'),
                      })
                    }
                    aria-label="Move section down"
                  >
                    <ChevronDown size={16} />
                  </IconButton>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() =>
                      updateDraft({
                        ...draft,
                        sections: draft.sections.filter((entry) => entry.id !== section.id),
                      })
                    }
                    aria-label="Delete section"
                  >
                    <Trash2 size={16} />
                  </IconButton>
                </Stack>
              ) : null}
            </Stack>

            <FormField label="Section heading" sx={{ width: '100%' }}>
              <Input
                fullWidth
                value={section.title}
                disabled={readOnly}
                placeholder="Enter section heading"
                onChange={(value) =>
                  updateDraft({
                    ...draft,
                    sections: draft.sections.map((entry) =>
                      entry.id === section.id ? { ...entry, title: value } : entry,
                    ),
                  })
                }
              />
            </FormField>

            <Divider sx={{ my: 2 }} />

            <Typography
              variant="body2"
              fontWeight={600}
              sx={{ fontSize: 13, mb: 1 }}
            >
              Checklist points
            </Typography>

            <Stack spacing={1}>
              {section.items.map((item, itemIndex) => (
                <Stack key={item.id} direction="row" alignItems="center" spacing={1}>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Input
                      fullWidth
                      value={item.label}
                      disabled={readOnly}
                      placeholder="Enter checklist point"
                      onChange={(value) =>
                        updateDraft({
                          ...draft,
                          sections: draft.sections.map((entry) =>
                            entry.id === section.id
                              ? {
                                  ...entry,
                                  items: entry.items.map((row) =>
                                    row.id === item.id ? { ...row, label: value } : row,
                                  ),
                                }
                              : entry,
                          ),
                        })
                      }
                    />
                  </Box>

                  {!readOnly ? (
                    <Stack
                      direction="row"
                      alignItems="center"
                      spacing={0.5}
                      sx={{ flexShrink: 0 }}
                    >
                      <Toggle
                        checked={item.enabled}
                        onChange={(enabled) =>
                          updateDraft({
                            ...draft,
                            sections: draft.sections.map((entry) =>
                              entry.id === section.id
                                ? {
                                    ...entry,
                                    items: entry.items.map((row) =>
                                      row.id === item.id ? { ...row, enabled } : row,
                                    ),
                                  }
                                : entry,
                            ),
                          })
                        }
                        size="sm"
                      />
                      <IconButton
                        size="small"
                        disabled={itemIndex === 0}
                        onClick={() =>
                          updateDraft({
                            ...draft,
                            sections: draft.sections.map((entry) =>
                              entry.id === section.id
                                ? {
                                    ...entry,
                                    items: reorderQcChecklistItems(entry, item.id, 'up'),
                                  }
                                : entry,
                            ),
                          })
                        }
                        aria-label="Move point up"
                      >
                        <ChevronUp size={16} />
                      </IconButton>
                      <IconButton
                        size="small"
                        disabled={itemIndex === section.items.length - 1}
                        onClick={() =>
                          updateDraft({
                            ...draft,
                            sections: draft.sections.map((entry) =>
                              entry.id === section.id
                                ? {
                                    ...entry,
                                    items: reorderQcChecklistItems(entry, item.id, 'down'),
                                  }
                                : entry,
                            ),
                          })
                        }
                        aria-label="Move point down"
                      >
                        <ChevronDown size={16} />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() =>
                          updateDraft({
                            ...draft,
                            sections: draft.sections.map((entry) =>
                              entry.id === section.id
                                ? {
                                    ...entry,
                                    items: entry.items.filter((row) => row.id !== item.id),
                                  }
                                : entry,
                            ),
                          })
                        }
                        aria-label="Delete point"
                      >
                        <Trash2 size={16} />
                      </IconButton>
                    </Stack>
                  ) : null}
                </Stack>
              ))}
            </Stack>

            {!readOnly ? (
              <Box sx={{ mt: 1.5 }}>
                <Button
                  label="Add checklist point"
                  size="sm"
                  variant="text"
                  startIcon={<Plus size={14} />}
                  onClick={() => addItem(section.id)}
                />
              </Box>
            ) : null}

            {!readOnly && section.items.length === 0 ? (
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13, mt: 1 }}>
                No checklist points yet. Add a point for this section.
              </Typography>
            ) : null}
          </Box>
        ))}

        {!readOnly ? (
          <Button
            label="Add section"
            size="sm"
            variant="outlined"
            startIcon={<Plus size={14} />}
            onClick={addSection}
          />
        ) : null}

        {draft.sections.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13 }}>
            No sections yet. Add a section to start building this checklist.
          </Typography>
        ) : null}
      </Stack>
    </Modal>
  )
}
