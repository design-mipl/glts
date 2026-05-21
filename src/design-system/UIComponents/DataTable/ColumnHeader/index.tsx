import { useRef, useState, useEffect } from 'react'
import type { MouseEvent } from 'react'
import { Box, Typography, IconButton, InputBase, Tooltip, Badge } from '@mui/material'
import { ArrowUpDown, ArrowUp, ArrowDown, Filter, X } from 'lucide-react'
import { BORDER_RADIUS, BORDER_WIDTH } from '../../../tokens'
import type { Column, SortDirection } from '../types'

export interface ColumnHeaderProps {
  column: Column
  sortKey: string | null
  sortDirection: SortDirection
  onSort: (key: string) => void
  searchValue: string
  onSearch: (key: string, value: string) => void
  filterCount: number
  showColumnSearch?: boolean
  onFilterClick?: (event: MouseEvent<HTMLElement>) => void
}

export default function ColumnHeader({
  column,
  sortKey,
  sortDirection,
  onSort,
  searchValue,
  onSearch,
  filterCount,
  showColumnSearch = true,
  onFilterClick,
}: ColumnHeaderProps) {
  const [localSearch, setLocalSearch] = useState(searchValue)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isSorted = sortKey === column.key
  const sortable = column.sortable !== false

  // Sync external value changes (e.g. clear all)
  useEffect(() => {
    setLocalSearch(searchValue)
  }, [searchValue])

  const handleSearchChange = (val: string) => {
    setLocalSearch(val)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      onSearch(column.key, val)
    }, 300)
  }

  const SortIcon = isSorted && sortDirection === 'asc'
    ? ArrowUp
    : isSorted && sortDirection === 'desc'
      ? ArrowDown
      : ArrowUpDown

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, minWidth: column.minWidth }}>
      {/* Label row */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25 }}>
        <Typography
          variant="body2"
          fontWeight={600}
          color="text.secondary"
          sx={{ fontSize: 13, userSelect: 'none', flex: 1 }}
        >
          {column.label}
        </Typography>
        {sortable && (
          <Tooltip title={isSorted ? (sortDirection === 'asc' ? 'Sort descending' : sortDirection === 'desc' ? 'Clear sort' : 'Sort ascending') : 'Sort ascending'}>
            <IconButton
              size="small"
              onClick={() => onSort(column.key)}
              sx={{
                p: 0.25,
                color: isSorted ? 'primary.main' : 'text.disabled',
                '&:hover': { color: 'text.secondary' },
              }}
            >
              <SortIcon size={16} />
            </IconButton>
          </Tooltip>
        )}
        {onFilterClick && (
          <Tooltip title="Filter column">
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation()
                onFilterClick(e)
              }}
              sx={{
                p: 0.25,
                color: filterCount > 0 ? 'primary.main' : 'text.disabled',
                '&:hover': { color: 'text.secondary' },
              }}
            >
              <Filter size={14} />
            </IconButton>
          </Tooltip>
        )}
        {!onFilterClick && column.filterable !== false && filterCount > 0 && (
          <Badge badgeContent={filterCount} color="primary" sx={{ '& .MuiBadge-badge': { fontSize: 10, minWidth: 16, height: 16 } }}>
            <Filter size={14} style={{ color: 'inherit' }} />
          </Badge>
        )}
      </Box>

      {/* Column search */}
      {showColumnSearch && column.searchable !== false && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            height: 28,
            border: `${BORDER_WIDTH.thin} solid`,
            borderColor: 'divider',
            borderRadius: BORDER_RADIUS.md,
            px: 0.75,
            bgcolor: 'background.paper',
            transition: 'all 0.2s ease',
            '&:focus-within': { borderColor: 'primary.main' },
          }}
        >
          <InputBase
            value={localSearch}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search..."
            inputProps={{ 'aria-label': `Search ${column.label}` }}
            sx={{ fontSize: 12, flex: 1, '& input': { p: 0 } }}
          />
          {localSearch && (
            <IconButton size="small" sx={{ p: 0, ml: 0.25 }} onClick={() => handleSearchChange('')}>
              <X size={13} />
            </IconButton>
          )}
        </Box>
      )}
    </Box>
  )
}
