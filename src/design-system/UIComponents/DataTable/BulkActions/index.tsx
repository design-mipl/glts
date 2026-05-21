import { Box, Typography, Button, IconButton, Tooltip, useMediaQuery, useTheme } from '@mui/material'
import { X } from 'lucide-react'
import type { BulkAction } from '../types'

export interface BulkActionsProps {
  selectedRows: any[]
  actions: BulkAction[]
  onAction: (action: BulkAction, rows: any[]) => void
  onDeselectAll: () => void
}

export default function BulkActions({ selectedRows, actions, onAction, onDeselectAll }: BulkActionsProps) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('xl'))

  if (selectedRows.length === 0) return null

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        px: 2,
        py: 1,
        bgcolor: 'primary.main',
        color: 'primary.contrastText',
        borderRadius: 1,
        mb: 0.5,
      }}
    >
      <Typography variant="body2" fontWeight={600} sx={{ mr: 1, flex: 'none' }}>
        {selectedRows.length} {selectedRows.length === 1 ? 'row' : 'rows'} selected
      </Typography>
      <Box sx={{ display: 'flex', gap: 0.5, flex: 1 }}>
        {actions.map((action) => (
          <Tooltip key={action.label} title={isMobile ? action.label : ''}>
            <Button
              size="small"
              variant="contained"
              onClick={() => onAction(action, selectedRows)}
              sx={{
                bgcolor: action.variant === 'destructive' ? 'error.main' : 'primary.dark',
                '&:hover': {
                  bgcolor: action.variant === 'destructive' ? 'error.dark' : 'primary.light',
                },
                color: '#fff',
                minWidth: isMobile ? 32 : undefined,
                px: isMobile ? 0.5 : 1.5,
              }}
              startIcon={isMobile ? undefined : (action.icon as any)}
            >
              {isMobile ? action.icon : action.label}
            </Button>
          </Tooltip>
        ))}
      </Box>
      <Tooltip title="Deselect all">
        <IconButton size="small" onClick={onDeselectAll} sx={{ color: 'primary.contrastText' }}>
          <X size={16} />
        </IconButton>
      </Tooltip>
    </Box>
  )
}
