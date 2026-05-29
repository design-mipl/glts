import { useState } from 'react'
import {
  Box,
  Popover,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Typography,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
} from '@mui/material'
import { Download, Grid3x3, List, Columns, MoreVertical } from 'lucide-react'
import { Button, SearchInput } from '@/design-system/UIComponents'

export interface AdminListingToolbarColumn {
  key: string
  label: string
  hideable?: boolean
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
  moreMenuItems?: { label: string; onClick: () => void }[]
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
  moreMenuItems = [],
}: AdminListingToolbarProps) {
  const [columnAnchor, setColumnAnchor] = useState<HTMLElement | null>(null)
  const [moreAnchor, setMoreAnchor] = useState<HTMLElement | null>(null)

  const hideableColumns = columns.filter((col) => col.hideable !== false && col.key !== 'actions')
  const columnPickerEnabled = hideableColumns.length >= 2 && Boolean(onHiddenColumnKeysChange)
  const visibleHideableCount = hideableColumns.filter((col) => !hiddenColumnKeys.includes(col.key)).length

  const toggleColumnHidden = (key: string) => {
    if (!onHiddenColumnKeysChange) return
    const isHidden = hiddenColumnKeys.includes(key)
    if (isHidden) {
      onHiddenColumnKeysChange(hiddenColumnKeys.filter((k) => k !== key))
      return
    }
    if (visibleHideableCount <= 1) return
    onHiddenColumnKeysChange([...hiddenColumnKeys, key])
  }

  return (
    <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center', width: '100%', flexWrap: 'wrap' }}>
      <SearchInput
        value={searchValue}
        onChange={onSearch}
        placeholder={searchPlaceholder}
        size="sm"
        sx={{
          width: { xs: '100%', sm: 280 },
          flex: { xs: '1 1 100%', sm: '0 0 280px' },
        }}
      />

      <Box sx={{ display: 'flex', gap: 0.75, alignItems: 'center', ml: { xs: 0, sm: 'auto' }, flexShrink: 0 }}>
        {onExport && (
          <Button
            variant="outlined"
            color="secondary"
            size="sm"
            startIcon={<Download size={14} strokeWidth={1.75} />}
            onClick={onExport}
          >
            <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
              Export
            </Box>
          </Button>
        )}

        {columnPickerEnabled && (
          <>
            <Tooltip title="Columns">
              <IconButton
                size="small"
                onClick={(event) => setColumnAnchor(event.currentTarget)}
                sx={{
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 1,
                  color: hiddenColumnKeys.length > 0 ? 'primary.main' : 'text.secondary',
                }}
              >
                <Columns size={16} />
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
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                Show columns
              </Typography>
              <FormGroup>
                {hideableColumns.map((col) => {
                  const checked = !hiddenColumnKeys.includes(col.key)
                  return (
                    <FormControlLabel
                      key={col.key}
                      control={
                        <Checkbox
                          size="small"
                          checked={checked}
                          disabled={checked && visibleHideableCount <= 1}
                          onChange={() => toggleColumnHidden(col.key)}
                        />
                      }
                      label={col.label}
                      sx={{ '& .MuiFormControlLabel-label': { fontSize: 14 } }}
                    />
                  )
                })}
              </FormGroup>
              {hiddenColumnKeys.length > 0 && (
                <>
                  <Divider sx={{ my: 1 }} />
                  <Button fullWidth onClick={() => onHiddenColumnKeysChange?.([])}>
                    Reset columns
                  </Button>
                </>
              )}
            </Popover>
          </>
        )}

        {onViewModeChange && (
          <Box sx={{ display: 'flex', border: '1px solid', borderColor: 'divider', borderRadius: 1, overflow: 'hidden' }}>
            <IconButton
              size="small"
              onClick={() => onViewModeChange('grid')}
              sx={{
                borderRadius: 0,
                bgcolor: viewMode === 'grid' ? 'action.selected' : 'transparent',
              }}
            >
              <Grid3x3 size={16} />
            </IconButton>
            <IconButton
              size="small"
              onClick={() => onViewModeChange('table')}
              sx={{
                borderRadius: 0,
                bgcolor: viewMode === 'table' ? 'action.selected' : 'transparent',
              }}
            >
              <List size={16} />
            </IconButton>
          </Box>
        )}

        {moreMenuItems.length > 0 && (
          <>
            <Tooltip title="More options">
              <IconButton
                size="small"
                onClick={(event) => setMoreAnchor(event.currentTarget)}
                sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1 }}
              >
                <MoreVertical size={16} />
              </IconButton>
            </Tooltip>
            <Menu anchorEl={moreAnchor} open={Boolean(moreAnchor)} onClose={() => setMoreAnchor(null)}>
              {moreMenuItems.map((item) => (
                <MenuItem
                  key={item.label}
                  onClick={() => {
                    item.onClick()
                    setMoreAnchor(null)
                  }}
                >
                  {item.label}
                </MenuItem>
              ))}
            </Menu>
          </>
        )}
      </Box>
    </Box>
  )
}
