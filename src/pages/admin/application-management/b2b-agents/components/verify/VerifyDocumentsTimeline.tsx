import { ApplicationReviewTimelineCard } from '@/pages/customer/features/applications/components/review/ApplicationReviewTimelineCard'
import type { ApplicationProcessingTimelineStep } from '@/shared/types/applicationProcessingTimeline'

interface VerifyDocumentsTimelineProps {
  steps: ApplicationProcessingTimelineStep[]
  multiTraveler: boolean
}

export function VerifyDocumentsTimeline({ steps, multiTraveler }: VerifyDocumentsTimelineProps) {
  return (
    <ApplicationReviewTimelineCard steps={steps} multiTraveler={multiTraveler} variant="admin" />
  )
}
