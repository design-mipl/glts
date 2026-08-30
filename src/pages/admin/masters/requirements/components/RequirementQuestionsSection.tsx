import { Box, Stack, Typography } from '@mui/material'
import { Plus } from 'lucide-react'
import { Button } from '@/design-system/UIComponents'
import type { RequirementQuestion } from '@/shared/types/requirementMaster'
import {
  createEmptyRequirementQuestion,
  moveItem,
} from '../utils/requirementQuestionUtils'
import { RequirementQuestionCard } from './RequirementQuestionCard'

interface RequirementQuestionsSectionProps {
  questions: RequirementQuestion[]
  onChange: (questions: RequirementQuestion[]) => void
}

export function RequirementQuestionsSection({
  questions,
  onChange,
}: RequirementQuestionsSectionProps) {
  return (
    <Stack spacing={2}>
      {questions.length === 0 ? (
        <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13 }}>
          No questions added yet.
        </Typography>
      ) : null}

      {questions.map((question, index) => (
        <RequirementQuestionCard
          key={question.id}
          index={index}
          question={question}
          canMoveUp={index > 0}
          canMoveDown={index < questions.length - 1}
          onChange={(next) =>
            onChange(questions.map((item) => (item.id === question.id ? next : item)))
          }
          onDelete={() => onChange(questions.filter((item) => item.id !== question.id))}
          onMoveUp={() => onChange(moveItem(questions, index, 'up'))}
          onMoveDown={() => onChange(moveItem(questions, index, 'down'))}
        />
      ))}

      <Box>
        <Button
          label="Add question"
          startIcon={<Plus size={14} />}
          onClick={() => onChange([...questions, createEmptyRequirementQuestion()])}
        />
      </Box>
    </Stack>
  )
}
