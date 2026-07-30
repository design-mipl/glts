import { Stack, Typography } from '@mui/material'
import type { ApplicationExpenseFinanceKpis, ApplicationExpenseRecord } from '@/shared/types/applicationExpenseManagement'
import { formatInr } from '@/shared/utils/invoiceCalculations'
import { ExpenseItemsTable, type ExpenseItemAction } from './ExpenseItemsTable'

interface ExpensePassengerRefundTabProps {
  expenses: ApplicationExpenseRecord[]
  financeKpis: ApplicationExpenseFinanceKpis
  onExpenseAction: (action: ExpenseItemAction, expense: ApplicationExpenseRecord) => void
}

export function ExpensePassengerRefundTab({
  expenses,
  financeKpis,
  onExpenseAction,
}: ExpensePassengerRefundTabProps) {
  return (
    <Stack spacing={1.5}>
      <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13 }}>
        Consulate refunds recorded by ground staff in Tracking & Logistics for this passenger.
      </Typography>
      <ExpenseItemsTable
        title="Refunds"
        expenses={expenses}
        financeKpis={financeKpis}
        onAddExpense={() => undefined}
        onAction={onExpenseAction}
        hideMappingColumn
        embedded
        hideHeaderAddButton
        emptyDescription="No consulate refunds recorded for this passenger yet. Refunds saved in Ground Operations → Tracking & Logistics appear here automatically."
      />
      {expenses.length > 0 ? (
        <Stack direction="row" justifyContent="flex-end">
          <Typography variant="body2" fontWeight={700} sx={{ fontSize: 13 }}>
            Refund total · {formatInr(financeKpis.totalExpense)}
          </Typography>
        </Stack>
      ) : null}
    </Stack>
  )
}
