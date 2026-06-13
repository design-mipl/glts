import { ApplicationReviewTravelerSection } from '@/pages/customer/features/applications/components/review/ApplicationReviewTravelerSection'
import type { UploadQueueRow } from '@/pages/customer/features/applications/data/applicationFlowData'
import type { ApplicationReviewOverview } from '@/pages/customer/features/applications/utils/applicationReviewOverview'
import type { ApplicationDetailViewModel } from '@/pages/customer/features/applications/types/applicationDetail.types'

interface VerifyDocumentsTravelerSectionProps {
  rows: UploadQueueRow[]
  isBulk: boolean
  gltsApplicationId?: string
  gltsBatchId?: string
  summaryOverview: ApplicationReviewOverview
  detail?: ApplicationDetailViewModel
  applicationId?: string
  selectedTravelerId: string | null
  onSelectTraveler: (id: string) => void
}

export function VerifyDocumentsTravelerSection({
  rows,
  isBulk,
  gltsApplicationId,
  gltsBatchId,
  summaryOverview,
  detail,
  applicationId,
  selectedTravelerId,
  onSelectTraveler,
}: VerifyDocumentsTravelerSectionProps) {
  return (
    <ApplicationReviewTravelerSection
      rows={rows}
      selectedTravelerId={selectedTravelerId}
      onSelectTraveler={onSelectTraveler}
      isBulk={isBulk}
      gltsApplicationId={gltsApplicationId}
      gltsBatchId={gltsBatchId}
      summaryOverview={summaryOverview}
      detail={detail}
      applicationId={applicationId}
    />
  )
}
