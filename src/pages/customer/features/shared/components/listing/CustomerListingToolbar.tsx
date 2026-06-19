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

export interface CustomerListingToolbarColumn {
  key: string
  label: string
  hideable?: boolean
}

export interface CustomerListingToolbarFilterPopoverConfig<T = unknown> {
  active?: boolean
  value: T
  onApply: (value: T) => void
  onClear: () => void
  hasActive?: (value: T) => boolean
  width?: ListingFilterPopoverWidth
  scrollable?: boolean
  children: (draft: T, patch: (partial: Partial<T>) => void) => ReactNode
}

export interface CustomerListingToolbarProps {
  searchValue: string
  onSearch: (value: string) => void
  searchPlaceholder?: string
  onExport?: () => void
  viewMode?: 'table' | 'grid'
  onViewModeChange?: (mode: 'table' | 'grid') => void
  columns?: CustomerListingToolbarColumn[]
  hiddenColumnKeys?: string[]
  onHiddenColumnKeysChange?: (keys: string[]) => void
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  filterPopover?: CustomerListingToolbarFilterPopoverConfig<any>
}

export function CustomerListingToolbar({
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
}: CustomerListingToolbarProps) {
  const [columnAnchor, setColumnAnchor] = useState<HTMLElement | null>(null)
  const [filterAnchor, setFilterAnchor] = useState<HTMLElement | null>(null)

  const hideableColumns = columns.filter(c => c.hideable !== false && c.key !== 'actions')
  const columnPickerEnabled = hideableColumns.length >= 2 && Boolean(onHiddenColumnKeysChange)
  const filterActive = filterPopover?.active ?? false

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
        {filterPopover && (
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
                onClick={e => setColumnAnchor(e.currentTarget)}
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
