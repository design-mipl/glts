import type { ReactNode } from 'react'
import type { Column } from '@/design-system/UIComponents'
import { Button } from '@/design-system/UIComponents'
import { Grid } from '@mui/material'
import {
  Building2,
  ClipboardList,
  HandCoins,
  LayoutDashboard,
  Users,
} from 'lucide-react'
import {
  BusinessSegmentBreakdown,
  CountryDistribution,
  DashboardTable,
  QuickActions,
  RecentActivity,
  StatusBadge,
  DASHBOARD_SPACING,
} from '../../shared'
import type { SuperAdminClientRow, SuperAdminDashboardTabProps } from '../types'

const ACTION_ICONS: Record<string, ReactNode> = {
  'qa-admin-next': <LayoutDashboard size={18} />,
  'qa-ops-next': <ClipboardList size={18} />,
  'qa-accounts-next': <HandCoins size={18} />,
  'qa-clients': <Users size={18} />,
  'qa-finance': <HandCoins size={18} />,
  'qa-legacy-admin': <Building2 size={18} />,
}

export function ClientsTab({
  data,
  loading,
  onRetry,
  onNavigate,
  onOpenClient,
}: SuperAdminDashboardTabProps) {
  const columns: Column<SuperAdminClientRow>[] = [
    { key: 'client', label: 'Client', widthSize: 'lg', sortable: false },
    { key: 'segment', label: 'Segment', widthSize: 'md', sortable: false },
    { key: 'applications', label: 'Applications', widthSize: 'sm', sortable: false },
    { key: 'revenue', label: 'Revenue', widthSize: 'md', sortable: false },
    { key: 'collections', label: 'Collections', widthSize: 'md', sortable: false },
    { key: 'outstanding', label: 'Outstanding', widthSize: 'md', sortable: false },
    {
      key: 'status',
      label: 'Status',
      widthSize: 'sm',
      sortable: false,
      render: (_value, row) => <StatusBadge label={row.status} status={row.status} />,
    },
    {
      key: 'actions',
      label: '',
      hideable: false,
      sortable: false,
      filterable: false,
      searchable: false,
      render: (_value, row) => (
        <Button label="Open" variant="text" size="sm" onClick={() => onOpenClient?.(row.id)} />
      ),
    },
  ]

  return (
    <Grid container spacing={DASHBOARD_SPACING.field}>
      <Grid size={{ xs: 12, md: 6 }}>
        <CountryDistribution
          title="Country demand"
          slices={data.countryDistribution}
          loading={loading}
          onRetry={onRetry}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <BusinessSegmentBreakdown
          title="Client segments"
          slices={data.businessSegments}
          loading={loading}
          onRetry={onRetry}
        />
      </Grid>

      <Grid size={{ xs: 12 }}>
        <DashboardTable
          title="Top clients"
          subtitle="Corporate · marine · retail contributors"
          columns={columns}
          data={data.clientRows}
          rowKey="id"
          loading={loading}
          pageSize={8}
          onRowClick={(row) => onOpenClient?.(row.id)}
          onViewAll={() => onNavigate('/admin/customer-accounts/corporate-accounts')}
          actionLabel="Open clients"
        />
      </Grid>

      <Grid size={{ xs: 12, md: 7 }}>
        <RecentActivity
          title="Client activity"
          items={data.clientActivity}
          loading={loading}
          onRetry={onRetry}
          maxItems={6}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 5 }}>
        <QuickActions
          columns={1}
          loading={loading}
          items={data.quickActions
            .filter((action) =>
              ['qa-clients', 'qa-accounts-next', 'qa-admin-next'].includes(action.id),
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
