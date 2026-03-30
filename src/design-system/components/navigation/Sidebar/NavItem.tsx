import { Box, Typography, Tooltip, Badge } from '@mui/material'
import { alpha } from '@mui/material/styles'
import { useTheme } from '@mui/material/styles'
import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'
import { tokens } from '../../../tokens'

export interface NavItemProps {
  label: string
  icon: ReactNode
  href?: string
  onClick?: () => void
  active?: boolean
  badge?: number | string
  disabled?: boolean
  collapsed?: boolean
  depth?: number
}

export default function NavItem({
  label,
  icon,
  href,
  onClick,
  active = false,
  badge,
  disabled = false,
  collapsed = false,
  depth = 0,
}: NavItemProps) {
  const theme = useTheme()

  const depthPad = depth === 1 ? 16 : depth === 2 ? 32 : 0

  const rootSx = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    px: '12px',
    mx: '8px',
    height: '40px',
    borderRadius: tokens.borderRadius.md,
    cursor: disabled ? 'default' : 'pointer',
    opacity: disabled ? 0.4 : 1,
    textDecoration: 'none',
    color: active ? 'primary.main' : 'text.secondary',
    bgcolor: active ? alpha(theme.palette.primary.main, 0.1) : 'transparent',
    transition: `background-color ${tokens.transition.normal}, color ${tokens.transition.normal}`,
    paddingLeft: `${12 + depthPad}px`,
    userSelect: 'none' as const,
    '&:hover': disabled ? {} : {
      bgcolor: active
        ? alpha(theme.palette.primary.main, 0.12)
        : alpha(theme.palette.primary.main, 0.05),
      color: active ? 'primary.main' : 'text.primary',
    },
    width: '100%',
    minWidth: 0,
    boxSizing: 'border-box' as const,
  }

  const iconEl = (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 20,
        flexShrink: 0,
        color: 'inherit',
        width: 20,
        height: 20,
        position: 'relative',
      }}
    >
      {icon}
      {collapsed && badge !== undefined && (
        <Badge
          badgeContent={badge}
          color="primary"
          sx={{
            position: 'absolute',
            top: -4,
            right: -6,
            '& .MuiBadge-badge': { fontSize: 9, height: 14, minWidth: 14, p: '0 3px' },
          }}
        />
      )}
    </Box>
  )

  const labelEl = (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        flex: 1,
        minWidth: 0,
        overflow: 'hidden',
        opacity: collapsed ? 0 : 1,
        transition: `opacity ${tokens.transition.normal}`,
        whiteSpace: 'nowrap',
      }}
    >
      <Typography
        variant="body2"
        fontWeight={active ? 600 : 400}
        color="inherit"
        sx={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}
      >
        {label}
      </Typography>
      {!collapsed && badge !== undefined && (
        <Badge badgeContent={badge} color="primary" sx={{ '& .MuiBadge-badge': { position: 'static', transform: 'none', fontSize: 10, height: 16, minWidth: 16 } }} />
      )}
    </Box>
  )

  const inner = (
    <Box sx={rootSx} onClick={disabled ? undefined : onClick} role="button" tabIndex={disabled ? -1 : 0}
      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); if (!disabled) onClick?.() } }}
    >
      {iconEl}
      {labelEl}
    </Box>
  )

  const linked = href && !disabled ? (
    <Box component={Link} to={href} sx={{ ...rootSx, '&:focus-visible': { outline: `2px solid ${theme.palette.primary.main}`, outlineOffset: -2 } }}
      tabIndex={0}
    >
      {iconEl}
      {labelEl}
    </Box>
  ) : inner

  if (collapsed) {
    return (
      <Tooltip title={label} placement="right" arrow>
        <Box sx={{ display: 'block' }}>
          {linked}
        </Box>
      </Tooltip>
    )
  }

  return linked
}
