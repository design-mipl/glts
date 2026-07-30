import { useEffect, useMemo, useState } from 'react'
import { Box, Stack, Typography } from '@mui/material'
import { Plus } from 'lucide-react'
import { BaseCard, Button, Tabs } from '@/design-system/UIComponents'
import type { UploadQueueRow } from '@/pages/customer/features/applications/data/applicationFlowData'
import type { ApplicationExpenseDetailView, ApplicationExpenseRecord } from '@/shared/types/applicationExpenseManagement'
import {
  computeFinanceKpis,
  filterExpensesForPassenger,
} from '@/shared/utils/applicationExpenseManagementUtils'
import { splitPassengerExpenses } from '../../utils/expenseRefundUtils'
import { ExpenseItemsTable, type ExpenseItemAction } from './ExpenseItemsTable'
import { ExpensePassengerOverview } from './ExpensePassengerOverview'
import { ExpensePassengerRefundTab } from './ExpensePassengerRefundTab'

type PassengerDetailTab = 'overview' | 'expenses' | 'refund'

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

  const { serviceExpenses, refundExpenses } = useMemo(
    () => splitPassengerExpenses(passengerExpenses),
    [passengerExpenses],
  )

  const serviceFinanceKpis = useMemo(() => computeFinanceKpis(serviceExpenses), [serviceExpenses])
  const refundFinanceKpis = useMemo(() => computeFinanceKpis(refundExpenses), [refundExpenses])

  const passengerTabs = useMemo(
    () => [
      { value: 'overview' as const, label: 'Overview and Documents' },
      {
        value: 'expenses' as const,
        label: 'Expenses',
        badge: serviceExpenses.length,
      },
      {
        value: 'refund' as const,
        label: 'Refund',
        badge: refundExpenses.length,
      },
    ],
    [serviceExpenses.length, refundExpenses.length],
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
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          spacing={1.5}
          sx={{ minWidth: 0 }}
        >
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Tabs
              value={activeTab}
              onChange={v => setActiveTab(v as PassengerDetailTab)}
              variant="underline"
              size="sm"
              items={passengerTabs}
            />
          </Box>
          {activeTab === 'expenses' ? (
            <Button
              label="Add expense"
              size="sm"
              startIcon={<Plus size={14} />}
              onClick={onAddExpense}
            />
          ) : null}
        </Stack>
      </Box>
      <Box
        sx={{
          flex: 1,
          height: 0,
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
        ) : null}
        {activeTab === 'expenses' ? (
          <ExpenseItemsTable
            title="Expenses"
            expenses={serviceExpenses}
            financeKpis={serviceFinanceKpis}
            onAddExpense={onAddExpense}
            onAction={onExpenseAction}
            hideMappingColumn
            embedded
            hideHeaderAddButton
            emptyDescription="Expenses sync from Application Management (tickets, insurance, GLTS fees), Assignment vendors, Fund Allocation, Ground Operations, and passenger payments."
          />
        ) : null}
        {activeTab === 'refund' ? (
          <ExpensePassengerRefundTab
            expenses={refundExpenses}
            financeKpis={refundFinanceKpis}
            onExpenseAction={onExpenseAction}
          />
        ) : null}
      </Box>
    </BaseCard>
  )
}
