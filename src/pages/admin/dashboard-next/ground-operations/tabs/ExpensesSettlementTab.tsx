import type { Column } from '@/design-system/UIComponents'
import { Button } from '@/design-system/UIComponents'
import type { ReactNode } from 'react'
import { Grid } from '@mui/material'
import {
  Briefcase,
  CreditCard,
  LayoutDashboard,
  MapPinned,
  Landmark,
  Wallet,
} from 'lucide-react'
import {
  DashboardTable,
  DASHBOARD_SPACING,
  ExpenseSummary,
  QuickActions,
  SettlementStatus,
  StatusBadge,
} from '../../shared'
import type { GroundFundCaseRow, GroundOperationsDashboardTabProps } from '../types'

const ACTION_ICONS: Record<string, ReactNode> = {
  'qa-desk': <Briefcase size={18} />,
  'qa-logistics': <MapPinned size={18} />,
  'qa-funds': <Wallet size={18} />,
  'qa-allocation': <Landmark size={18} />,
  'qa-expenses': <CreditCard size={18} />,
  'qa-apps': <LayoutDashboard size={18} />,
}

export function ExpensesSettlementTab({
  data,
  loading,
  onRetry,
  onNavigate,
  onOpenFundCase,
}: GroundOperationsDashboardTabProps) {
  const columns: Column<GroundFundCaseRow>[] = [
    { key: 'caseRef', label: 'Case', widthSize: 'md', sortable: false },
    { key: 'allocatedAmount', label: 'Allocated Amount', widthSize: 'md', sortable: false },
    { key: 'expensesIncurred', label: 'Expenses Incurred', widthSize: 'md', sortable: false },
    { key: 'availableBalance', label: 'Available Balance', widthSize: 'md', sortable: false },
    { key: 'settlementAmount', label: 'Settlement Amount', widthSize: 'md', sortable: false },
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
        <Button label="Open" variant="text" size="sm" onClick={() => onOpenFundCase?.(row.id)} />
      ),
    },
  ]

  return (
    <Grid container spacing={DASHBOARD_SPACING.field}>
      <Grid size={{ xs: 12, md: 6 }}>
        <ExpenseSummary data={data.expenseSummary} loading={loading} onRetry={onRetry} />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <SettlementStatus
          rows={data.settlementRows}
          loading={loading}
          onRetry={onRetry}
          onViewAll={() => onNavigate('/admin/ground-operations/funds')}
        />
      </Grid>

      <Grid size={{ xs: 12 }}>
        <DashboardTable
          title="Fund utilization & settlements"
          subtitle="Allocated · expenses · balance · pending · approved"
          columns={columns}
          data={data.fundCaseRows}
          rowKey="id"
          loading={loading}
          pageSize={8}
          onRowClick={(row) => onOpenFundCase?.(row.id)}
          onViewAll={() => onNavigate('/admin/ground-operations/funds')}
          actionLabel="Open funds"
        />
      </Grid>

      <Grid size={{ xs: 12, md: 5 }}>
        <QuickActions
          columns={1}
          loading={loading}
          items={data.quickActions
            .filter((action) =>
              ['qa-allocation', 'qa-expenses', 'qa-funds', 'qa-desk'].includes(action.id),
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
