import { Typography } from '@mui/material'
import { UploadQueueTable } from '../UploadQueueTable'
import type { UploadQueueRow } from '../../data/applicationFlowData'
import type { ApplicationReviewOverview } from '../../utils/applicationReviewOverview'
import type { ApplicationDetailViewModel } from '../../types/applicationDetail.types'

export interface ApplicationReviewTravelerSectionProps {
  rows: UploadQueueRow[]
  selectedTravelerId: string | null
  onSelectTraveler: (id: string) => void
  isBulk?: boolean
  gltsApplicationId?: string
  gltsBatchId?: string
  summaryOverview: ApplicationReviewOverview
  detail?: ApplicationDetailViewModel
  summaryApplicationId?: string
}

export function ApplicationReviewTravelerSection({
  rows,
  selectedTravelerId,
  onSelectTraveler,
  isBulk = false,
  gltsApplicationId,
  gltsBatchId,
  summaryOverview,
  detail,
  summaryApplicationId,
}: ApplicationReviewTravelerSectionProps) {
  const readyRows = rows.filter(r => r.status !== 'processing')
  const singleListing = !isBulk && readyRows.length <= 1

  if (rows.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13 }}>
        No travelers available for this application yet.
      </Typography>
    )
  }

  return (
    <UploadQueueTable
      rows={rows}
      selectedId={selectedTravelerId}
      onSelect={onSelectTraveler}
      selectionMode
      readOnly
      singleListing={singleListing}
      gltsApplicationId={gltsApplicationId}
      gltsBatchId={isBulk ? gltsBatchId : undefined}
      summaryOverview={summaryOverview}
      summaryDetail={detail}
      summaryApplicationId={summaryApplicationId}
    />
  )
}
