import { CaptureStep } from '../CaptureStep'
import type { RetailCapturedImage } from '../../types'

interface PhotoStepProps {
  image?: RetailCapturedImage
  onCapture: (image: RetailCapturedImage) => void
  onBack: () => void
  onContinue: () => void
}

export function PhotoStep({ image, onCapture, onBack, onContinue }: PhotoStepProps) {
  return (
    <CaptureStep
      title="Take your photo"
      helperText="Look straight at the camera in good lighting, with a plain background."
      frameLabel="Position your face inside the frame"
      image={image}
      onCapture={onCapture}
      onBack={onBack}
      onContinue={onContinue}
    />
  )
}
