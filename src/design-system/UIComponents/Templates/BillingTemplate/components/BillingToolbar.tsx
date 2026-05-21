import { useState } from 'react'
import {
  Box,
  Popover,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Typography,
  Divider,
} from '@mui/material'
import { Download, Grid3x3, List, Settings } from 'lucide-react'
import { Button, IconButton, SearchInput } from '@/design-system/components'
import { BORDER_RADIUS } from '@/design-system/tokens'

export interface BillingToolbarColumn {
  key: string
  label: string
  hideable?: boolean
}

export interface BillingToolbarProps {
  searchValue: string
  onSearch: (value: string) => void
  onExport?: () => void
  viewMode: 'table' | 'grid'
  onViewModeChange: (mode: 'table' | 'grid') => void
  columns?: BillingToolbarColumn[]
  hiddenColumnKeys?: string[]
  onHiddenColumnKeysChange?: (keys: string[]) => void
}

export default function BillingToolbar({
  searchValue,
  onSearch,
  onExport,
  viewMode,
  onViewModeChange,
  columns = [],
  hiddenColumnKeys = [],
  onHiddenColumnKeysChange,
}: BillingToolbarProps) {
  const [columnAnchor, setColumnAnchor] = useState<HTMLElement | null>(null)

  const hideableColumns = columns.filter((c) => c.hideable !== false && c.key !== 'actions')
  const columnPickerEnabled =
    hideableColumns.length >= 2 && Boolean(onHiddenColumnKeysChange)

  const visibleHideableCount = hideableColumns.filter(
    (c) => !hiddenColumnKeys.includes(c.key),
  ).length

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
    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', width: '100%' }}>
      <SearchInput
        value={searchValue}
        onChange={onSearch}
        placeholder="Invoice no. / client / project..."
        size="sm"
        sx={{
          width: { xs: '100%', sm: 280 },
          flexShrink: 0,
          flex: { xs: '1 1 auto', sm: '0 0 280px' },
        }}
      />

      <Box
        sx={{
          display: 'flex',
          gap: 1,
          alignItems: 'center',
          ml: 'auto',
          flexShrink: 0,
        }}
      >
        <Button
          variant="outlined"
          color="secondary"
          size="sm"
          startIcon={<Download size={16} strokeWidth={1.75} />}
          onClick={onExport}
        >
          <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
            Export
          </Box>
        </Button>

        {columnPickerEnabled && (
          <>
            <Button
              variant="outlined"
              color="secondary"
              size="sm"
              startIcon={<Settings size={16} strokeWidth={1.75} />}
              onClick={(e) => setColumnAnchor(e.currentTarget)}
            >
              <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
                Columns
              </Box>
            </Button>
            <Popover
              open={Boolean(columnAnchor)}
              anchorEl={columnAnchor}
              onClose={() => setColumnAnchor(null)}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              slotProps={{ paper: { sx: { minWidth: 220, p: 1.5, borderRadius: BORDER_RADIUS.lg } } }}
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
                      label={
                        <Typography variant="body2" sx={{ fontSize: 13 }}>
                          {col.label}
                        </Typography>
                      }
                      sx={{ mx: 0, height: 32 }}
                    />
                  )
                })}
              </FormGroup>
              {hiddenColumnKeys.length > 0 && (
                <>
                  <Divider sx={{ my: 1 }} />
                  <Button
                    variant="text"
                    color="secondary"
                    size="sm"
                    fullWidth
                    onClick={() => onHiddenColumnKeysChange?.([])}
                  >
                    Reset columns
                  </Button>
                </>
              )}
            </Popover>
          </>
        )}

        <IconButton
          size="sm"
          onClick={() => onViewModeChange(viewMode === 'table' ? 'grid' : 'table')}
          tooltip={viewMode === 'table' ? 'Grid view' : 'Table view'}
          sx={{
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: BORDER_RADIUS.md,
          }}
          icon={
            viewMode === 'table' ? (
              <Grid3x3 size={16} strokeWidth={1.75} />
            ) : (
              <List size={16} strokeWidth={1.75} />
            )
          }
        />
      </Box>
    </Box>
  )
}
