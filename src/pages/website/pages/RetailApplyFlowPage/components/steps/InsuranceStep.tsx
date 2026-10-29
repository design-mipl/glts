import type { ServiceMaster } from '@/shared/types/serviceMaster'
import { ExtraServiceStep } from '../ExtraServiceStep'
import type { RetailExtraSelection } from '../../types'

interface InsuranceStepProps {
  services: ServiceMaster[]
  selection: RetailExtraSelection
  travelDate?: string
  onChange: (selection: RetailExtraSelection) => void
  onBack: () => void
  onContinue: () => void
  previewOnly?: boolean
}

export function InsuranceStep({
  services,
  selection,
  travelDate,
  onChange,
  onBack,
  onContinue,
  previewOnly,
}: InsuranceStepProps) {
  return (
    <ExtraServiceStep
      title="Travel insurance"
      helperText="Some embassies require proof of travel insurance."
      kind="insurance"
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
