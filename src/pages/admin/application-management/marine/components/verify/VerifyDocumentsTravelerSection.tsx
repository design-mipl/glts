import { Box, Typography } from '@mui/material'
import { UploadQueueTable } from '@/pages/customer/features/applications/components/UploadQueueTable'
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
  const readyRows = rows.filter(r => r.status !== 'processing')
  const singleListing = readyRows.length <= 1

  return (
    <Box>
      {rows.length > 0 ? (
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
          summaryApplicationId={applicationId}
        />
      ) : (
        <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13 }}>
          No travelers available for verification yet.
        </Typography>
      )}
    </Box>
  )
}
