import { Box } from '@mui/material'
import { ORIGINAL_COLLECTION_METHOD_OPTIONS } from '@/shared/utils/originalDocumentCollectionUtils'
import type { OriginalDocumentCollectionMethod } from '@/shared/types/originalDocumentCollection'
import { StepShell } from '../StepShell'
import { OptionCard } from '../OptionCard'

interface CollectionMethodStepProps {
  selectedMethod?: OriginalDocumentCollectionMethod
  onSelect: (method: OriginalDocumentCollectionMethod) => void
  onBack: () => void
  onContinue: () => void
}

export function CollectionMethodStep({ selectedMethod, onSelect, onBack, onContinue }: CollectionMethodStepProps) {
  return (
    <StepShell
      title="How should we collect your originals?"
      helperText="Choose whichever is easiest for you."
      onBack={onBack}
      onContinue={onContinue}
      continueDisabled={!selectedMethod}
    >
      <Box sx={{ display: 'grid', gap: 1.5 }}>
        {ORIGINAL_COLLECTION_METHOD_OPTIONS.map((option) => (
          <OptionCard
            key={option.value}
            label={option.label}
            selected={option.value === selectedMethod}
            onSelect={() => onSelect(option.value)}
          />
        ))}
      </Box>
    </StepShell>
  )
}
