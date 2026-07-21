import type { Column } from '@/design-system/UIComponents'
import { Button } from '@/design-system/UIComponents'
import { Grid } from '@mui/material'
import {
  DashboardTable,
  NotificationPanel,
  QuickStats,
  RecentActivity,
  StatusBadge,
  DASHBOARD_SPACING,
} from '../../shared'
import type { AccountsDashboardTabProps, AccountsInvoiceRow } from '../types'

export function InvoicingTab({
  data,
  loading,
  onRetry,
  onNavigate,
  onOpenInvoice,
}: AccountsDashboardTabProps) {
  const columns: Column<AccountsInvoiceRow>[] = [
    { key: 'invoiceNumber', label: 'Invoice Number', widthSize: 'md', sortable: false },
    { key: 'client', label: 'Client', widthSize: 'lg', sortable: false },
    { key: 'application', label: 'Application', widthSize: 'md', sortable: false },
    { key: 'invoiceDate', label: 'Invoice Date', widthSize: 'md', sortable: false },
    { key: 'amount', label: 'Amount', widthSize: 'md', sortable: false },
    {
      key: 'status',
      label: 'Status',
      widthSize: 'sm',
      sortable: false,
      render: (_value, row) => <StatusBadge label={row.status} status={row.status} />,
    },
    {
      key: 'approval',
      label: 'Approval',
      widthSize: 'md',
      sortable: false,
      render: (_value, row) => <StatusBadge label={row.approval} status={row.approval} />,
    },
    {
      key: 'actions',
      label: '',
      hideable: false,
      sortable: false,
      filterable: false,
      searchable: false,
      render: (_value, row) => (
        <Button label="Open" variant="text" size="sm" onClick={() => onOpenInvoice?.(row.id)} />
      ),
    },
  ]

  return (
    <Grid container spacing={DASHBOARD_SPACING.field}>
      <Grid size={{ xs: 12 }}>
        <QuickStats
          title="Invoice pipeline"
          items={data.invoiceStats}
          loading={loading}
          onRetry={onRetry}
          columns={4}
        />
      </Grid>

      <Grid size={{ xs: 12 }}>
        <DashboardTable
          title="Invoices"
          subtitle="Pending · approved · posted · awaiting approval"
          columns={columns}
          data={data.invoiceRows}
          rowKey="id"
          loading={loading}
          pageSize={8}
          onRowClick={(row) => onOpenInvoice?.(row.id)}
          onViewAll={() => onNavigate('/admin/finance/invoices')}
          actionLabel="Open invoices"
        />
      </Grid>

      <Grid size={{ xs: 12, md: 7 }}>
        <RecentActivity
          title="Invoicing activity"
          items={data.invoiceActivity}
          loading={loading}
          onRetry={onRetry}
          maxItems={6}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 5 }}>
        <NotificationPanel
          title="Invoice notices"
          items={data.invoiceNotifications}
          loading={loading}
          onRetry={onRetry}
          maxItems={5}
        />
      </Grid>
    </Grid>
  )
}
