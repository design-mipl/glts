import {
  Menu as MuiMenu, MenuItem, ListItemIcon, ListItemText,
  Typography, Divider,
} from '@mui/material'
import { useState, cloneElement } from 'react'
import type { ReactElement, ReactNode } from 'react'
import { Link as RouterLink } from 'react-router-dom'

export interface MenuItem_T {
  label: string
  icon?: ReactNode
  onClick?: () => void
  href?: string
  variant?: 'default' | 'destructive'
  disabled?: boolean
  divider?: boolean
  shortcut?: string
}

export interface MenuProps {
  trigger: ReactElement<{ onClick?: (event: React.MouseEvent<HTMLElement>) => void }>
  items: MenuItem_T[]
  placement?: 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end'
}

type AnchorOrigin = { vertical: 'top' | 'bottom'; horizontal: 'left' | 'right' }
type TransformOrigin = { vertical: 'top' | 'bottom'; horizontal: 'left' | 'right' }

function getOrigins(placement: MenuProps['placement']): { anchorOrigin: AnchorOrigin; transformOrigin: TransformOrigin } {
  switch (placement) {
    case 'bottom-end':
      return {
        anchorOrigin: { vertical: 'bottom', horizontal: 'right' },
        transformOrigin: { vertical: 'top', horizontal: 'right' },
      }
    case 'top-start':
      return {
        anchorOrigin: { vertical: 'top', horizontal: 'left' },
        transformOrigin: { vertical: 'bottom', horizontal: 'left' },
      }
    case 'top-end':
      return {
        anchorOrigin: { vertical: 'top', horizontal: 'right' },
        transformOrigin: { vertical: 'bottom', horizontal: 'right' },
      }
    default: // bottom-start
      return {
        anchorOrigin: { vertical: 'bottom', horizontal: 'left' },
        transformOrigin: { vertical: 'top', horizontal: 'left' },
      }
  }
}

export default function Menu({ trigger, items, placement = 'bottom-start' }: MenuProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const { anchorOrigin, transformOrigin } = getOrigins(placement)

  const triggerEl = cloneElement(trigger, {
    onClick: (e: React.MouseEvent<HTMLElement>) => {
      setAnchorEl(e.currentTarget)
      trigger.props.onClick?.(e)
    },
  })

  function handleClose() {
    setAnchorEl(null)
  }

  return (
    <>
      {triggerEl}
      <MuiMenu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={anchorOrigin}
        transformOrigin={transformOrigin}
        slotProps={{
          paper: {
            sx: {
              minWidth: 180,
              mt: 0.5,
              boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.10), 0 4px 6px -4px rgb(0 0 0 / 0.10)',
            },
          },
        }}
      >
        {items.map((item, i) => {
          if (item.divider) {
            return <Divider key={i} sx={{ my: 0.5 }} />
          }
          const color = item.variant === 'destructive' ? 'error.main' : 'text.primary'
          const menuItemProps = item.href
            ? { component: RouterLink, to: item.href }
            : {}
          return (
            <MenuItem
              key={i}
              disabled={item.disabled}
              onClick={() => {
                handleClose()
                item.onClick?.()
              }}
              sx={{ py: 0.75, px: 1.5, gap: 1 }}
              {...menuItemProps}
            >
              {item.icon && (
                <ListItemIcon sx={{ minWidth: 28, color }}>
                  <span style={{ display: 'flex', fontSize: 20 }}>{item.icon}</span>
                </ListItemIcon>
              )}
              <ListItemText
                primary={
                  <Typography variant="body2" color={color} fontWeight={400}>
                    {item.label}
                  </Typography>
                }
              />
              {item.shortcut && (
                <Typography variant="caption" color="text.disabled" sx={{ ml: 2 }}>
                  {item.shortcut}
                </Typography>
              )}
            </MenuItem>
          )
        })}
      </MuiMenu>
    </>
  )
}
