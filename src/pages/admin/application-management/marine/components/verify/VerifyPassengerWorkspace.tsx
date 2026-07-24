import { Box } from '@mui/material'
import type { ReactNode } from 'react'
import type { UploadQueueRow } from '@/pages/customer/features/applications/data/applicationFlowData'
import type { VerifyOverviewData } from '../../utils/verifyDocumentsUtils'
import { VerifyTravelerList } from './VerifyTravelerList'
import { VerifyTravelerDetailPanel } from './VerifyTravelerDetailPanel'
import type { VerifyTravelerListFilter } from '../../utils/verifyDocumentsUtils'
import type { ApplicationProcessingTimelineStep } from '@/shared/types/applicationProcessingTimeline'

interface VerifyPassengerWorkspaceProps {
  rows: UploadQueueRow[]
  filteredRows: UploadQueueRow[]
  overview: VerifyOverviewData
  singleListing: boolean
  selectedTravelerId: string | null
  onSelectTraveler: (id: string) => void
  selectedRow: UploadQueueRow | null
  search: string
  onSearchChange: (value: string) => void
  filter: VerifyTravelerListFilter
  onFilterChange: (value: VerifyTravelerListFilter) => void
  timelineSteps: ApplicationProcessingTimelineStep[]
  multiTraveler: boolean
  detailContent: ReactNode
}

export function VerifyPassengerWorkspace({
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
  multiTraveler,
  detailContent,
}: VerifyPassengerWorkspaceProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        gap: 2,
        height: { xs: 'auto', md: 'calc(100vh - 280px)' },
        minHeight: { xs: 480, md: 560 },
        maxHeight: { md: 'calc(100vh - 280px)' },
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          width: { xs: '100%', md: '30%' },
          flexShrink: 0,
          minHeight: { xs: 320, md: 0 },
          maxHeight: { xs: 400, md: 'none' },
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
        }}
      >
        <VerifyTravelerList
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
          minHeight: { xs: 480, md: 0 },
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        <VerifyTravelerDetailPanel
          selectedRow={selectedRow}
          timelineSteps={timelineSteps}
          multiTraveler={multiTraveler}
        >
          {detailContent}
        </VerifyTravelerDetailPanel>
      </Box>
    </Box>
  )
}
