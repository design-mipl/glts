import { Box, Typography, Tooltip } from '@mui/material'
import { alpha, useTheme } from '@mui/material/styles'
import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'
import { BORDER_RADIUS, tokens } from '../../../tokens'

/** Matches NavGroup expanded header columns (icon · label · chevron) */
const NAV_ICON_COLUMN_PX = 16
const NAV_CHEVRON_COLUMN_PX = 14
const NAV_ITEM_GAP_PX = 8
const NAV_ITEM_MX_PX = 8
const NAV_ITEM_PX_PX = 10
/** Extra inset so sub-items read as children of the expanded group row */
export const NAV_SUB_ITEM_INDENT_PX = 10

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
    display: isSubItem ? 'grid' : 'flex',
    gridTemplateColumns: isSubItem
      ? `${NAV_ICON_COLUMN_PX}px minmax(0, 1fr) ${NAV_CHEVRON_COLUMN_PX}px`
      : undefined,
    columnGap: isSubItem ? `${NAV_ITEM_GAP_PX}px` : undefined,
    alignItems: 'center',
    gap: isSubItem ? undefined : `${NAV_ITEM_GAP_PX}px`,
    px: `${NAV_ITEM_PX_PX}px`,
    ...(!isSubItem && { mx: `${NAV_ITEM_MX_PX}px` }),
    height,
    borderRadius: isSubItem ? BORDER_RADIUS.sm : tokens.borderRadius.md,
    ...(isSubItem && {
      ml: `${NAV_ITEM_MX_PX + NAV_SUB_ITEM_INDENT_PX}px`,
      mr: `${NAV_ITEM_MX_PX}px`,
      width: `calc(100% - ${NAV_ITEM_MX_PX * 2 + NAV_SUB_ITEM_INDENT_PX}px)`,
      maxWidth: `calc(100% - ${NAV_ITEM_MX_PX * 2 + NAV_SUB_ITEM_INDENT_PX}px)`,
    }),
    cursor: disabled ? 'default' : 'pointer',
    opacity: disabled ? 0.4 : 1,
    textDecoration: 'none',
    color: active
      ? (isSubItem ? theme.palette.primary.main : navigation.activeText)
      : navigation.textSecondary,
    bgcolor: active ? (isSubItem ? navigation.hover : navigation.activeBg) : 'transparent',
    fontWeight: active ? 600 : (isSubItem ? 400 : 450),
    transition: 'background-color 150ms ease, color 150ms ease',
    my: '1px',
    userSelect: 'none' as const,
    '&:hover': disabled ? {} : {
      bgcolor: active
        ? (isSubItem ? navigation.hover : navigation.activeBg)
        : navigation.hover,
      color: active
        ? (isSubItem ? theme.palette.primary.main : navigation.activeText)
        : navigation.textPrimary,
    },
    ...(!isSubItem && { width: '100%' }),
    minWidth: 0,
    boxSizing: 'border-box' as const,
  }

  /** Reserves the same trailing space as NavGroup chevron + gap */
  const chevronSpacerEl = isSubItem ? <Box aria-hidden sx={{ width: NAV_CHEVRON_COLUMN_PX, flexShrink: 0 }} /> : null

  // Sub-item dot — centered in the same 16px column as the parent group icon
  const dotEl = isSubItem ? (
    <Box
      sx={{
        width: NAV_ICON_COLUMN_PX,
        height: NAV_ICON_COLUMN_PX,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      <Box
        sx={{
          width: active ? 6 : 4,
          height: active ? 6 : 4,
          borderRadius: '50%',
          bgcolor: active
            ? (isSubItem ? theme.palette.primary.main : navigation.activeText)
            : navigation.textMuted,
        }}
      />
    </Box>
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
      {chevronSpacerEl}
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
      {chevronSpacerEl}
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
