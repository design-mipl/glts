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
  AgeingAnalysis,
  CollectionSummary,
  DashboardTable,
  QuickActions,
  StatusBadge,
  DASHBOARD_SPACING,
} from '../../shared'
import type { AccountsCollectionRow, AccountsDashboardTabProps } from '../types'

const ACTION_ICONS: Record<string, ReactNode> = {
  'qa-invoices': <FileText size={18} />,
  'qa-collections': <HandCoins size={18} />,
  'qa-vendor': <Wallet size={18} />,
  'qa-expenses': <CreditCard size={18} />,
  'qa-funds': <Landmark size={18} />,
  'qa-accounts-legacy': <LayoutDashboard size={18} />,
}

export function CollectionsTab({
  data,
  loading,
  onRetry,
  onNavigate,
  onOpenCollection,
}: AccountsDashboardTabProps) {
  const columns: Column<AccountsCollectionRow>[] = [
    { key: 'invoiceNumber', label: 'Invoice Number', widthSize: 'md', sortable: false },
    { key: 'client', label: 'Client', widthSize: 'lg', sortable: false },
    { key: 'branch', label: 'Branch', widthSize: 'md', sortable: false },
    { key: 'outstandingAmount', label: 'Outstanding Amount', widthSize: 'md', sortable: false },
    { key: 'dueDate', label: 'Due Date', widthSize: 'md', sortable: false },
    { key: 'ageBucket', label: 'Age Bucket', widthSize: 'sm', sortable: false },
    {
      key: 'status',
      label: 'Status',
      widthSize: 'sm',
      sortable: false,
      render: (_value, row) => <StatusBadge label={row.status} status={row.status} />,
    },
    { key: 'assignedExecutive', label: 'Assigned Executive', widthSize: 'md', sortable: false },
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
          onClick={() => onOpenCollection?.(row.id)}
        />
      ),
    },
  ]

  return (
    <Grid container spacing={DASHBOARD_SPACING.field}>
      <Grid size={{ xs: 12, md: 5 }}>
        <CollectionSummary
          data={data.collectionSummary}
          loading={loading}
          onRetry={onRetry}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 7 }}>
        <AgeingAnalysis buckets={data.ageingBuckets} loading={loading} onRetry={onRetry} />
      </Grid>

      <Grid size={{ xs: 12 }}>
        <DashboardTable
          title="Outstanding collections"
          subtitle="Search and open invoices to chase receivables"
          columns={columns}
          data={data.collectionRows}
          rowKey="id"
          loading={loading}
          pageSize={8}
          onRowClick={(row) => onOpenCollection?.(row.id)}
          onViewAll={() => onNavigate('/admin/finance/invoices')}
          actionLabel="Open invoices"
        />
      </Grid>

      <Grid size={{ xs: 12, md: 5 }}>
        <QuickActions
          columns={1}
          loading={loading}
          items={data.quickActions
            .filter((action) =>
              ['qa-invoices', 'qa-collections', 'qa-accounts-legacy'].includes(action.id),
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
