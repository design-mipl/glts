import type { SingleApplicationRow } from '@/pages/customer/features/applications/data/applicationFlowData'

export function formatRetailApplyDropOffLabel(
  apply: NonNullable<SingleApplicationRow['retailApply']>,
): string {
  const { primary, secondary } = formatRetailApplyDropOffLines(apply)
  const stepPart = secondary ? `${primary} · ${secondary}` : primary
  if (apply.paymentLinkSentAt) {
    return stepPart.includes('Link sent') ? stepPart : `${stepPart} · Link sent`
  }
  return stepPart
}

/** Two-line listing layout: step progress, then step name. */
export function formatRetailApplyDropOffLines(
  apply: NonNullable<SingleApplicationRow['retailApply']>,
): { primary: string; secondary?: string } {
  const label = apply.lastStepLabel?.trim() || 'Draft'
  if (apply.lastStepIndex && apply.totalSteps) {
    const progress = `Step ${apply.lastStepIndex} of ${apply.totalSteps}`
    return {
      primary: apply.paymentLinkSentAt ? `${progress} · Link sent` : progress,
      secondary: label,
    }
  }
  return {
    primary: apply.paymentLinkSentAt && !label.includes('Link sent') ? `${label} · Link sent` : label,
  }
}

