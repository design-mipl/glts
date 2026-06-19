import { Box } from '@mui/material'
import type { UploadQueueRow } from '@/pages/customer/features/applications/data/applicationFlowData'
import type { ApplicationReviewOverview } from '@/pages/customer/features/applications/utils/applicationReviewOverview'
import type { ApplicationDetailViewModel } from '@/pages/customer/features/applications/types/applicationDetail.types'
import type { VerifyOverviewData } from '@/pages/admin/application-management/marine/utils/verifyDocumentsUtils'
import type {
  ApplicationExpenseRecord,
} from '@/shared/types/applicationExpenseManagement'
import type { ExpenseItemAction } from './ExpenseItemsTable'
import { ExpenseTravelerCardList } from './ExpenseTravelerCardList'
import { ExpenseTravelerDetailPanel } from './ExpenseTravelerDetailPanel'

interface ExpensePassengerWorkspaceProps {
  applicationId: string
  applicationDetail: ApplicationDetailViewModel
  rows: UploadQueueRow[]
  overview: VerifyOverviewData
  summaryOverview: ApplicationReviewOverview
  singleListing: boolean
  selectedTravelerId: string | null
  onSelectTraveler: (id: string) => void
  selectedRow: UploadQueueRow | null
  expenseByPassengerId: Map<string, number>
  rankByPassengerId: Map<string, string>
  allExpenses: ApplicationExpenseRecord[]
  onAddExpense: () => void
  onExpenseAction: (action: ExpenseItemAction, expense: ApplicationExpenseRecord) => void
}

export function ExpensePassengerWorkspace({
  applicationId,
  applicationDetail,
  rows,
  overview,
  summaryOverview,
  singleListing,
  selectedTravelerId,
  onSelectTraveler,
  selectedRow,
  expenseByPassengerId,
  rankByPassengerId,
  allExpenses,
  onAddExpense,
  onExpenseAction,
}: ExpensePassengerWorkspaceProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        gap: 2,
        height: { xs: 'auto', md: 'calc(100vh - 200px)' },
        minHeight: { xs: 480, md: 620 },
        maxHeight: { md: 'calc(100vh - 200px)' },
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          width: { xs: '100%', md: '34%' },
          flexShrink: 0,
          minHeight: { xs: 360, md: 0 },
          maxHeight: { xs: 420, md: 'none' },
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
        }}
      >
        <ExpenseTravelerCardList
          rows={rows}
          overview={overview}
          singleListing={singleListing}
          selectedTravelerId={selectedTravelerId}
          onSelectTraveler={onSelectTraveler}
          expenseByPassengerId={expenseByPassengerId}
          rankByPassengerId={rankByPassengerId}
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
        <ExpenseTravelerDetailPanel
          applicationId={applicationId}
          applicationDetail={applicationDetail}
          selectedRow={selectedRow}
          summaryOverview={summaryOverview}
          singleListing={singleListing}
          allExpenses={allExpenses}
          onAddExpense={onAddExpense}
          onExpenseAction={onExpenseAction}
        />
      </Box>
    </Box>
  )
}
