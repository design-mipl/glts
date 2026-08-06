import { ApplicationReviewOverviewCard } from '@/pages/customer/features/applications/components/review/ApplicationReviewOverviewCard'
import { toApplicationReviewOverview } from '@/pages/customer/features/applications/utils/applicationReviewOverview'
import type { VerifyOverviewData } from '../../utils/verifyDocumentsUtils'

interface VerifyDocumentsOverviewProps {
  overview: VerifyOverviewData
}

export function VerifyDocumentsOverview({ overview }: VerifyDocumentsOverviewProps) {
  return (
    <ApplicationReviewOverviewCard
      overview={toApplicationReviewOverview(overview)}
      travelerCount={overview.travelerCount}
      variant="admin"
    />
  )
}
