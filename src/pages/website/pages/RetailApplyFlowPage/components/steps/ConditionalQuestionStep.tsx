import { Box } from '@mui/material'
import type { ConditionalQuestionDefinition } from '@/shared/data/retailJourneyRules'
import { StepShell } from '../StepShell'
import { OptionCard } from '../OptionCard'

interface ConditionalQuestionStepProps {
  question: ConditionalQuestionDefinition
  selectedOptionId?: string
  onSelect: (optionId: string) => void
  onBack: () => void
  onContinue: () => void
}

export function ConditionalQuestionStep({
  question,
  selectedOptionId,
  onSelect,
  onBack,
  onContinue,
}: ConditionalQuestionStepProps) {
  return (
    <StepShell
      title={question.title}
      helperText={question.helperText}
      onBack={onBack}
      onContinue={onContinue}
      continueDisabled={!selectedOptionId}
    >
      <Box sx={{ display: 'grid', gap: 1.5 }}>
        {question.options.map((option) => (
          <OptionCard
            key={option.id}
            label={option.label}
            description={option.description}
            selected={option.id === selectedOptionId}
            onSelect={() => onSelect(option.id)}
          />
        ))}
      </Box>
    </StepShell>
  )
}
