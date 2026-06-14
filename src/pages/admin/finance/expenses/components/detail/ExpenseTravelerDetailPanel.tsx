import { useEffect, useMemo, useState } from 'react'
import { Box, Stack, Typography } from '@mui/material'
import { BaseCard, Tabs } from '@/design-system/UIComponents'
import { ViewFormDocumentVault } from '@/pages/admin/application-management/marine/components/view-form/ViewFormDocumentVault'
import { ApplicationSummaryContent } from '@/pages/customer/features/applications/components/ApplicationSummaryContent'
import type { UploadQueueRow } from '@/pages/customer/features/applications/data/applicationFlowData'
import type { ApplicationReviewOverview } from '@/pages/customer/features/applications/utils/applicationReviewOverview'
import type { ApplicationDetailViewModel } from '@/pages/customer/features/applications/types/applicationDetail.types'
import type { ApplicationExpenseRecord } from '@/shared/types/applicationExpenseManagement'
import {
  computeFinanceKpis,
  filterExpensesForPassenger,
} from '@/shared/utils/applicationExpenseManagementUtils'
import { ExpenseItemsTable, type ExpenseItemAction } from './ExpenseItemsTable'

type PassengerDetailTab = 'overview' | 'expenses'

interface ExpenseTravelerDetailPanelProps {
  applicationId: string
  applicationDetail: ApplicationDetailViewModel
  selectedRow: UploadQueueRow | null
  summaryOverview: ApplicationReviewOverview
  singleListing: boolean
  allExpenses: ApplicationExpenseRecord[]
  onAddExpense: () => void
  onExpenseAction: (action: ExpenseItemAction, expense: ApplicationExpenseRecord) => void
}

export function ExpenseTravelerDetailPanel({
  applicationId,
  applicationDetail,
  selectedRow,
  summaryOverview,
  singleListing,
  allExpenses,
  onAddExpense,
  onExpenseAction,
}: ExpenseTravelerDetailPanelProps) {
  const [activeTab, setActiveTab] = useState<PassengerDetailTab>('overview')

  useEffect(() => {
    setActiveTab('overview')
  }, [selectedRow?.id])

  const passengerExpenses = useMemo(() => {
    if (!selectedRow) return []
    return filterExpensesForPassenger(allExpenses, selectedRow.gltsApplicantId)
  }, [allExpenses, selectedRow])

  const passengerFinanceKpis = useMemo(
    () => computeFinanceKpis(passengerExpenses),
    [passengerExpenses],
  )

  const passengerTabs = useMemo(
    () => [
      { value: 'overview' as const, label: 'Overview + Documents' },
      {
        value: 'expenses' as const,
        label: 'Expenses',
        badge: passengerExpenses.length,
      },
    ],
    [passengerExpenses.length],
  )

  if (!selectedRow) {
    return (
      <BaseCard
        sx={{
          p: 2.5,
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 280,
        }}
      >
        <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13, textAlign: 'center' }}>
          Select a traveler to view overview, documents, and expenses for that passenger.
        </Typography>
      </BaseCard>
    )
  }

  return (
    <BaseCard
      sx={{
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        minHeight: 0,
        height: '100%',
        overflow: 'hidden',
      }}
    >
      <Box sx={{ px: 2.5, pt: 1.5, borderBottom: 1, borderColor: 'divider', flexShrink: 0 }}>
        <Tabs
          value={activeTab}
          onChange={v => setActiveTab(v as PassengerDetailTab)}
          items={passengerTabs}
        />
      </Box>
      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          overflowY: 'auto',
          p: 2.5,
        }}
      >
        {activeTab === 'overview' ? (
          <Stack spacing={2}>
            <Box>
              <Typography sx={{ fontWeight: 700, fontSize: 13, mb: 1.5 }}>
                Passenger overview
              </Typography>
              <ApplicationSummaryContent
                overview={summaryOverview}
                row={selectedRow}
                singleListing={singleListing}
                verifyContext={{ detail: applicationDetail, applicationId }}
              />
            </Box>

            <ViewFormDocumentVault
              applicationId={applicationId}
              selectedRow={selectedRow}
              detail={applicationDetail}
              defaultExpanded
            />
          </Stack>
        ) : (
          <ExpenseItemsTable
            title="Expenses"
            expenses={passengerExpenses}
            financeKpis={passengerFinanceKpis}
            onAddExpense={onAddExpense}
            onAction={onExpenseAction}
            hideMappingColumn
            embedded
            emptyDescription="No expenses mapped to this passenger yet."
          />
        )}
      </Box>
    </BaseCard>
  )
}
