import { useMemo } from 'react'
import { Stack, Typography } from '@mui/material'
import { Badge, RowActions, type Column } from '@/design-system/UIComponents'
import { AccountsWorkListing } from '../components/AccountsWorkListing'
import type { AccountsDashboardTabProps, AccountsExpenseDailyRow } from '../types'

function statusColor(status: string): 'success' | 'warning' | 'error' | 'info' | 'neutral' {
  const s = status.toLowerCase()
  if (s.includes('match') || s.includes('log')) return 'success'
  if (s.includes('review') || s.includes('pending')) return 'warning'
  if (s.includes('due') || s.includes('un-invoiced')) return 'error'
  return 'info'
}

function getCellValue(row: AccountsExpenseDailyRow, key: string): string {
  const value = row[key as keyof AccountsExpenseDailyRow]
  return value == null ? '' : String(value)
}

/** Reconciliation desk — expense packs as AdminListingTable (ops Work pattern). */
export function ReconciliationTab({
  data,
  loading,
  onNavigate,
  onOpenTab,
}: AccountsDashboardTabProps) {
  const columns: Column<AccountsExpenseDailyRow>[] = useMemo(
    () => [
      {
        key: 'packLabel',
        label: 'Pack',
        widthSize: 'md',
        sortable: true,
        filterable: true,
        searchable: true,
      },
      {
        key: 'reference',
        label: 'Reference',
        widthSize: 'md',
        sortable: true,
        filterable: true,
        searchable: true,
      },
      {
        key: 'vendor',
        label: 'Vendor',
        widthSize: 'lg',
        sortable: true,
        filterable: true,
        searchable: true,
      },
      {
        key: 'detail',
        label: 'Detail',
        widthSize: 'lg',
        sortable: true,
        filterable: true,
        searchable: true,
      },
      {
        key: 'amount',
        label: 'Amount',
        widthSize: 'md',
        sortable: true,
        filterable: true,
      },
      {
        key: 'date',
        label: 'Date',
        widthSize: 'md',
        sortable: true,
        filterable: true,
      },
      {
        key: 'status',
        label: 'Status',
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
                label: 'Open expense',
                onClick: () => onNavigate('/admin/finance/expenses'),
              },
              {
                label: 'Open report',
                onClick: () => onOpenTab?.('reports'),
              },
              {
                label: 'Copy reference',
                onClick: () => {
                  void navigator.clipboard?.writeText(row.reference)
                },
              },
            ]}
          />
        ),
      },
    ],
    [onNavigate, onOpenTab],
  )

  return (
    <Stack spacing={1.5}>
      <Typography variant="caption" color="text.secondary" sx={{ fontSize: 12, px: 0.25 }}>
        Daily reconciliation from expense module — credit card, insurance, courier, ticketing, cash,
        invoiced / un-invoiced.
      </Typography>
      <AccountsWorkListing
        title="Daily expense packs"
        description="Payment mode · insurance · delivery · ticketing · cash"
        rows={data.expenseDailyRows}
        columns={columns}
        getCellValue={getCellValue}
        loading={loading}
        onOpen={() => onNavigate('/admin/finance/expenses')}
        onViewAll={() => onNavigate('/admin/finance/expenses')}
        viewAllLabel="Open expenses"
        emptyTitle="No expense packs today"
        emptyDescription="Expense lines with card, cash, courier, insurance, or ticketing will appear here."
      />
    </Stack>
  )
}
