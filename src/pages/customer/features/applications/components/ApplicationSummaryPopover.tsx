import { useState } from 'react'
import { IconButton } from '@mui/material'
import { Info } from 'lucide-react'
import { Modal } from '@/design-system/UIComponents'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'
import type { UploadQueueRow } from '../data/applicationFlowData'
import type { ApplicationReviewOverview } from '../utils/applicationReviewOverview'
import type { ApplicationDetailViewModel } from '../types/applicationDetail.types'
import { ApplicationSummaryContent } from './ApplicationSummaryContent'

interface ApplicationSummaryPopoverProps {
  overview: ApplicationReviewOverview
  row: UploadQueueRow
  singleListing?: boolean
  verifyContext?: {
    detail: ApplicationDetailViewModel
    applicationId: string
  }
}

export function ApplicationSummaryPopover({
  overview,
  row,
  singleListing = false,
  verifyContext,
}: ApplicationSummaryPopoverProps) {
  const colors = usePublicBrandColors()
  const [open, setOpen] = useState(false)

  return (
    <>
      <IconButton
        size="small"
        aria-label="View application summary"
        onClick={event => {
          event.stopPropagation()
          setOpen(true)
        }}
        sx={{
          color: colors.textMuted,
          '&:hover': { color: colors.navy, bgcolor: colors.surface },
        }}
      >
        <Info size={16} />
      </IconButton>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Application summary"
        subtitle={row.travelerName}
        size="lg"
      >
        <ApplicationSummaryContent
          overview={overview}
          row={row}
          singleListing={singleListing}
          verifyContext={verifyContext}
        />
      </Modal>
    </>
  )
}
