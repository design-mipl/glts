import { useState } from 'react'
import { Box, Stack, Typography } from '@mui/material'
import { ArrowDown, ArrowUp, Plus, Trash2 } from 'lucide-react'
import {
  BaseCard,
  Button,
  ConfirmDialog,
  FormField,
  IconButton,
  Input,
  Toggle,
} from '@/design-system/UIComponents'
import type { RequirementQuestion } from '@/shared/types/requirementMaster'
import { createRequirementOption } from '../utils/requirementQuestionUtils'
import { RequirementOptionRow } from './RequirementOptionRow'

interface RequirementQuestionCardProps {
  index: number
  question: RequirementQuestion
  canMoveUp: boolean
  canMoveDown: boolean
  onChange: (next: RequirementQuestion) => void
  onDelete: () => void
  onMoveUp: () => void
  onMoveDown: () => void
}

export function RequirementQuestionCard({
  index,
  question,
  canMoveUp,
  canMoveDown,
  onChange,
  onDelete,
  onMoveUp,
  onMoveDown,
}: RequirementQuestionCardProps) {
  const [deleteOpen, setDeleteOpen] = useState(false)

  const patch = (partial: Partial<RequirementQuestion>) => onChange({ ...question, ...partial })

  return (
    <>
      <BaseCard sx={{ p: 2, borderWidth: 1, borderColor: 'divider' }}>
        <Stack spacing={2}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
            <Typography variant="subtitle2" fontWeight={700}>
              Question {index + 1}
            </Typography>
            <Stack direction="row" spacing={0.5} alignItems="center">
              <IconButton
                icon={<ArrowUp size={14} />}
                tooltip="Move up"
                size="sm"
                disabled={!canMoveUp}
                onClick={onMoveUp}
              />
              <IconButton
                icon={<ArrowDown size={14} />}
                tooltip="Move down"
                size="sm"
                disabled={!canMoveDown}
                onClick={onMoveDown}
              />
              <IconButton
                icon={<Trash2 size={16} />}
                tooltip="Delete question"
                size="sm"
                color="error"
                onClick={() => setDeleteOpen(true)}
              />
            </Stack>
          </Stack>

          <FormField label="Question" required>
            <Input
              value={question.prompt}
              onChange={(value) => patch({ prompt: value })}
              placeholder="Enter your question"
              size="sm"
              fullWidth
            />
          </FormField>

          <Toggle
            label="Required"
            checked={question.required}
            onChange={(checked) => patch({ required: checked })}
            size="sm"
          />

          <Stack spacing={1}>
            <Typography variant="body2" fontWeight={600} sx={{ fontSize: 13 }}>
              Options
            </Typography>
            {question.options.map((option, optionIndex) => (
              <RequirementOptionRow
                key={option.id}
                option={option}
                optionIndex={optionIndex}
                canRemove={question.options.length > 2}
                onChange={(next) =>
                  patch({
                    options: question.options.map((item) =>
                      item.id === option.id ? next : item,
                    ),
                  })
                }
                onRemove={() =>
                  patch({
                    options: question.options.filter((item) => item.id !== option.id),
                  })
                }
              />
            ))}
            <Box>
              <Button
                label="Add option"
                size="sm"
                variant="text"
                startIcon={<Plus size={14} />}
                onClick={() =>
                  patch({ options: [...question.options, createRequirementOption()] })
                }
              />
            </Box>
          </Stack>
        </Stack>
      </BaseCard>

      <ConfirmDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={() => {
          setDeleteOpen(false)
          onDelete()
        }}
        title="Delete this question?"
        description="This question, its options, and option document mappings will be removed. Document Master records are not deleted."
        confirmLabel="Delete"
        variant="destructive"
      />
    </>
  )
}
