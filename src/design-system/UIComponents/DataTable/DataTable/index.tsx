import { useState, Fragment, useMemo } from 'react'
import {
  Box, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Checkbox, IconButton, Skeleton,
  Card, CardContent, Typography, useTheme, useMediaQuery, Divider,
} from '@mui/material'
import { alpha, type Theme } from '@mui/material/styles'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { BORDER_RADIUS, BORDER_WIDTH, SHADOWS } from '../../../tokens'
import type { FoundationBreakpointKey } from '../../../breakpoints'
import type { Column, TableState, BulkAction } from '../types'
import {
  CHECKBOX_COLUMN_WIDTH,
  EXPAND_COLUMN_WIDTH,
  getDataTableColWidth,
  getDataTableColumnWidthSx,
  getDataTableLayoutWidth,
} from '../columnLayout'
import ColumnHeader from '../ColumnHeader'
import EmptyState from '../EmptyState'
import ExpandedRow from '../ExpandedRow'
import InlineEdit from '../InlineEdit'
import TableToolbar from '../TableToolbar'
import Pagination from '../Pagination'

export interface DataTableProps {
  columns: Column[]
  data: any[]
  rowKey: string
  loading?: boolean
  total?: number
  state: TableState
  onStateChange: (state: TableState) => void
  onRowClick?: (row: any) => void
  onCellEdit?: (rowId: string, columnKey: string, value: any) => void
  renderExpanded?: (row: any) => React.ReactNode
  bulkActions?: BulkAction[]
  emptyState?: {
    title: string
    description?: string
    action?: { label: string; onClick: () => void }
  }
  stickyHeader?: boolean
  height?: string | number
  title?: string
  actions?: React.ReactNode
  /** When false, toolbar column picker is hidden. Default: show when at least two hideable columns exist. */
  showColumnPicker?: boolean
  /** Hide toolbar (use external toolbar in parent card). */
  hideToolbar?: boolean
  /** Hide built-in pagination (parent renders pagination). */
  hidePagination?: boolean
  /** Flat table inside parent card — no outer border/shadow on table container. */
  embedded?: boolean
  /** Show per-column search inputs in headers. Default true. */
  showColumnSearch?: boolean
  /** Excel-style column filter popup trigger per header. */
  onColumnFilterClick?: (event: React.MouseEvent<HTMLElement>, columnKey: string) => void
  /** When false, column header sort controls are hidden. Default true. */
  enableColumnSort?: boolean
}

function getHideDisplay(hideBelow?: FoundationBreakpointKey) {
  if (!hideBelow) return undefined
  return { xs: 'none', [hideBelow]: 'table-cell' }
}

function isStickyEndColumn(col: Column) {
  if (col.stickyEnd === false) return false
  if (col.stickyEnd === true || col.key === 'actions') return true
  return false
}

function isStickyStartColumn(col: Column) {
  return col.sticky === true && !isStickyEndColumn(col)
}

/** Sticky cells need opaque backgrounds so scrolling content does not bleed through. */
function getStickyCellBg(
  isSelected: boolean,
  isEven: boolean,
  theme: Theme,
  isDark: boolean,
) {
  if (isSelected) {
    return isDark
      ? alpha(theme.palette.primary.main, 0.16)
      : alpha(theme.palette.primary.main, 0.1)
  }
  if (isEven) {
    return isDark ? '#1A1D21' : '#F9FAFB'
  }
  return theme.palette.background.paper
}

function getStickyEdgeShadow(side: 'start' | 'end', isDark: boolean) {
  const shadowColor = isDark ? 'rgba(0,0,0,0.35)' : 'rgba(0,0,0,0.08)'
  return side === 'end'
    ? `-4px 0 4px -2px ${shadowColor}`
    : `4px 0 4px -2px ${shadowColor}`
}

