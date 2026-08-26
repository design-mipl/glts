import { Box } from '@mui/material'
import type { EligibilityRuleDefinition } from '@/shared/data/retailJourneyRules'
import { StepShell } from '../StepShell'
import { OptionCard } from '../OptionCard'

interface EligibilityStepProps {
  rule: EligibilityRuleDefinition
  selectedOptionId?: string
  onSelect: (optionId: string) => void
  onBack: () => void
  onContinue: () => void
}

export function EligibilityStep({ rule, selectedOptionId, onSelect, onBack, onContinue }: EligibilityStepProps) {
  return (
    <StepShell
      title={rule.title}
      helperText={rule.helperText}
      onBack={onBack}
      onContinue={onContinue}
      continueDisabled={!selectedOptionId}
    >
      <Box sx={{ display: 'grid', gap: 1.5 }}>
        {rule.options.map((option) => (
          <OptionCard
            key={option.id}
            label={option.label}
            description={option.description}
            selected={option.id === selectedOptionId}
            onSelect={() => onSelect(option.id)}
            tone={option.eligible ? 'default' : 'critical'}
          />
        ))}
      </Box>
    </StepShell>
  )
}
