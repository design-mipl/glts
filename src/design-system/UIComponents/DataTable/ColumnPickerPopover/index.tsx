import {
  Box,
  Checkbox,
  Divider,
  FormControlLabel,
  FormGroup,
  Popover,
  Typography,
} from '@mui/material'
import Button from '../../Primitives/Button'
import { columnPickerPopoverPaperSx } from '../../../listingToolbarChrome'

export interface ColumnPickerItem {
  key: string
  label: string
  hideable?: boolean
}

export interface ColumnPickerPopoverProps {
  open: boolean
  anchorEl: HTMLElement | null
  onClose: () => void
  columns: ColumnPickerItem[]
  hiddenColumnKeys: string[]
  onHiddenColumnKeysChange: (keys: string[]) => void
  /** Column keys excluded from the picker (e.g. actions). */
  excludeKeys?: string[]
}

export default function ColumnPickerPopover({
  open,
  anchorEl,
  onClose,
  columns,
  hiddenColumnKeys,
  onHiddenColumnKeysChange,
  excludeKeys = ['actions'],
}: ColumnPickerPopoverProps) {
  const hideableColumns = columns.filter(
    col => col.hideable !== false && !excludeKeys.includes(col.key),
  )
  const visibleHideableCount = hideableColumns.filter(
    col => !hiddenColumnKeys.includes(col.key),
  ).length

  const toggleColumnHidden = (key: string) => {
    const isHidden = hiddenColumnKeys.includes(key)
    if (isHidden) {
      onHiddenColumnKeysChange(hiddenColumnKeys.filter(k => k !== key))
      return
    }
    if (visibleHideableCount <= 1) return
    onHiddenColumnKeysChange([...hiddenColumnKeys, key])
  }

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      slotProps={{ paper: { sx: columnPickerPopoverPaperSx() } }}
    >
      <Box sx={{ px: 2, pt: 1.5, pb: hiddenColumnKeys.length > 0 ? 1 : 1.5 }}>
        <Typography
          variant="caption"
          sx={{
            display: 'block',
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            color: 'text.secondary',
            mb: 1,
          }}
        >
          Show columns
        </Typography>

        <Box
          sx={{
            maxHeight: 320,
            overflowY: 'auto',
            mx: -0.5,
            px: 0.5,
            '&::-webkit-scrollbar': { width: 6 },
            '&::-webkit-scrollbar-thumb': {
              borderRadius: 999,
              bgcolor: 'action.selected',
            },
          }}
        >
          <FormGroup sx={{ gap: 0.25 }}>
            {hideableColumns.map(col => {
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
                      sx={{ p: 0.75 }}
                    />
                  }
                  label={col.label || col.key}
                  sx={{
                    mx: 0,
                    mr: 0,
                    py: 0.375,
                    px: 0.75,
                    borderRadius: '8px',
                    transition: 'background-color 0.15s ease',
                    '&:hover': { bgcolor: 'action.hover' },
                    '& .MuiFormControlLabel-label': {
                      fontSize: 13,
                      lineHeight: 1.35,
                      color: disableUncheck ? 'text.disabled' : 'text.primary',
                    },
                  }}
                />
              )
            })}
          </FormGroup>
        </Box>

        {hiddenColumnKeys.length > 0 ? (
          <>
            <Divider sx={{ my: 1.25 }} />
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Button
                label="Reset columns"
                variant="text"
                size="sm"
                onClick={() => {
                  onHiddenColumnKeysChange([])
                  onClose()
                }}
                sx={{
                  color: 'text.secondary',
                  fontSize: 12,
                  fontWeight: 500,
                  minHeight: 28,
                  px: 1,
                  '&:hover': {
                    color: 'text.primary',
                    bgcolor: 'transparent',
                  },
                }}
              />
            </Box>
          </>
        ) : null}
      </Box>
    </Popover>
  )
}