function SkeletonRows({ count, cols }: { count: number; cols: number }) {
  return (
    <>
      {[...Array(count)].map((_, i) => (
        <TableRow key={i}>
          {[...Array(cols)].map((__, j) => (
            <TableCell key={j} sx={{ py: '12px', px: '12px' }}>
              <Skeleton variant="text" width="80%" height={20} />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  )
}

export default function DataTable({
  columns,
  data,
  rowKey,
  loading = false,
  total,
  state,
  onStateChange,
  onRowClick,
  onCellEdit,
  renderExpanded,
  bulkActions,
  emptyState,
  stickyHeader = true,
  height = 'auto',
  title,
  actions,
  showColumnPicker,
  hideToolbar = false,
  hidePagination = false,
  embedded = false,
  showColumnSearch = true,
  onColumnFilterClick,
  enableColumnSort = true,
}: DataTableProps) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'))
  const isTabletTable = useMediaQuery(theme.breakpoints.between('lg', 'desktop'))
  const isDark = theme.palette.mode === 'dark'

  const [editingCell, setEditingCell] = useState<{ rowId: string; columnKey: string } | null>(null)

  const visibleColumns = useMemo(
    () =>
      columns.filter(
        (c) => c.hideable === false || !state.hiddenColumnKeys.includes(c.key),
      ),
    [columns, state.hiddenColumnKeys],
  )

  const hideableColumnCount = columns.filter((c) => c.hideable !== false).length
  const effectiveShowColumnPicker =
    showColumnPicker !== false && hideableColumnCount >= 2

  const visibleTableColumns = useMemo(() => {
    if (!isTabletTable) return visibleColumns
    return visibleColumns.filter((c) => !c.hideOnTablet)
  }, [isTabletTable, visibleColumns])

  // Theme colors
  const headerBg = isDark
    ? alpha(theme.palette.common.white, 0.04)
    : '#F9FAFB'
  const evenRowBg = isDark
    ? alpha(theme.palette.common.white, 0.02)
    : alpha(theme.palette.primary.main, 0.02)
  const hoverBg = isDark
    ? alpha(theme.palette.common.white, 0.04)
    : alpha(theme.palette.primary.main, 0.03)
  const selectedBg = alpha(theme.palette.primary.main, 0.08)

  const totalCols = visibleTableColumns.length
    + (bulkActions ? 1 : 0)
    + (renderExpanded ? 1 : 0)

  const totalRows = total ?? data.length
  const stickyEndRight = renderExpanded ? EXPAND_COLUMN_WIDTH : 0
  const tableLayoutWidth = useMemo(
    () => getDataTableLayoutWidth(visibleTableColumns, { bulkActions: !!bulkActions, renderExpanded: !!renderExpanded }),
    [visibleTableColumns, bulkActions, renderExpanded],
  )

  // State handlers
  const handleSort = (key: string) => {
    let dir = state.sortDirection
    if (state.sortKey !== key) dir = 'asc'
    else if (dir === 'asc') dir = 'desc'
    else if (dir === 'desc') dir = null
    else dir = 'asc'
    onStateChange({ ...state, sortKey: dir === null ? null : key, sortDirection: dir })
  }

  const handleColumnSearch = (key: string, value: string) => {
    onStateChange({ ...state, page: 0, columnSearch: { ...state.columnSearch, [key]: value } })
  }

  const handleGlobalSearch = (value: string) => {
    onStateChange({ ...state, page: 0, searchQuery: value })
  }

  const handleRowSelect = (rowId: string, checked: boolean) => {
    const next = checked
      ? [...state.selectedRows, rowId]
      : state.selectedRows.filter(id => id !== rowId)
    onStateChange({ ...state, selectedRows: next })
  }

  const handleSelectAll = (checked: boolean) => {
    onStateChange({ ...state, selectedRows: checked ? data.map(r => String(r[rowKey])) : [] })
  }

  const handleToggleExpand = (rowId: string) => {
    const isOpen = state.expandedRows.includes(rowId)
    onStateChange({
      ...state,
      expandedRows: isOpen ? state.expandedRows.filter(id => id !== rowId) : [...state.expandedRows, rowId],
    })
  }

  const selectedData = data.filter(r => state.selectedRows.includes(String(r[rowKey])))

  // ── Mobile card view ──────────────────────────────────────────────
  const mobileView = (
    <Box>
      <TableToolbar
        title={title}
        searchValue={state.searchQuery}
        onSearch={handleGlobalSearch}
        filters={state.filters}
        onFiltersChange={(filters) => onStateChange({ ...state, filters, page: 0 })}
        columns={columns}
        selectedCount={state.selectedRows.length}
        selectedRows={selectedData}
        bulkActions={bulkActions}
        onBulkAction={(action, rows) => action.onClick(rows)}
        onDeselectAll={() => onStateChange({ ...state, selectedRows: [] })}
        actions={actions}
        showColumnPicker={effectiveShowColumnPicker}
        hiddenColumnKeys={state.hiddenColumnKeys}
        onHiddenColumnKeysChange={(keys) =>
          onStateChange({ ...state, hiddenColumnKeys: keys })}
      />
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 1 }}>
        {loading && [...Array(3)].map((_, i) => (
          <Card key={i} variant="outlined">
            <CardContent sx={{ py: 1.5, '&:last-child': { pb: 1.5 } }}>
              <Skeleton width="60%" height={22} />
              <Skeleton width="40%" height={18} />
            </CardContent>
          </Card>
        ))}
        {!loading && data.length === 0 && (
          <EmptyState
            variant={state.searchQuery || state.filters.length > 0 ? 'no-results' : 'no-data'}
            title={emptyState?.title}
            description={emptyState?.description}
            action={emptyState?.action}
          />
        )}
        {!loading && data.map((row) => {
          const rowId = String(row[rowKey])
          const isSelected = state.selectedRows.includes(rowId)
          // find action column
          const actionCol = visibleColumns.find(c => !c.label && c.render)
          const dataColumns = visibleColumns.filter(c => c !== actionCol && c.hideBelow !== 'lg')
          return (
            <Card
              key={rowId}
              variant="outlined"
              onClick={onRowClick ? () => onRowClick(row) : undefined}
              sx={{ cursor: onRowClick ? 'pointer' : 'default', bgcolor: isSelected ? selectedBg : undefined }}
            >
              <CardContent sx={{ py: 1.5, '&:last-child': { pb: 1.5 } }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 1 }}>
                  {bulkActions && (
                    <Checkbox
                      size="small"
                      checked={isSelected}
                      onClick={(e) => { e.stopPropagation(); handleRowSelect(rowId, !isSelected) }}
                      sx={{ p: 0 }}
                    />
                  )}
                  <Typography variant="subtitle2" sx={{ flex: 1 }}>
                    {visibleColumns[0]
                      ? (visibleColumns[0].render
                        ? visibleColumns[0].render(row[visibleColumns[0].key], row)
                        : row[visibleColumns[0].key])
                      : ''}
                  </Typography>
                  {actionCol && actionCol.render && (
                    <Box onClick={(e) => e.stopPropagation()}>
                      {actionCol.render(row[actionCol.key], row)}
                    </Box>
                  )}
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  {dataColumns.slice(1).map((col) => (
                    <Box key={col.key} sx={{ display: 'flex', gap: 0.5 }}>
                      <Typography variant="caption" color="text.secondary" sx={{ minWidth: 80 }}>
                        {col.label}:
                      </Typography>
                      <Typography variant="caption">
                        {col.render
                          ? col.render(row[col.key], row)
                          : col.formatValue
                            ? col.formatValue(row[col.key])
                            : String(row[col.key] ?? '')}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          )
        })}
      </Box>
      {!hidePagination && (
        <>
          <Divider sx={{ mt: 2 }} />
          <Pagination
            page={state.page}
            pageSize={state.pageSize}
            total={totalRows}
            onPage={(p) => onStateChange({ ...state, page: p })}
            onPageSize={(s) => onStateChange({ ...state, pageSize: s, page: 0 })}
            loading={loading}
          />
        </>
      )}
    </Box>
  )

  // ── Desktop table view ─────────────────────────────────────────────
  const compactCellSx = embedded
    ? { py: '8px', px: '8px', fontSize: '13px' }
    : { py: '12px', px: '12px' }
  const compactHeaderCellSx = embedded
    ? { py: '8px', px: '8px', height: '34px', verticalAlign: 'middle' as const }
    : { py: '12px', px: '12px', verticalAlign: 'top' as const }

  const tableView = (
    <Box>
      {!hideToolbar && (
        <TableToolbar
          title={title}
          searchValue={state.searchQuery}
          onSearch={handleGlobalSearch}
          filters={state.filters}
          onFiltersChange={(filters) => onStateChange({ ...state, filters, page: 0 })}
          columns={columns}
          selectedCount={state.selectedRows.length}
          selectedRows={selectedData}
          bulkActions={bulkActions}
          onBulkAction={(action, rows) => action.onClick(rows)}
          onDeselectAll={() => onStateChange({ ...state, selectedRows: [] })}
          actions={actions}
          showColumnPicker={effectiveShowColumnPicker}
          hiddenColumnKeys={state.hiddenColumnKeys}
          onHiddenColumnKeysChange={(keys) =>
            onStateChange({ ...state, hiddenColumnKeys: keys })}
        />
      )}

      <TableContainer
        sx={{
          width: '100%',
          maxHeight: height !== 'auto' ? height : undefined,
          overflowX: 'auto',
          mt: embedded ? 0 : 1,
          border: embedded ? 'none' : `${BORDER_WIDTH.thin} solid`,
          borderColor: embedded ? undefined : 'divider',
          borderRadius: embedded ? 0 : BORDER_RADIUS.lg,
          boxShadow: embedded ? 'none' : SHADOWS.sm,
        }}
      >
        <Table
          stickyHeader={stickyHeader}
          size="small"
          sx={{
            tableLayout: 'fixed',
            width: '100%',
            minWidth: tableLayoutWidth,
            ...(embedded
              ? {
                  '& th': {
                    fontSize: '12px',
                    fontWeight: 600,
                    bgcolor: headerBg,
                  },
                  '& td': { fontSize: '13px' },
                }
              : undefined),
          }}
        >
          <colgroup>
            {bulkActions && <col style={{ width: CHECKBOX_COLUMN_WIDTH }} />}
            {visibleTableColumns.map((col) => {
              const width = getDataTableColWidth(col, isStickyEndColumn(col))
              return <col key={col.key} style={{ width }} />
            })}
            {renderExpanded && <col style={{ width: EXPAND_COLUMN_WIDTH }} />}
          </colgroup>
          {/* Header */}
          <TableHead>
            <TableRow>
              {bulkActions && (
                <TableCell
                  padding="checkbox"
                  sx={{ bgcolor: headerBg, position: 'sticky', top: 0, zIndex: 3, borderBottom: '2px solid', borderColor: 'divider' }}
                >
                  <Checkbox
                    size="small"
                    indeterminate={state.selectedRows.length > 0 && state.selectedRows.length < data.length}
                    checked={data.length > 0 && state.selectedRows.length === data.length}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                  />
                </TableCell>
              )}
              {visibleTableColumns.map((col) => {
                const stickyEnd = isStickyEndColumn(col)
                const stickyStart = isStickyStartColumn(col)
                const columnWidthSx = getDataTableColumnWidthSx(col, stickyEnd)
                return (
                <TableCell
                  key={col.key}
                  sx={{
                    bgcolor: headerBg,
                    position: stickyEnd || stickyStart || stickyHeader ? 'sticky' : undefined,
                    left: stickyStart ? 0 : undefined,
                    right: stickyEnd ? stickyEndRight : undefined,
                    top: stickyHeader ? 0 : undefined,
                    zIndex: stickyEnd ? 5 : stickyStart ? 4 : 3,
                    borderBottom: '2px solid',
                    borderColor: 'divider',
                    ...columnWidthSx,
                    boxShadow: stickyEnd
                      ? getStickyEdgeShadow('end', isDark)
                      : stickyStart
                        ? getStickyEdgeShadow('start', isDark)
                        : undefined,
                    display: getHideDisplay(col.hideBelow),
                    overflow: stickyEnd ? 'visible' : 'hidden',
                    ...compactHeaderCellSx,
                  }}
                >
                  <ColumnHeader
                    column={col}
                    sortKey={state.sortKey}
                    sortDirection={state.sortDirection}
                    onSort={handleSort}
                    searchValue={state.columnSearch[col.key] ?? ''}
                    onSearch={handleColumnSearch}
                    filterCount={state.filters.filter(f => f.columnKey === col.key).length}
                    showColumnSearch={showColumnSearch}
                    enableColumnSort={enableColumnSort}
                    onFilterClick={
                      onColumnFilterClick && col.filterable !== false && col.key !== 'actions'
                        ? (e) => onColumnFilterClick(e, col.key)
                        : undefined
                    }
                  />
                </TableCell>
              )})}
              {renderExpanded && (
                <TableCell
                  sx={{
                    bgcolor: headerBg,
                    position: 'sticky',
                    top: 0,
                    right: 0,
                    zIndex: 5,
                    width: EXPAND_COLUMN_WIDTH,
                    minWidth: EXPAND_COLUMN_WIDTH,
                    maxWidth: EXPAND_COLUMN_WIDTH,
                    boxShadow: getStickyEdgeShadow('end', isDark),
                    borderBottom: '2px solid',
                    borderColor: 'divider',
                  }}
                />
              )}
            </TableRow>
          </TableHead>

          {/* Body */}
          <TableBody>
            {loading && <SkeletonRows count={5} cols={totalCols} />}
            {!loading && data.length === 0 && (
              <TableRow>
                <TableCell colSpan={totalCols} sx={{ border: 0 }}>
                  <EmptyState
                    variant={state.searchQuery || state.filters.length > 0 || Object.values(state.columnSearch).some(Boolean) ? 'no-results' : 'no-data'}
                    title={emptyState?.title}
                    description={emptyState?.description}
                    action={emptyState?.action}
                  />
                </TableCell>
              </TableRow>
            )}
            {!loading && data.map((row, rowIndex) => {
              const rowId = String(row[rowKey])
              const isSelected = state.selectedRows.includes(rowId)
              const isExpanded = state.expandedRows.includes(rowId)
              const isEven = rowIndex % 2 === 1
              const rowBg = isSelected ? selectedBg : isEven ? evenRowBg : undefined

              return (
                <Fragment key={rowId}>
                  <TableRow
                    onClick={onRowClick ? () => onRowClick(row) : undefined}
                    sx={{
                      bgcolor: rowBg,
                      cursor: onRowClick ? 'pointer' : 'default',
                      '&:hover': { bgcolor: isSelected ? selectedBg : hoverBg },
                    }}
                  >
                    {/* Checkbox */}
                    {bulkActions && (
                      <TableCell padding="checkbox">
                        <Checkbox
                          size="small"
                          checked={isSelected}
                          onClick={(e) => { e.stopPropagation(); handleRowSelect(rowId, !isSelected) }}
                        />
                      </TableCell>
                    )}

                    {/* Data cells */}
                    {visibleTableColumns.map((col) => {
                      const cellValue = row[col.key]
                      const isEditing = editingCell?.rowId === rowId && editingCell?.columnKey === col.key
                      const stickyEnd = isStickyEndColumn(col)
                      const stickyStart = isStickyStartColumn(col)
                      const stickyCellBg = getStickyCellBg(isSelected, isEven, theme, isDark)
                      const columnWidthSx = getDataTableColumnWidthSx(col, stickyEnd)

                      const cellContent = isEditing ? (
                        <InlineEdit
                          value={cellValue}
                          column={col}
                          onSave={(val) => {
                            onCellEdit?.(rowId, col.key, val)
                            setEditingCell(null)
                          }}
                          onCancel={() => setEditingCell(null)}
                        />
                      ) : col.render
                        ? col.render(cellValue, row)
                        : col.formatValue
                          ? col.formatValue(cellValue)
                          : (cellValue == null ? '' : String(cellValue))

                      return (
                        <TableCell
                          key={col.key}
                          sx={{
                            ...compactCellSx,
                            fontSize: 'inherit',
                            lineHeight: '20px',
                            borderBottom: '1px solid',
                            borderColor: 'divider',
                            ...columnWidthSx,
                            position: stickyEnd || stickyStart ? 'sticky' : undefined,
                            left: stickyStart ? 0 : undefined,
                            right: stickyEnd ? stickyEndRight : undefined,
                            zIndex: stickyEnd ? 3 : stickyStart ? 2 : undefined,
                            bgcolor: stickyEnd || stickyStart ? stickyCellBg : undefined,
                            boxShadow: stickyEnd
                              ? getStickyEdgeShadow('end', isDark)
                              : stickyStart
                                ? getStickyEdgeShadow('start', isDark)
                                : undefined,
                            display: getHideDisplay(col.hideBelow),
                            textAlign: col.align,
                            whiteSpace: stickyEnd ? 'nowrap' : 'nowrap',
                            overflow: stickyEnd ? 'visible' : 'hidden',
                            textOverflow: stickyEnd ? undefined : 'ellipsis',
                            cursor: col.editable ? 'text' : undefined,
                            isolation: stickyEnd || stickyStart ? 'isolate' : undefined,
                          }}
                          onClick={col.editable ? (e) => { e.stopPropagation(); setEditingCell({ rowId, columnKey: col.key }) } : undefined}
                        >
                          {stickyEnd ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                              {cellContent}
                            </Box>
                          ) : (
                            <Box
                              sx={{
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                minWidth: 0,
                                maxWidth: '100%',
                              }}
                            >
                              {cellContent}
                            </Box>
                          )}
                        </TableCell>
                      )
                    })}

                    {/* Expand button */}
                    {renderExpanded && (
                      <TableCell
                        sx={{
                          py: 0.5,
                          px: 1,
                          width: EXPAND_COLUMN_WIDTH,
                          minWidth: EXPAND_COLUMN_WIDTH,
                          maxWidth: EXPAND_COLUMN_WIDTH,
                          position: 'sticky',
                          right: 0,
                          zIndex: 3,
                          bgcolor: getStickyCellBg(isSelected, isEven, theme, isDark),
                          boxShadow: getStickyEdgeShadow('end', isDark),
                          borderBottom: '1px solid',
                          borderColor: 'divider',
                        }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <IconButton size="small" onClick={() => handleToggleExpand(rowId)}>
                          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </IconButton>
                      </TableCell>
                    )}
                  </TableRow>

                  {/* Expanded content */}
                  {renderExpanded && (
                    <ExpandedRow key={`${rowId}-expanded`} colSpan={totalCols} open={isExpanded}>
                      {renderExpanded(row)}
                    </ExpandedRow>
                  )}
                </Fragment>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {!hidePagination && (
        <Pagination
          page={state.page}
          pageSize={state.pageSize}
          total={totalRows}
          onPage={(p) => onStateChange({ ...state, page: p })}
          onPageSize={(s) => onStateChange({ ...state, pageSize: s, page: 0 })}
          loading={loading}
        />
      )}
    </Box>
  )

  return isMobile ? mobileView : tableView
}
