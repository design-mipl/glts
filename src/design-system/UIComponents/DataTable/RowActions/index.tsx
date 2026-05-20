import { useState } from 'react'
import { IconButton, Menu, MenuItem, ListItemIcon, ListItemText, Divider } from '@mui/material'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import type { ReactNode } from 'react'

export interface RowAction {
  label: string
  icon?: ReactNode
  onClick: (row: any) => void
  variant?: 'default' | 'destructive'
  disabled?: boolean
  divider?: boolean
}

export interface RowActionsProps {
  actions: RowAction[]
  row: any
  iconButton?: boolean
}

export default function RowActions({ actions, row, iconButton = true }: RowActionsProps) {
  void iconButton
  const [anchor, setAnchor] = useState<HTMLElement | null>(null)

  const handleOpen = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation()
    setAnchor(e.currentTarget)
  }

  const handleClose = () => setAnchor(null)

  return (
    <>
      <IconButton size="small" onClick={handleOpen} sx={{ color: 'text.secondary' }}>
        <MoreVertIcon fontSize="small" />
      </IconButton>
      <Menu
        anchorEl={anchor}
        open={Boolean(anchor)}
        onClose={handleClose}
        onClick={(e) => e.stopPropagation()}
        slotProps={{ paper: { sx: { minWidth: 160 } } }}
      >
        {actions.map((action, i) => [
          action.divider && i > 0 && <Divider key={`divider-${i}`} />,
          <MenuItem
            key={action.label}
            disabled={action.disabled}
            onClick={() => {
              handleClose()
              action.onClick(row)
            }}
            sx={action.variant === 'destructive' ? { color: 'error.main' } : undefined}
          >
            {action.icon && (
              <ListItemIcon sx={action.variant === 'destructive' ? { color: 'error.main' } : undefined}>
                {action.icon}
              </ListItemIcon>
            )}
            <ListItemText>{action.label}</ListItemText>
          </MenuItem>,
        ])}
      </Menu>
    </>
  )
}
