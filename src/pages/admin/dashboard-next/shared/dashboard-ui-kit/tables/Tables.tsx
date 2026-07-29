import { useMemo, useState } from 'react'
import { Box, Typography } from '@mui/material'
import type { SxProps, Theme } from '@mui/material/styles'
import {
  DataTable,
  type Column,
  type TableState,
} from '@/design-system/UIComponents'
import { ScrollArea } from '../shadcn'
import { ExecutiveCard } from '../cards'
import { UI_KIT_SPACING } from '../tokens'
import { preferFullWidthTable } from '../utils'
import type { UiKitStateProps } from '../types'

const DEFAULT_TABLE_STATE: TableState = {
  page: 0,
  pageSize: 8,
  sortKey: null,
  sortDirection: 'asc',
  filters: [],
  searchQuery: '',
  columnSearch: {},
  selectedRows: [],
  expandedRows: [],
  hiddenColumnKeys: [],
}

export interface ExecutiveTableProps<T extends object> extends UiKitStateProps {
  title?: string
  subtitle?: string
  columns: Column<T>[]
  data: T[]
  rowKey: keyof T & string
  pageSize?: number
  onRowClick?: (row: T) => void
  actionLabel?: string
  onAction?: () => void
  /**
   * Force full-bleed width. Defaults to true when column count ≥ 6
   * so wide tables never sit inside narrow cards.
   */
  fullWidth?: boolean
  stickyHeader?: boolean
  sx?: SxProps<Theme>
}

export function ExecutiveTable<T extends object>({
  title,
  subtitle,
  columns,
  data,
  rowKey,
  pageSize = 8,
  onRowClick,
  actionLabel,
  onAction,
  fullWidth,
  stickyHeader = true,
  sx,
  ...state
}: ExecutiveTableProps<T>) {
  const [tableState, setTableState] = useState<TableState>({
    ...DEFAULT_TABLE_STATE,
    pageSize,
  })

  const useFullWidth = fullWidth ?? preferFullWidthTable(columns.length)
  const displayData = useMemo(() => data.slice(0, pageSize), [data, pageSize])

  const table = (
    <ScrollArea style={{ width: '100%' }}>
      <Box sx={{ width: '100%', minWidth: 0, overflowX: useFullWidth ? 'auto' : 'visible' }}>
        <DataTable
          columns={columns}
          data={displayData}
          rowKey={rowKey}
          state={tableState}
          onStateChange={setTableState}
          onRowClick={onRowClick}
          loading={state.loading}
          stickyHeader={stickyHeader}
          emptyState={{
            title: state.emptyTitle ?? 'No records found',
            description: state.emptyDescription ?? 'Adjust filters or check back later.',
          }}
        />
      </Box>
    </ScrollArea>
  )

  if (useFullWidth) {
    return (
      <Box
        sx={{
          width: '100%',
          gridColumn: '1 / -1',
          mb: UI_KIT_SPACING.section,
          ...((sx as object) ?? {}),
        }}
        role="region"
        aria-label={title ?? 'Data table'}
      >
        {(title || actionLabel) && (
          <Box sx={{ mb: UI_KIT_SPACING.cluster }}>
            {title ? (
              <Typography variant="subtitle1" fontWeight={700} sx={{ letterSpacing: -0.2 }}>
                {title}
              </Typography>
            ) : null}
            {subtitle ? (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.4 }}>
                {subtitle}
              </Typography>
            ) : null}
          </Box>
        )}
        <ExecutiveCard
          {...state}
          title={undefined}
          actionLabel={actionLabel}
          onAction={onAction}
          empty={state.empty ?? data.length === 0}
          sx={{ p: 0 }}
          density="compact"
        >
          {table}
        </ExecutiveCard>
      </Box>
    )
  }

  return (
    <ExecutiveCard
      {...state}
      title={title}
      subtitle={subtitle}
      actionLabel={actionLabel}
      onAction={onAction}
      empty={state.empty ?? data.length === 0}
      sx={sx}
    >
      {table}
    </ExecutiveCard>
  )
}

export function AnalyticsTable<T extends object>(props: ExecutiveTableProps<T>) {
  return <ExecutiveTable {...props} fullWidth={props.fullWidth ?? true} />
}

export function RankingTable<T extends object>(props: ExecutiveTableProps<T>) {
  return <ExecutiveTable {...props} pageSize={props.pageSize ?? 10} />
}

export function FinancialTable<T extends object>(props: ExecutiveTableProps<T>) {
  return <ExecutiveTable {...props} fullWidth={props.fullWidth ?? true} />
}

export function ExpandableTable<T extends object>(props: ExecutiveTableProps<T>) {
  return <ExecutiveTable {...props} />
}

export function StickyHeaderTable<T extends object>(props: ExecutiveTableProps<T>) {
  return <ExecutiveTable {...props} stickyHeader />
}
