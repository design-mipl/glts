import { Box } from '@mui/material'
import type { ReactNode } from 'react'
import type { UploadQueueRow } from '../../data/applicationFlowData'
import type { ApplicationReviewOverview } from '../../utils/applicationReviewOverview'
import type { ApplicationDetailViewModel } from '../../types/applicationDetail.types'
import type { ApplicationProcessingTimelineStep } from '@/shared/types/applicationProcessingTimeline'
import type { VerifyTravelerListFilter } from '@/pages/admin/application-management/marine/utils/verifyDocumentsUtils'
import { ApplicationReviewPassengerList } from './ApplicationReviewPassengerList'
import { ApplicationReviewDetailPanel } from './ApplicationReviewDetailPanel'

interface ApplicationReviewPassengerWorkspaceProps {
  rows: UploadQueueRow[]
  filteredRows: UploadQueueRow[]
  overview: ApplicationReviewOverview
  singleListing: boolean
  selectedTravelerId: string | null
  onSelectTraveler: (id: string) => void
  selectedRow: UploadQueueRow | null
  search: string
  onSearchChange: (value: string) => void
  filter: VerifyTravelerListFilter
  onFilterChange: (value: VerifyTravelerListFilter) => void
  timelineSteps: ApplicationProcessingTimelineStep[]
  detail?: ApplicationDetailViewModel
  applicationId?: string
  documentsContent: ReactNode
}

export function ApplicationReviewPassengerWorkspace({
  rows,
  filteredRows,
  overview,
  singleListing,
  selectedTravelerId,
  onSelectTraveler,
  selectedRow,
  search,
  onSearchChange,
  filter,
  onFilterChange,
  timelineSteps,
  detail,
  applicationId,
  documentsContent,
}: ApplicationReviewPassengerWorkspaceProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        gap: 2,
        height: { xs: 'auto', md: 'calc(100vh - 260px)' },
        minHeight: { xs: 480, md: 520 },
        maxHeight: { md: 'calc(100vh - 260px)' },
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          width: { xs: '100%', md: '30%' },
          flexShrink: 0,
          minHeight: { xs: 300, md: 0 },
          maxHeight: { xs: 380, md: 'none' },
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
        }}
      >
        <ApplicationReviewPassengerList
          rows={rows}
          filteredRows={filteredRows}
          overview={overview}
          singleListing={singleListing}
          selectedTravelerId={selectedTravelerId}
          onSelectTraveler={onSelectTraveler}
          search={search}
          onSearchChange={onSearchChange}
          filter={filter}
          onFilterChange={onFilterChange}
        />
      </Box>

      <Box
        sx={{
          flex: 1,
          minWidth: 0,
          minHeight: { xs: 420, md: 0 },
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        <ApplicationReviewDetailPanel
          selectedRow={selectedRow}
          overview={overview}
          timelineSteps={timelineSteps}
          singleListing={singleListing}
          detail={detail}
          applicationId={applicationId}
          documentsContent={documentsContent}
        />
      </Box>
    </Box>
  )
}
