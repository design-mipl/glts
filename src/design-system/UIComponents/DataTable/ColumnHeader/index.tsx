import { useRef, useState, useEffect } from 'react'
import { Box, Typography, IconButton, InputBase, Tooltip, Badge } from '@mui/material'
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import FilterListIcon from '@mui/icons-material/FilterList'
import ClearIcon from '@mui/icons-material/Clear'
import type { Column, SortDirection } from '../types'

export interface ColumnHeaderProps {
  column: Column
  sortKey: string | null
  sortDirection: SortDirection
  onSort: (key: string) => void
  searchValue: string
  onSearch: (key: string, value: string) => void
  filterCount: number
}

export default function ColumnHeader({
  column,
  sortKey,
  sortDirection,
  onSort,
  searchValue,
  onSearch,
  filterCount,
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
    ? ArrowUpwardIcon
    : isSorted && sortDirection === 'desc'
      ? ArrowDownwardIcon
      : UnfoldMoreIcon

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
              <SortIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </Tooltip>
        )}
        {column.filterable !== false && filterCount > 0 && (
          <Badge badgeContent={filterCount} color="primary" sx={{ '& .MuiBadge-badge': { fontSize: 10, minWidth: 16, height: 16 } }}>
            <FilterListIcon sx={{ fontSize: 14, color: 'primary.main' }} />
          </Badge>
        )}
      </Box>

      {/* Column search */}
      {column.searchable !== false && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            height: 28,
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 0.75,
            px: 0.75,
            bgcolor: 'background.paper',
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
              <ClearIcon sx={{ fontSize: 13 }} />
            </IconButton>
          )}
        </Box>
      )}
    </Box>
  )
}
