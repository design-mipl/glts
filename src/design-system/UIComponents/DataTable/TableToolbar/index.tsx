import { useRef, useState } from 'react'
import {
  Box, Typography, InputBase, IconButton, Badge,
  Tooltip, Fade, Button, useTheme, useMediaQuery,
  Popover, FormGroup, FormControlLabel, Checkbox, Divider,
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import FilterListIcon from '@mui/icons-material/FilterList'
import ViewColumnIcon from '@mui/icons-material/ViewColumn'
import ClearIcon from '@mui/icons-material/Clear'
import CloseIcon from '@mui/icons-material/Close'
import type { Column, FilterRule, BulkAction } from '../types'
import FilterPanel from '../FilterPanel'
import FilterChip from '../FilterChip'
import BulkActions from '../BulkActions'

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

  const visibleHideableCount = hideableColumns.filter(
    (c) => !hiddenColumnKeys.includes(c.key),
  ).length

  function toggleColumnHidden(key: string) {
    const isHidden = hiddenColumnKeys.includes(key)
    if (isHidden) {
      onHiddenColumnKeysChange(hiddenColumnKeys.filter((k) => k !== key))
      return
    }
    if (visibleHideableCount <= 1) return
    onHiddenColumnKeysChange([...hiddenColumnKeys, key])
  }

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
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1,
                px: 1.25,
                bgcolor: 'background.paper',
                '&:focus-within': { borderColor: 'primary.main' },
              }}
            >
              <SearchIcon sx={{ fontSize: 18, color: 'text.disabled', mr: 0.75 }} />
              <InputBase
                value={searchValue}
                onChange={(e) => onSearch(e.target.value)}
                placeholder="Search..."
                sx={{ flex: 1, fontSize: 14, '& input': { p: 0 } }}
              />
              {searchValue && (
                <IconButton size="small" sx={{ p: 0.25 }} onClick={() => onSearch('')}>
                  <ClearIcon sx={{ fontSize: 15 }} />
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
                  <FilterListIcon />
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
                    <ViewColumnIcon />
                  </IconButton>
                </Tooltip>
                <Popover
                  open={Boolean(columnAnchor)}
                  anchorEl={columnAnchor}
                  onClose={() => setColumnAnchor(null)}
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                  slotProps={{ paper: { sx: { minWidth: 220, p: 1.5 } } }}
                >
                  <Typography variant="caption" color="text.secondary" sx={{ px: 0.5, display: 'block', mb: 1 }}>
                    Show columns
                  </Typography>
                  <FormGroup sx={{ gap: 0.25 }}>
                    {hideableColumns.map((col) => {
                      const checked = !hiddenColumnKeys.includes(col.key)
                      const disableUncheck = checked && visibleHideableCount <= 1
                      return (
                        <FormControlLabel
                          key={col.key}
                          control={
                            <Checkbox
                              size="small"
                              checked={checked}
                              disabled={disableUncheck}
                              onChange={() => toggleColumnHidden(col.key)}
                            />
                          }
                          label={col.label || col.key}
                          sx={{ mr: 0, '& .MuiFormControlLabel-label': { fontSize: 14 } }}
                        />
                      )
                    })}
                  </FormGroup>
                  {hiddenColumnKeys.length > 0 && (
                    <>
                      <Divider sx={{ my: 1 }} />
                      <Button
                        size="small"
                        fullWidth
                        onClick={() => {
                          onHiddenColumnKeysChange([])
                          setColumnAnchor(null)
                        }}
                      >
                        Reset columns
                      </Button>
                    </>
                  )}
                </Popover>
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
            startIcon={<CloseIcon sx={{ fontSize: 14 }} />}
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
