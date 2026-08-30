import { Box, Stack, Typography } from '@mui/material'
import { Plus } from 'lucide-react'
import { Button } from '@/design-system/UIComponents'
import type { RequirementQuestion } from '@/shared/types/requirementMaster'
import { createEmptyRequirementQuestion } from '../utils/requirementQuestionUtils'
import { RequirementQuestionCard } from './RequirementQuestionCard'

interface RequirementQuestionnaireTabProps {
  questions: RequirementQuestion[]
  onChange: (questions: RequirementQuestion[]) => void
}

export function RequirementQuestionnaireTab({
  questions,
  onChange,
}: RequirementQuestionnaireTabProps) {
  return (
    <Stack spacing={2}>
      {questions.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          No questions yet. Add a question to start the questionnaire.
        </Typography>
      ) : null}
      {questions.map((question, index) => (
        <RequirementQuestionCard
          key={question.id}
          index={index}
          question={question}
          onChange={(next) =>
            onChange(questions.map((item) => (item.id === question.id ? next : item)))
          }
          onDelete={() => onChange(questions.filter((item) => item.id !== question.id))}
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
