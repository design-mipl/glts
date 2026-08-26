import type { ServiceMaster } from '@/shared/types/serviceMaster'
import { ExtraServiceStep } from '../ExtraServiceStep'
import type { RetailExtraSelection } from '../../types'

interface InsuranceStepProps {
  services: ServiceMaster[]
  selection: RetailExtraSelection
  onChange: (selection: RetailExtraSelection) => void
  onBack: () => void
  onContinue: () => void
}

export function InsuranceStep({ services, selection, onChange, onBack, onContinue }: InsuranceStepProps) {
  return (
    <ExtraServiceStep
      title="Travel insurance"
      helperText="Some embassies require proof of travel insurance."
      services={services}
      selection={selection}
      onChange={onChange}
      onBack={onBack}
      onContinue={onContinue}
    />
  )
}
