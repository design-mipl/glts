import type { ReactNode } from 'react'
import type { Column } from '@/design-system/UIComponents'
import { Button } from '@/design-system/UIComponents'
import { Grid } from '@mui/material'
import {
  CreditCard,
  FileText,
  HandCoins,
  Landmark,
  LayoutDashboard,
  Wallet,
} from 'lucide-react'
import {
  CollectionSummary,
  DashboardTable,
  QuickActions,
  RecentActivity,
  StatusBadge,
  DASHBOARD_SPACING,
} from '../../shared'
import type { AccountsDashboardTabProps, AccountsReconciliationRow } from '../types'

const ACTION_ICONS: Record<string, ReactNode> = {
  'qa-invoices': <FileText size={18} />,
  'qa-collections': <HandCoins size={18} />,
  'qa-vendor': <Wallet size={18} />,
  'qa-expenses': <CreditCard size={18} />,
  'qa-funds': <Landmark size={18} />,
  'qa-accounts-legacy': <LayoutDashboard size={18} />,
}

export function ReconciliationTab({
  data,
  loading,
  onRetry,
  onNavigate,
  onOpenReconciliation,
}: AccountsDashboardTabProps) {
  const columns: Column<AccountsReconciliationRow>[] = [
    { key: 'reference', label: 'Reference', widthSize: 'md', sortable: false },
    { key: 'vendor', label: 'Vendor', widthSize: 'lg', sortable: false },
    { key: 'category', label: 'Category', widthSize: 'lg', sortable: false },
    { key: 'amount', label: 'Amount', widthSize: 'md', sortable: false },
    {
      key: 'status',
      label: 'Status',
      widthSize: 'sm',
      sortable: false,
      render: (_value, row) => <StatusBadge label={row.status} status={row.status} />,
    },
    { key: 'dueDate', label: 'Due Date', widthSize: 'md', sortable: false },
    { key: 'assignedTo', label: 'Assigned To', widthSize: 'md', sortable: false },
    {
      key: 'actions',
      label: '',
      hideable: false,
      sortable: false,
      filterable: false,
      searchable: false,
      render: (_value, row) => (
        <Button
          label="Open"
          variant="text"
          size="sm"
          onClick={() => onOpenReconciliation?.(row.id)}
        />
      ),
    },
  ]

  return (
    <Grid container spacing={DASHBOARD_SPACING.field}>
      <Grid size={{ xs: 12, md: 5 }}>
        <CollectionSummary
          title="Reconciliation workload"
          subtitle="Vendor · cards · insurance · courier · ticketing · application payments"
          data={data.reconciliationSummary}
          loading={loading}
          onRetry={onRetry}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 7 }}>
        <RecentActivity
          title="Reconciliation activity"
          items={data.reconciliationActivity}
          loading={loading}
          onRetry={onRetry}
          maxItems={6}
        />
      </Grid>

      <Grid size={{ xs: 12 }}>
        <DashboardTable
          title="Reconciliation queue"
          subtitle="Actionable payables and spend matches"
          columns={columns}
          data={data.reconciliationRows}
          rowKey="id"
          loading={loading}
          pageSize={8}
          onRowClick={(row) => onOpenReconciliation?.(row.id)}
          onViewAll={() => onNavigate('/admin/finance/vendor-billing')}
          actionLabel="Open vendor billing"
        />
      </Grid>

      <Grid size={{ xs: 12, md: 5 }}>
        <QuickActions
          columns={1}
          loading={loading}
          items={data.quickActions
            .filter((action) =>
              ['qa-vendor', 'qa-expenses', 'qa-funds'].includes(action.id),
            )
            .map((action) => ({
              id: action.id,
              title: action.title,
              description: action.description,
              badge: action.badge,
              icon: ACTION_ICONS[action.id],
              onClick: () => onNavigate(action.href),
            }))}
        />
      </Grid>
    </Grid>
  )
}
