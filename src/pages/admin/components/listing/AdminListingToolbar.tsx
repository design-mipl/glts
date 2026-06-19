import { useState, type ReactNode } from 'react'
import {
  Box,
  IconButton,
  Tooltip,
} from '@mui/material'
import { Download, Grid3x3, List, Columns, Filter } from 'lucide-react'
import { Button, ColumnPickerPopover, SearchInput } from '@/design-system/UIComponents'
import {
  ListingFilterPopoverShell,
  type ListingFilterPopoverWidth,
} from '@/design-system/listingFilterPopoverShell'
import {
  listingToolbarActionsSx,
  listingToolbarIconButtonSx,
  listingToolbarRootSx,
  listingToolbarSearchSx,
  listingToolbarViewToggleButtonSx,
  listingToolbarViewToggleSx,
} from '@/design-system/listingToolbarChrome'
import { AdminListingFilterPopover } from './AdminListingFilterPopover'
import type { AdminListingFilterState } from './AdminListingAdvancedFilters'

export interface AdminListingToolbarColumn {
  key: string
  label: string
  hideable?: boolean
}

export interface AdminListingToolbarFilterPopoverConfig<T = unknown> {
  active?: boolean
  value: T
  onApply: (value: T) => void
  onClear: () => void
  hasActive?: (value: T) => boolean
  width?: ListingFilterPopoverWidth
  scrollable?: boolean
  children: (draft: T, patch: (partial: Partial<T>) => void) => ReactNode
}

export interface AdminListingToolbarFilterConfig {
  filters: AdminListingFilterState
  onApply: (filters: AdminListingFilterState) => void
  onClear: () => void
  countries: string[]
  statuses: string[]
  priorities: string[]
}

export interface AdminListingToolbarProps {
  searchValue: string
  onSearch: (value: string) => void
  searchPlaceholder?: string
  onExport?: () => void
  viewMode?: 'table' | 'grid'
  onViewModeChange?: (mode: 'table' | 'grid') => void
  columns?: AdminListingToolbarColumn[]
  hiddenColumnKeys?: string[]
  onHiddenColumnKeysChange?: (keys: string[]) => void
  /** Generic filter popover — module-specific fields via children render prop. */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  filterPopover?: AdminListingToolbarFilterPopoverConfig<any>
  /** Preset country / status / priority filter popover for standard listing modules. */
  filter?: AdminListingToolbarFilterConfig
}

export function AdminListingToolbar({
  searchValue,
  onSearch,
  searchPlaceholder = 'Search…',
  onExport,
  viewMode = 'table',
  onViewModeChange,
  columns = [],
  hiddenColumnKeys = [],
  onHiddenColumnKeysChange,
  filterPopover,
  filter,
}: AdminListingToolbarProps) {
  const [columnAnchor, setColumnAnchor] = useState<HTMLElement | null>(null)
  const [filterAnchor, setFilterAnchor] = useState<HTMLElement | null>(null)

  const hideableColumns = columns.filter((col) => col.hideable !== false && col.key !== 'actions')
  const columnPickerEnabled = hideableColumns.length >= 2 && Boolean(onHiddenColumnKeysChange)

  const filterEnabled = Boolean(filterPopover || filter)
  const filterActive = filterPopover?.active ?? Boolean(
    filter && (filter.filters.country || filter.filters.status || filter.filters.priority),
  )

  return (
    <Box sx={listingToolbarRootSx()}>
      <SearchInput
        value={searchValue}
        onChange={onSearch}
        placeholder={searchPlaceholder}
        size="sm"
        sx={listingToolbarSearchSx()}
      />

      <Box sx={listingToolbarActionsSx()}>
        {filterEnabled && (
          <>
            <Button
              variant="neutral"
              size="sm"
              startIcon={<Filter size={14} strokeWidth={1.75} />}
              onClick={(event) => setFilterAnchor(event.currentTarget)}
              sx={
                filterActive
                  ? { borderColor: 'primary.main', color: 'primary.main' }
                  : undefined
              }
            >
              <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
                Filter
              </Box>
            </Button>
            {filterPopover ? (
              <ListingFilterPopoverShell
                open={Boolean(filterAnchor)}
                anchorEl={filterAnchor}
                onClose={() => setFilterAnchor(null)}
                value={filterPopover.value}
                onApply={filterPopover.onApply}
                onClear={filterPopover.onClear}
                hasActive={filterPopover.hasActive}
                width={filterPopover.width}
                scrollable={filterPopover.scrollable}
              >
                {filterPopover.children}
              </ListingFilterPopoverShell>
            ) : filter ? (
              <AdminListingFilterPopover
                open={Boolean(filterAnchor)}
                anchorEl={filterAnchor}
                onClose={() => setFilterAnchor(null)}
                filters={filter.filters}
                onApply={filter.onApply}
                onClear={filter.onClear}
                countries={filter.countries}
                statuses={filter.statuses}
                priorities={filter.priorities}
              />
            ) : null}
          </>
        )}

        {onExport && (
          <Button
            variant="neutral"
            size="sm"
            startIcon={<Download size={14} strokeWidth={1.75} />}
            onClick={onExport}
          >
            <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
              Export
            </Box>
          </Button>
        )}

        {columnPickerEnabled && onHiddenColumnKeysChange && (
          <>
            <Tooltip title="Columns">
              <IconButton
                size="small"
                onClick={(event) => setColumnAnchor(event.currentTarget)}
                sx={listingToolbarIconButtonSx(hiddenColumnKeys.length > 0)}
              >
                <Columns size={16} />
              </IconButton>
            </Tooltip>
            <ColumnPickerPopover
              open={Boolean(columnAnchor)}
              anchorEl={columnAnchor}
              onClose={() => setColumnAnchor(null)}
              columns={hideableColumns}
              hiddenColumnKeys={hiddenColumnKeys}
              onHiddenColumnKeysChange={onHiddenColumnKeysChange}
            />
          </>
        )}

        {onViewModeChange && (
          <Box sx={listingToolbarViewToggleSx()}>
            <IconButton
              size="small"
              onClick={() => onViewModeChange('grid')}
              sx={listingToolbarViewToggleButtonSx(viewMode === 'grid')}
            >
              <Grid3x3 size={16} />
            </IconButton>
            <IconButton
              size="small"
              onClick={() => onViewModeChange('table')}
              sx={listingToolbarViewToggleButtonSx(viewMode === 'table')}
            >
              <List size={16} />
            </IconButton>
          </Box>
        )}
      </Box>
    </Box>
  )
}
