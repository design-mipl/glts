import type { ServiceMaster } from '@/shared/types/serviceMaster'
import { ExtraServiceStep } from '../ExtraServiceStep'
import type { RetailExtraSelection } from '../../types'

interface FlightTicketStepProps {
  services: ServiceMaster[]
  selection: RetailExtraSelection
  travelDate?: string
  onChange: (selection: RetailExtraSelection) => void
  onBack: () => void
  onContinue: () => void
  previewOnly?: boolean
}

export function FlightTicketStep({
  services,
  selection,
  travelDate,
  onChange,
  onBack,
  onContinue,
  previewOnly,
}: FlightTicketStepProps) {
  return (
    <ExtraServiceStep
      title="Flight ticket"
      helperText="A dummy or confirmed ticket is often needed for your visa application."
      kind="flight"
      services={services}
      selection={selection}
      travelDate={travelDate}
      onChange={onChange}
      onBack={onBack}
      onContinue={onContinue}
      previewOnly={previewOnly}
    />
  )
}
