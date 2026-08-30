import { useState } from 'react'
import { Box, Stack, Typography } from '@mui/material'
import { Circle, Plus, Square, Trash2, X } from 'lucide-react'
import {
  BaseCard,
  Button,
  Checkbox,
  ConfirmDialog,
  FormField,
  IconButton,
  Input,
  RadioGroup,
} from '@/design-system/UIComponents'
import type { RequirementQuestion, RequirementQuestionType } from '@/shared/types/requirementMaster'
import { createRequirementOption } from '../utils/requirementQuestionUtils'

interface RequirementQuestionCardProps {
  index: number
  question: RequirementQuestion
  onChange: (next: RequirementQuestion) => void
  onDelete: () => void
}

export function RequirementQuestionCard({
  index,
  question,
  onChange,
  onDelete,
}: RequirementQuestionCardProps) {
  const [deleteOpen, setDeleteOpen] = useState(false)

  const patch = (partial: Partial<RequirementQuestion>) => onChange({ ...question, ...partial })

  const updateOption = (optionId: string, label: string) => {
    patch({
      options: question.options.map((option) =>
        option.id === optionId ? { ...option, label } : option,
      ),
    })
  }

  const removeOption = (optionId: string) => {
    if (question.options.length <= 2) return
    patch({ options: question.options.filter((option) => option.id !== optionId) })
  }

  const OptionMark = question.type === 'checkboxes' ? Square : Circle

  return (
    <>
      <BaseCard sx={{ p: 2, borderWidth: 1, borderColor: 'divider' }}>
        <Stack spacing={2}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
            <Typography variant="subtitle2" fontWeight={700}>
              Question {index + 1}
            </Typography>
            <IconButton
              icon={<Trash2 size={16} />}
              tooltip="Delete question"
              size="sm"
              color="error"
              onClick={() => setDeleteOpen(true)}
            />
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

          <RadioGroup
            label="Question type"
            size="sm"
            orientation="horizontal"
            value={question.type}
            onChange={(value) => patch({ type: value as RequirementQuestionType })}
            options={[
              { value: 'multiple_choice', label: 'Multiple choice' },
              { value: 'checkboxes', label: 'Checkboxes' },
            ]}
          />

          <Stack spacing={1}>
            <Typography variant="body2" fontWeight={600} sx={{ fontSize: 13 }}>
              Options
            </Typography>
            {question.options.map((option, optionIndex) => (
              <Stack key={option.id} direction="row" spacing={1} alignItems="center">
                <Box sx={{ color: 'text.secondary', display: 'flex', flexShrink: 0 }}>
                  <OptionMark size={16} />
                </Box>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Input
                    value={option.label}
                    onChange={(value) => updateOption(option.id, value)}
                    placeholder={`Option ${optionIndex + 1}`}
                    size="sm"
                    fullWidth
                  />
                </Box>
                <IconButton
                  icon={<X size={14} />}
                  tooltip="Remove option"
                  size="sm"
                  disabled={question.options.length <= 2}
                  onClick={() => removeOption(option.id)}
                />
              </Stack>
            ))}
            <Box>
              <Button
                label="Add option"
                size="sm"
                variant="text"
                startIcon={<Plus size={14} />}
                onClick={() => patch({ options: [...question.options, createRequirementOption()] })}
              />
            </Box>
          </Stack>

          <Checkbox
            label="Required"
            size="sm"
            checked={question.required}
            onChange={(checked) => patch({ required: checked })}
          />
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
        description="This question and its options will be removed."
        confirmLabel="Delete"
        variant="destructive"
      />
    </>
  )
}
