import { Box } from '@mui/material'
import type { ServiceMaster } from '@/shared/types/serviceMaster'
import { StepShell } from './StepShell'
import { OptionCard } from './OptionCard'
import type { ExtraServiceChoice, RetailExtraSelection } from '../types'

interface ExtraServiceStepProps {
  title: string
  helperText: string
  services: ServiceMaster[]
  selection: RetailExtraSelection
  onChange: (selection: RetailExtraSelection) => void
  onBack: () => void
  onContinue: () => void
}

export function ExtraServiceStep({ title, helperText, services, selection, onChange, onBack, onContinue }: ExtraServiceStepProps) {
  function setChoice(choice: ExtraServiceChoice) {
    onChange({ choice, serviceId: choice === 'glts_arranged' ? selection.serviceId ?? services[0]?.id : undefined })
  }

  const continueDisabled = selection.choice === 'glts_arranged' && !selection.serviceId

  return (
    <StepShell title={title} helperText={helperText} onBack={onBack} onContinue={onContinue} continueDisabled={continueDisabled}>
      <Box sx={{ display: 'grid', gap: 1.5 }}>
        <OptionCard
          label="I already have this arranged"
          description="You'll provide proof of this separately."
          selected={selection.choice === 'self_provided'}
          onSelect={() => setChoice('self_provided')}
        />
        {services.map((service) => (
          <OptionCard
            key={service.id}
            label={`Let GLTS arrange it — ${service.serviceName}`}
            description={service.defaultPrice != null ? `₹${service.defaultPrice.toLocaleString('en-IN')}` : undefined}
            selected={selection.choice === 'glts_arranged' && selection.serviceId === service.id}
            onSelect={() => onChange({ choice: 'glts_arranged', serviceId: service.id })}
          />
        ))}
        <OptionCard
          label="Skip for now"
          selected={selection.choice === 'skip'}
          onSelect={() => setChoice('skip')}
        />
      </Box>
    </StepShell>
  )
}
