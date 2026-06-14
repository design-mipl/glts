import { useRef, useState } from 'react'
import {
  Box, Typography, InputBase, IconButton, Badge,
  Tooltip, Fade, Button, useTheme, useMediaQuery,
} from '@mui/material'
import { Search, Filter, Columns, X } from 'lucide-react'
import { BORDER_RADIUS, BORDER_WIDTH, SHADOWS } from '../../../tokens'
import type { Column, FilterRule, BulkAction } from '../types'
import FilterPanel from '../FilterPanel'
import FilterChip from '../FilterChip'
import BulkActions from '../BulkActions'
import ColumnPickerPopover from '../ColumnPickerPopover'

export interface TableToolbarProps {
  title?: string
  searchValue: string
  onSearch: (value: string) => void
  filters: FilterRule[]
  onFiltersChange: (filters: FilterRule[]) => void
  columns: Column[]
  selectedCount: number
  selectedRows?: any[]
  bulkActions?: BulkAction[]
  onBulkAction?: (action: BulkAction, rows: any[]) => void
  onDeselectAll?: () => void
  actions?: React.ReactNode
  /** When false, column picker is hidden regardless of column definitions. */
  showColumnPicker?: boolean
  hiddenColumnKeys: string[]
  onHiddenColumnKeysChange: (keys: string[]) => void
}

export default function TableToolbar({
  title,
  searchValue,
  onSearch,
  filters,
  onFiltersChange,
  columns,
  selectedCount,
  selectedRows = [],
  bulkActions,
  onBulkAction,
  onDeselectAll,
  actions,
  showColumnPicker = true,
  hiddenColumnKeys,
  onHiddenColumnKeysChange,
}: TableToolbarProps) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('xl'))
  const [filterOpen, setFilterOpen] = useState(false)
  const filterBtnRef = useRef<HTMLButtonElement>(null)
  const [columnAnchor, setColumnAnchor] = useState<HTMLElement | null>(null)

  const activeFilters = filters.length

  const hideableColumns = columns.filter((c) => c.hideable !== false)
  const columnPickerEnabled =
    showColumnPicker !== false && hideableColumns.length >= 2

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      {/* Main toolbar row */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minHeight: 48 }}>
        {/* Bulk mode */}
        <Fade in={selectedCount > 0} unmountOnExit>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
            {bulkActions && onBulkAction && onDeselectAll && (
              <BulkActions
                selectedRows={selectedRows}
                actions={bulkActions}
                onAction={onBulkAction}
                onDeselectAll={onDeselectAll}
              />
            )}
          </Box>
        </Fade>

        {/* Normal mode */}
        <Fade in={selectedCount === 0} unmountOnExit>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
            {title && !isMobile && (
              <Typography variant="subtitle1" fontWeight={600} sx={{ mr: 1, whiteSpace: 'nowrap' }}>
                {title}
              </Typography>
            )}

            {/* Search */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                flex: 1,
                maxWidth: { xs: '100%', md: 360 },
                height: 36,
                border: `${BORDER_WIDTH.thin} solid`,
                borderColor: 'divider',
                borderRadius: BORDER_RADIUS.md,
                px: 1.25,
                bgcolor: 'background.paper',
                transition: 'all 0.2s ease',
                '&:focus-within': { borderColor: 'primary.main', boxShadow: SHADOWS.xs },
              }}
            >
              <Search size={18} style={{ opacity: 0.4, marginRight: 6, flexShrink: 0 }} />
              <InputBase
                value={searchValue}
                onChange={(e) => onSearch(e.target.value)}
                placeholder="Search..."
                sx={{ flex: 1, fontSize: 14, '& input': { p: 0 } }}
              />
              {searchValue && (
                <IconButton size="small" sx={{ p: 0.25 }} onClick={() => onSearch('')}>
                  <X size={15} />
                </IconButton>
              )}
            </Box>

            {/* Filter button */}
            <Tooltip title="Filters">
              <IconButton
                ref={filterBtnRef}
                size="small"
                onClick={() => setFilterOpen(true)}
                sx={{ color: activeFilters > 0 ? 'primary.main' : 'text.secondary' }}
              >
                <Badge badgeContent={activeFilters || undefined} color="primary">
                  <Filter size={18} />
                </Badge>
              </IconButton>
            </Tooltip>

            {columnPickerEnabled && (
              <>
                <Tooltip title="Columns">
                  <IconButton
                    size="small"
                    onClick={(e) => setColumnAnchor(e.currentTarget)}
                    sx={{
                      color:
                        hiddenColumnKeys.length > 0 ? 'primary.main' : 'text.secondary',
                    }}
                  >
                    <Columns size={18} />
                  </IconButton>
                </Tooltip>
                <ColumnPickerPopover
                  open={Boolean(columnAnchor)}
                  anchorEl={columnAnchor}
                  onClose={() => setColumnAnchor(null)}
                  columns={hideableColumns.map(col => ({
                    key: col.key,
                    label: col.label || col.key,
                    hideable: col.hideable,
                  }))}
                  hiddenColumnKeys={hiddenColumnKeys}
                  onHiddenColumnKeysChange={onHiddenColumnKeysChange}
                />
              </>
            )}

            {/* Custom actions */}
            {actions}
          </Box>
        </Fade>
      </Box>

      {/* Active filter chips */}
      {filters.length > 0 && selectedCount === 0 && (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75, alignItems: 'center' }}>
          {filters.map((f) => (
            <FilterChip
              key={f.id}
              filter={f}
              columns={columns}
              onRemove={(id) => onFiltersChange(filters.filter(x => x.id !== id))}
              onEdit={() => setFilterOpen(true)}
            />
          ))}
          <Button
            size="small"
            startIcon={<X size={14} />}
            onClick={() => onFiltersChange([])}
            sx={{ fontSize: 12, py: 0.25 }}
          >
            Clear
          </Button>
        </Box>
      )}

      {/* Filter panel */}
      <FilterPanel
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        anchorEl={filterBtnRef.current}
        columns={columns}
        filters={filters}
        onFiltersChange={onFiltersChange}
      />
    </Box>
  )
}
