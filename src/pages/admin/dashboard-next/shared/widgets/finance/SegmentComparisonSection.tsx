import type { ReactNode } from 'react'
import { Stack, Typography } from '@mui/material'
import { type Column } from '@/design-system/UIComponents'
import { ExecutiveSectionHeader } from '@/pages/admin/dashboard/components'
import { DASHBOARD_SPACING } from '../../constants'
import { ExecutiveTable } from '../../dashboard-ui-kit'
import type { DashboardSegmentComparisonRow } from '../../types'

const SEGMENT_COMPARISON_COLUMNS: Column<DashboardSegmentComparisonRow>[] = [
  {
    key: 'label',
    label: 'Segment',
    widthSize: 'md',
    sortable: false,
    filterable: false,
    searchable: false,
    hideable: false,
    render: (_value, row) => (
      <Typography variant="body2" fontWeight={700}>
        {row.label}
      </Typography>
    ),
  },
  {
    key: 'revenue',
    label: 'Gross revenue',
    widthSize: 'md',
    sortable: false,
    filterable: false,
    searchable: false,
  },
  {
    key: 'netRevenue',
    label: 'Net revenue',
    widthSize: 'md',
    sortable: false,
    filterable: false,
    searchable: false,
  },
  {
    key: 'grossMarginPercent',
    label: 'Gross margin',
    widthSize: 'sm',
    sortable: false,
    filterable: false,
    searchable: false,
  },
  {
    key: 'activeApplications',
    label: 'Active apps',
    widthSize: 'sm',
    sortable: false,
    filterable: false,
    searchable: false,
  },
  {
    key: 'approvalPercent',
    label: 'Approval',
    widthSize: 'sm',
    sortable: false,
    filterable: false,
    searchable: false,
  },
  {
    key: 'growthLabel',
    label: 'Growth',
    widthSize: 'sm',
    sortable: false,
    filterable: false,
    searchable: false,
    render: (_value, row) => (
      <Typography
        variant="body2"
        fontWeight={700}
        sx={{
          fontSize: 13,
          color: row.growthPercent >= 0 ? 'success.main' : 'error.main',
        }}
      >
        {row.growthLabel}
      </Typography>
    ),
  },
]

export interface SegmentComparisonSectionProps {
  title?: string
  description?: string
  rows: DashboardSegmentComparisonRow[]
  loading?: boolean
  action?: ReactNode
  onRowClick?: (row: DashboardSegmentComparisonRow) => void
  emptyMessage?: string
}

/** Segment commercial comparison — gross/net revenue, margin, apps, approval, growth. */
export function SegmentComparisonSection({
  title = 'Segment comparison',
  description = 'Gross = invoiced · Net = profit · Approval = embassy approved',
  rows,
  loading,
  action,
  onRowClick,
  emptyMessage = 'No segment comparison data for the selected filters.',
}: SegmentComparisonSectionProps) {
  const empty = !loading && rows.length === 0

  return (
    <Stack spacing={DASHBOARD_SPACING.field} component="section" aria-label={title}>
      <ExecutiveSectionHeader title={title} description={description} count={rows.length} action={action} />
      {empty ? (
        <Typography variant="body2" color="text.secondary">
          {emptyMessage}
        </Typography>
      ) : (
        <ExecutiveTable
          columns={SEGMENT_COMPARISON_COLUMNS}
          data={rows}
          rowKey="id"
          pageSize={4}
          loading={loading}
          fullWidth
          hideToolbar
          hidePagination
          showColumnSearch={false}
          enableColumnSort={false}
          onRowClick={onRowClick}
        />
      )}
    </Stack>
  )
}
