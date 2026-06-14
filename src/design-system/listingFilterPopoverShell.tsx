import { useEffect, useState, type ReactNode } from 'react'
import { Box, Divider, Popover, Typography } from '@mui/material'
import { Button } from '@/design-system/UIComponents'
import {
  listingFilterPopoverPaperSx,
  listingFilterPopoverWidePaperSx,
} from './listingToolbarChrome'

export type ListingFilterPopoverWidth = 'default' | 'wide'

export interface ListingFilterPopoverShellProps<T> {
  open: boolean
  anchorEl: HTMLElement | null
  onClose: () => void
  value: T
  onApply: (value: T) => void
  onClear: () => void
  hasActive?: (value: T) => boolean
  width?: ListingFilterPopoverWidth
  scrollable?: boolean
  children: (draft: T, patch: (partial: Partial<T>) => void) => ReactNode
}

export function ListingFilterPopoverShell<T>({
  open,
  anchorEl,
  onClose,
  value,
  onApply,
  onClear,
  hasActive,
  width = 'default',
  scrollable = false,
  children,
}: ListingFilterPopoverShellProps<T>) {
  const [draft, setDraft] = useState<T>(value)

  useEffect(() => {
    if (open) {
      setDraft(value)
    }
  }, [open, value])

  const patch = (partial: Partial<T>) => {
    setDraft((current) => ({ ...current, ...partial }))
  }

  const draftActive = hasActive ? hasActive(draft) : false

  const handleApply = () => {
    onApply(draft)
    onClose()
  }

  const handleClear = () => {
    onClear()
    onClose()
  }

  const paperSx =
    width === 'wide' ? listingFilterPopoverWidePaperSx() : listingFilterPopoverPaperSx()

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      slotProps={{ paper: { sx: paperSx } }}
    >
      <Box sx={{ px: 2, pt: 1.5, pb: 1.5 }}>
        <Typography
          variant="caption"
          sx={{
            display: 'block',
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            color: 'text.secondary',
            mb: 1.25,
          }}
        >
          Filters
        </Typography>

        <Box
          sx={
            scrollable
              ? {
                  maxHeight: 360,
                  overflowY: 'auto',
                  mx: -0.5,
                  px: 0.5,
                  '&::-webkit-scrollbar': { width: 6 },
                  '&::-webkit-scrollbar-thumb': {
                    borderRadius: 999,
                    bgcolor: 'action.selected',
                  },
                }
              : undefined
          }
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
            {children(draft, patch)}
          </Box>
        </Box>

        <Divider sx={{ my: 1.25 }} />

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
          <Button
            label="Clear"
            variant="text"
            size="sm"
            disabled={!draftActive}
            onClick={handleClear}
            sx={{
              color: 'text.secondary',
              fontSize: 12,
              fontWeight: 500,
              minHeight: 28,
              px: 1,
              '&:hover': { color: 'text.primary', bgcolor: 'transparent' },
            }}
          />
          <Button label="Apply" variant="contained" size="sm" onClick={handleApply} />
        </Box>
      </Box>
    </Popover>
  )
}

export function ListingFilterField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
      <Typography
        component="span"
        sx={{ fontSize: 12, fontWeight: 600, color: 'text.secondary', lineHeight: 1.3 }}
      >
        {label}
      </Typography>
      {children}
    </Box>
  )
}
