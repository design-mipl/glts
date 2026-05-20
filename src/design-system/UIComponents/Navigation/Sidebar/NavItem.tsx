import { Box, Typography, Tooltip } from '@mui/material'
import { alpha, useTheme } from '@mui/material/styles'
import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'
import { tokens } from '../../../tokens'

export interface NavItemProps {
  label: string
  icon?: ReactNode
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
  const navigation = theme.foundation.navigation
  const isSubItem = depth >= 1

  const height = isSubItem ? '28px' : '32px'
  const fontSize = isSubItem ? '12.5px' : '13px'
  const fontWeight = active ? 600 : isSubItem ? 400 : 450

  const rootSx = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    px: '10px',
    mx: '8px',
    height,
    borderRadius: tokens.borderRadius.md,
    cursor: disabled ? 'default' : 'pointer',
    opacity: disabled ? 0.4 : 1,
    textDecoration: 'none',
    color: active
      ? navigation.activeText
      : navigation.textSecondary,
    bgcolor: active ? navigation.activeBg : 'transparent',
    fontWeight: active ? 600 : (isSubItem ? 400 : 450),
    transition: 'background-color 150ms ease, color 150ms ease',
    my: '1px',
    userSelect: 'none' as const,
    '&:hover': disabled ? {} : {
      bgcolor: active
        ? navigation.activeBg
        : navigation.hover,
      color: active ? navigation.activeText : navigation.textPrimary,
    },
    width: '100%',
    minWidth: 0,
    boxSizing: 'border-box' as const,
  }

  // Sub-item dot indicator
  const dotEl = isSubItem ? (
    <Box
      sx={{
        width: 4,
        height: 4,
        borderRadius: '50%',
        bgcolor: active ? navigation.activeText : navigation.textMuted,
        flexShrink: 0,
        ml: '8px',
        mr: '12px',
      }}
    />
  ) : null

  // Icon wrapper (top-level items only)
  const iconEl = !isSubItem && icon ? (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 16,
        height: 16,
        flexShrink: 0,
        color: 'inherit',
      }}
    >
      {icon}
    </Box>
  ) : null

  // Badge pill
  const badgeEl = badge !== undefined && !collapsed ? (
    <Box
      sx={{
        minWidth: 16,
        height: 16,
        fontSize: '10px',
        fontWeight: 600,
        borderRadius: '8px',
        px: '4px',
        lineHeight: '16px',
        bgcolor: active ? navigation.activeBg : alpha(navigation.textPrimary, 0.08),
        color: active ? navigation.activeText : navigation.textPrimary,
        ml: 'auto',
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {badge}
    </Box>
  ) : null

  // Collapsed badge dot
  const collapsedBadgeEl = badge !== undefined && collapsed && !isSubItem ? (
    <Box
      sx={{
        position: 'absolute',
        top: -2,
        right: -2,
        width: 6,
        height: 6,
        borderRadius: '50%',
        bgcolor: theme.palette.primary.main,
      }}
    />
  ) : null

  const labelEl = (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        flex: 1,
        minWidth: 0,
        overflow: 'hidden',
        opacity: collapsed ? 0 : 1,
        transition: `opacity ${tokens.transition.normal}`,
        whiteSpace: 'nowrap',
      }}
    >
      <Typography
        sx={{
          fontSize,
          fontWeight,
          lineHeight: 1,
          flex: 1,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          color: 'inherit',
        }}
      >
        {label}
      </Typography>
      {badgeEl}
    </Box>
  )

  const inner = (
    <Box
      sx={{ ...rootSx, position: 'relative' }}
      onClick={disabled ? undefined : onClick}
      role="button"
      tabIndex={disabled ? -1 : 0}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          if (!disabled) onClick?.()
        }
      }}
    >
      {isSubItem ? dotEl : (
        <>
          {iconEl && (
            <Box sx={{ position: 'relative' }}>
              {iconEl}
              {collapsedBadgeEl}
            </Box>
          )}
        </>
      )}
      {labelEl}
    </Box>
  )

  const linked = href && !disabled ? (
    <Box
      component={Link}
      to={href}
      sx={{
        ...rootSx,
        position: 'relative',
        '&:focus-visible': {
          outline: `2px solid ${theme.palette.primary.main}`,
          outlineOffset: -2,
        },
      }}
      tabIndex={0}
    >
      {isSubItem ? dotEl : (
        <>
          {iconEl && (
            <Box sx={{ position: 'relative' }}>
              {iconEl}
              {collapsedBadgeEl}
            </Box>
          )}
        </>
      )}
      {labelEl}
    </Box>
  ) : inner

  if (collapsed && !isSubItem) {
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
