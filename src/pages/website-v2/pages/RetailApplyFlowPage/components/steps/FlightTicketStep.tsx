import type { ServiceMaster } from '@/shared/types/serviceMaster'
import { ExtraServiceStep } from '../ExtraServiceStep'
import type { RetailExtraSelection } from '../../types'

interface FlightTicketStepProps {
  services: ServiceMaster[]
  selection: RetailExtraSelection
  onChange: (selection: RetailExtraSelection) => void
  onBack: () => void
  onContinue: () => void
}

export function FlightTicketStep({ services, selection, onChange, onBack, onContinue }: FlightTicketStepProps) {
  return (
    <ExtraServiceStep
      title="Flight ticket"
      helperText="A dummy or confirmed ticket is often needed for your visa application."
      services={services}
      selection={selection}
      onChange={onChange}
      onBack={onBack}
      onContinue={onContinue}
    />
  )
}
