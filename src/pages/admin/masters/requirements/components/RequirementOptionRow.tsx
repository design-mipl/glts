import { useState } from 'react'
import { Box, Collapse, Stack, Typography } from '@mui/material'
import { ChevronDown, Circle, Plus, Trash2 } from 'lucide-react'
import { Button, IconButton, Input } from '@/design-system/UIComponents'
import type { RequirementQuestionOption } from '@/shared/types/requirementMaster'
import { formatDocumentCount } from '../utils/requirementQuestionUtils'
import { RequirementDocumentChips } from './RequirementDocumentChips'
import { RequirementDocumentPickerModal } from './RequirementDocumentPickerModal'

interface RequirementOptionRowProps {
  option: RequirementQuestionOption
  optionIndex: number
  canRemove: boolean
  onChange: (next: RequirementQuestionOption) => void
  onRemove: () => void
}

export function RequirementOptionRow({
  option,
  optionIndex,
  canRemove,
  onChange,
  onRemove,
}: RequirementOptionRowProps) {
  const [expanded, setExpanded] = useState(false)
  const [pickerOpen, setPickerOpen] = useState(false)
  const count = option.documentIds.length

  return (
    <>
      <Box
        sx={{
          border: 1,
          borderColor: 'divider',
          borderRadius: 1.5,
          overflow: 'hidden',
          bgcolor: 'background.paper',
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          spacing={1}
          sx={{ px: 1.5, py: 1, cursor: 'pointer' }}
          onClick={() => setExpanded((value) => !value)}
        >
          <Box sx={{ color: 'text.secondary', display: 'flex', flexShrink: 0 }}>
            <Circle size={14} />
          </Box>
          <Box
            sx={{ flex: 1, minWidth: 0 }}
            onClick={(event) => event.stopPropagation()}
          >
            <Input
              value={option.label}
              onChange={(value) => onChange({ ...option, label: value })}
              placeholder={`Option ${optionIndex + 1}`}
              size="sm"
              fullWidth
            />
          </Box>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ flexShrink: 0, fontSize: 12, whiteSpace: 'nowrap' }}
          >
            {formatDocumentCount(count)}
          </Typography>
          <IconButton
            icon={
              <ChevronDown
                size={16}
                style={{
                  transform: expanded ? 'rotate(180deg)' : undefined,
                  transition: 'transform 150ms ease',
                }}
              />
            }
            tooltip={expanded ? 'Collapse' : 'Expand documents'}
            size="sm"
            onClick={(event) => {
              event.stopPropagation()
              setExpanded((value) => !value)
            }}
          />
          <IconButton
            icon={<Trash2 size={14} />}
            tooltip="Remove option"
            size="sm"
            disabled={!canRemove}
            onClick={(event) => {
              event.stopPropagation()
              onRemove()
            }}
          />
        </Stack>

        <Collapse in={expanded}>
          <Box sx={{ px: 1.5, pb: 1.5, pt: 0.5, borderTop: 1, borderColor: 'divider' }}>
            <Stack spacing={1.25}>
              <Typography variant="body2" fontWeight={600} sx={{ fontSize: 13 }}>
                Documents required when this option is selected
              </Typography>
              <RequirementDocumentChips
                documentIds={option.documentIds}
                emptyLabel="No documents mapped."
                onRemove={(documentId) =>
                  onChange({
                    ...option,
                    documentIds: option.documentIds.filter((id) => id !== documentId),
                  })
                }
              />
              <Stack direction="row">
                <Button
                  label="Add document"
                  size="sm"
                  variant="text"
                  startIcon={<Plus size={14} />}
                  onClick={() => setPickerOpen(true)}
                />
              </Stack>
            </Stack>
          </Box>
        </Collapse>
      </Box>

      <RequirementDocumentPickerModal
        open={pickerOpen}
        title="Add document for this option"
        subtitle="Select a document required when this answer is selected"
        excludeDocumentIds={option.documentIds}
        onClose={() => setPickerOpen(false)}
        onAdd={(documentId) =>
          onChange({ ...option, documentIds: [...option.documentIds, documentId] })
        }
      />
    </>
  )
}
