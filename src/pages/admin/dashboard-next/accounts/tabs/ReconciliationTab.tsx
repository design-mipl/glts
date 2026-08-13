import { useMemo, useState } from 'react'
import { Box, Stack } from '@mui/material'
import { Badge, RowActions, Tabs, type Column } from '@/design-system/UIComponents'
import { AccountsWorkListing } from '../components/AccountsWorkListing'
import type {
  AccountsDashboardTabProps,
  AccountsExpenseDailyRow,
  AccountsExpenseRefundRow,
} from '../types'

type ExpenseDeskTab = 'packs' | 'refunds'

function statusColor(status: string): 'success' | 'warning' | 'error' | 'info' | 'neutral' {
  const s = status.toLowerCase()
  if (s.includes('match') || s.includes('log') || s.includes('process') || s.includes('approved')) {
    return 'success'
  }
  if (s.includes('review') || s.includes('pending')) return 'warning'
  if (s.includes('due') || s.includes('un-invoiced')) return 'error'
  return 'info'
}

function getPackCell(row: AccountsExpenseDailyRow, key: string): string {
  const value = row[key as keyof AccountsExpenseDailyRow]
  if (typeof value === 'boolean') return value ? 'Yes' : 'No'
  return value == null ? '' : String(value)
}

function getRefundCell(row: AccountsExpenseRefundRow, key: string): string {
  const value = row[key as keyof AccountsExpenseRefundRow]
  return value == null ? '' : String(value)
}

/** Expenses desk — daily packs by payment mode + refunds (expense module). */
export function ExpensesDeskTab({
  data,
  loading,
  onNavigate,
}: AccountsDashboardTabProps) {
  const [deskTab, setDeskTab] = useState<ExpenseDeskTab>('packs')

  const packColumns: Column<AccountsExpenseDailyRow>[] = useMemo(
    () => [
      {
        key: 'applicationId',
        label: 'Application ID',
        widthSize: 'md',
        sortable: true,
        filterable: true,
        searchable: true,
      },
      {
        key: 'packLabel',
        label: 'Service',
        widthSize: 'md',
        sortable: true,
        filterable: true,
        searchable: true,
      },
      {
        key: 'detail',
        label: 'Mapping',
        widthSize: 'lg',
        sortable: true,
        filterable: true,
        searchable: true,
      },
      {
        key: 'amount',
        label: 'Total Expense',
        widthSize: 'md',
        sortable: true,
        filterable: true,
      },
      {
        key: 'vendor',
        label: 'Paid by',
        widthSize: 'lg',
        sortable: true,
        filterable: true,
        searchable: true,
      },
      {
        key: 'paymentMode',
        label: 'Mode',
        widthSize: 'md',
        sortable: true,
        filterable: true,
        searchable: true,
      },
      {
        key: 'reference',
        label: 'Invoice',
        widthSize: 'md',
        sortable: true,
        filterable: true,
        searchable: true,
      },
      {
        key: 'status',
        label: 'Payment Status',
        widthSize: 'sm',
        sortable: true,
        filterable: true,
        render: (_value, row) => <Badge label={row.status} color={statusColor(row.status)} />,
      },
      {
        key: 'actions',
        label: '',
        hideable: false,
        sortable: false,
        filterable: false,
        searchable: false,
        width: 56,
        render: (_value, row) => (
          <RowActions
            actions={[
              {
                label: 'View Details',
                onClick: () =>
                  onNavigate(`/admin/finance/expenses?application=${row.applicationId}`),
              },
              {
                label: 'Add Expense',
                onClick: () =>
                  onNavigate(`/admin/finance/expenses?application=${row.applicationId}`),
              },
              {
                label: 'Open expenses listing',
                onClick: () => onNavigate('/admin/finance/expenses'),
              },
            ]}
          />
        ),
      },
    ],
    [onNavigate],
  )

  const refundColumns: Column<AccountsExpenseRefundRow>[] = useMemo(
    () => [
      {
        key: 'applicationId',
        label: 'Application ID',
        widthSize: 'md',
        sortable: true,
        filterable: true,
        searchable: true,
      },
      {
        key: 'passenger',
        label: 'Passenger',
        widthSize: 'md',
        sortable: true,
        filterable: true,
        searchable: true,
      },
      {
        key: 'expenseType',
        label: 'Service',
        widthSize: 'md',
        sortable: true,
        filterable: true,
      },
      {
        key: 'refundAmount',
        label: 'Total Expense',
        widthSize: 'md',
        sortable: true,
        filterable: true,
      },
      {
        key: 'paymentMode',
        label: 'Mode',
        widthSize: 'md',
        sortable: true,
        filterable: true,
      },
      {
        key: 'status',
        label: 'Payment Status',
        widthSize: 'sm',
        sortable: true,
        filterable: true,
        render: (_value, row) => <Badge label={row.status} color={statusColor(row.status)} />,
      },
      {
        key: 'requestedDate',
        label: 'Submission Date',
        widthSize: 'md',
        sortable: true,
        filterable: true,
      },
      {
        key: 'actions',
        label: '',
        hideable: false,
        sortable: false,
        filterable: false,
        searchable: false,
        width: 56,
        render: (_value, row) => (
          <RowActions
            actions={[
              {
                label: 'View Details',
                onClick: () =>
                  onNavigate(`/admin/finance/expenses?application=${row.applicationId}&tab=refund`),
              },
            ]}
          />
        ),
      },
    ],
    [onNavigate],
  )

  return (
    <Stack spacing={1.5}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={deskTab}
          onChange={(value) => setDeskTab(value as ExpenseDeskTab)}
          variant="underline"
          size="sm"
          items={[
            { value: 'packs', label: `Daily packs (${data.expenseDailyRows.length})` },
            { value: 'refunds', label: `Refunds (${data.expenseRefundRows.length})` },
          ]}
        />
      </Box>

      {deskTab === 'packs' ? (
        <AccountsWorkListing
          title="Daily expense packs"
          description="Card · insurance · courier · ticketing · cash · invoiced/un-invoiced"
          rows={data.expenseDailyRows}
          columns={packColumns}
          getCellValue={getPackCell}
          loading={loading}
          onOpen={(row) => onNavigate(`/admin/finance/expenses?application=${row.applicationId}`)}
          onViewAll={() => onNavigate('/admin/finance/expenses')}
          viewAllLabel="Open expenses"
          searchPlaceholder="Search application ID, service, paid by…"
          exportFileName="expense-daily-packs"
          emptyTitle="No expense packs today"
          emptyDescription="Expense lines will appear here by payment mode and service type."
        />
      ) : (
        <AccountsWorkListing
          title="Expense refunds"
          description="Passenger / service refunds from the expense module"
          rows={data.expenseRefundRows}
          columns={refundColumns}
          getCellValue={getRefundCell}
          loading={loading}
          onOpen={(row) =>
            onNavigate(`/admin/finance/expenses?application=${row.applicationId}&tab=refund`)
          }
          onViewAll={() => onNavigate('/admin/finance/expenses')}
          viewAllLabel="Open expenses"
          searchPlaceholder="Search application, passenger, refund…"
          exportFileName="expense-refunds"
          emptyTitle="No refunds"
          emptyDescription="Expense refunds will appear here for finance action."
        />
      )}
    </Stack>
  )
}

/** @deprecated Use ExpensesDeskTab */
export const ReconciliationTab = ExpensesDeskTab
