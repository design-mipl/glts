import { useEffect, useMemo, useState } from 'react'
import { Box, Typography } from '@mui/material'
import { BaseCard, Tabs } from '@/design-system/UIComponents'
import type { UploadQueueRow } from '@/pages/customer/features/applications/data/applicationFlowData'
import type { ApplicationExpenseDetailView, ApplicationExpenseRecord } from '@/shared/types/applicationExpenseManagement'
import {
  computeFinanceKpis,
  filterExpensesForPassenger,
} from '@/shared/utils/applicationExpenseManagementUtils'
import { ExpenseItemsTable, type ExpenseItemAction } from './ExpenseItemsTable'
import { ExpensePassengerOverview } from './ExpensePassengerOverview'

type PassengerDetailTab = 'overview' | 'expenses'

interface ExpenseTravelerDetailPanelProps {
  applicationId: string
  selectedRow: UploadQueueRow | null
  expenseDetail: ApplicationExpenseDetailView
  allExpenses: ApplicationExpenseRecord[]
  onAddExpense: () => void
  onExpenseAction: (action: ExpenseItemAction, expense: ApplicationExpenseRecord) => void
}

export function ExpenseTravelerDetailPanel({
  applicationId,
  selectedRow,
  expenseDetail,
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
      { value: 'overview' as const, label: 'Overview and Documents' },
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
          <ExpensePassengerOverview
            applicationId={applicationId}
            selectedRow={selectedRow}
            expenseDetail={expenseDetail}
          />
        ) : (
          <ExpenseItemsTable
            title="Expenses"
            expenses={passengerExpenses}
            financeKpis={passengerFinanceKpis}
            onAddExpense={onAddExpense}
            onAction={onExpenseAction}
            hideMappingColumn
            embedded
            emptyDescription="Expenses sync from Application Management (tickets, insurance, GLTS fees), Assignment vendors, Fund Allocation, Ground Operations, and passenger payments."
          />
        )}
      </Box>
    </BaseCard>
  )
}
